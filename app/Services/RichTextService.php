<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Shared rich-text handling for CMS content.
 *
 * Centralises the logic that was previously copy-pasted into six
 * controllers, where the image extension was taken verbatim from the
 * `data:` URI in user supplied HTML. That allowed an attacker to write
 * an arbitrary extension (e.g. `.php`) into the web-served public disk.
 */
class RichTextService
{
    /**
     * Extensions we are willing to persist, mapped to the canonical
     * extension we store them under. The value is NOT derived from input.
     */
    private const ALLOWED_IMAGE_TYPES = [
        'jpeg' => 'jpg',
        'jpg' => 'jpg',
        'png' => 'png',
        'gif' => 'gif',
        'webp' => 'webp',
    ];

    /** Hard ceiling for a single inline image. */
    private const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

    private const IMAGE_DIRECTORY = 'images';

    /**
     * Rewrite inline `data:` images to real files on the public disk and
     * return the resulting HTML.
     */
    public function convertToPlainHtml(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $dom = new \DOMDocument();

        libxml_use_internal_errors(true);

        // Force UTF-8 encoding
        $dom->loadHTML(
            '<?xml encoding="utf-8" ?>' . $html,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();

        foreach ($dom->getElementsByTagName('img') as $img) {
            $src = $img->getAttribute('src');

            if (! Str::startsWith($src, 'data:image')) {
                continue;
            }

            $stored = $this->storeInlineImage($src);

            if ($stored !== null) {
                $img->setAttribute('src', '/storage/' . $stored);
            } else {
                // Drop images we refuse to persist rather than leaving an
                // unbounded data: URI in the document.
                $img->parentNode?->removeChild($img);
            }
        }

        return $dom->saveHTML();
    }

    /**
     * Persist a `data:` image, returning its relative path, or null when
     * the payload is not a supported image.
     */
    private function storeInlineImage(string $dataUri): ?string
    {
        // Only match the exact, expected shape. The subtype group is
        // restricted so it cannot be used to smuggle e.g. `php`.
        if (! preg_match(
            '#^data:image/(jpeg|jpg|png|gif|webp);base64,(.+)$#is',
            $dataUri,
            $match
        )) {
            return null;
        }

        $extension = self::ALLOWED_IMAGE_TYPES[strtolower($match[1])] ?? null;

        if ($extension === null) {
            return null;
        }

        $decoded = base64_decode($match[2], true);

        if ($decoded === false || $decoded === '') {
            return null;
        }

        if (strlen($decoded) > self::MAX_IMAGE_BYTES) {
            return null;
        }

        // Verify the bytes really are an image of the claimed type. This
        // is what stops a renamed/polyglot payload from being written.
        if (@getimagesizefromstring($decoded) === false) {
            return null;
        }

        $filename = self::IMAGE_DIRECTORY . '/' . Str::uuid()->toString() . '.' . $extension;

        Storage::disk('public')->put($filename, $decoded);

        return $filename;
    }

    /**
     * Best-effort removal of previously extracted inline images when the
     * owning record is updated or deleted, so the public disk does not
     * grow without bound.
     */
    public function deleteExtractedImages(?string $html): void
    {
        if (! $html || ! Str::contains($html, '/storage/images/')) {
            return;
        }

        preg_match_all('#/storage/images/([A-Za-z0-9\-_]+\.[a-z0-9]+)#i', $html, $matches);

        foreach ($matches[1] ?? [] as $basename) {
            Storage::disk('public')->delete(self::IMAGE_DIRECTORY . '/' . $basename);
        }
    }
}