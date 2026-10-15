<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class QuizCmsController extends Controller
{
    public function index(Request $request): LengthAwarePaginator
    {
        $perPage = max((int) $request->get('per_page', 10), 1);
        $page = max((int) $request->get('page', 1), 1);
        $search = trim((string) $request->get('search', ''));

        $records = DB::table('table_choices')
            ->orderByDesc('id')
            ->get()
            ->map(fn ($row) => $this->transformRow($row));

        if ($search !== '') {
            $needle = mb_strtolower($search);
            $records = $records->filter(function ($record) use ($needle) {
                $haystack = mb_strtolower(implode(' ', [
                    $record['question_text'] ?? '',
                    $record['question_image'] ?? '',
                    $record['choice1_text'] ?? '',
                    $record['choice2_text'] ?? '',
                    $record['choice3_text'] ?? '',
                    $record['choice4_text'] ?? '',
                    $record['answer_key'] ?? '',
                ]));

                return str_contains($haystack, $needle);
            })->values();
        }

        $total = $records->count();
        $items = $records->slice(($page - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);
        $questionImage = $this->storeQuestionImage($request);

        $id = DB::table('table_choices')->insertGetId(
            $this->buildPayload($validated, $questionImage)
        );

        return response()->json([
            'message' => 'Quiz question created successfully.',
            'data' => $this->transformRow(
                DB::table('table_choices')->where('id', $id)->first()
            ),
        ], 201);
    }

    public function update(Request $request, int $quiz)
    {
        $validated = $this->validatePayload($request);
        $existing = DB::table('table_choices')->where('id', $quiz)->first();
        abort_unless($existing, 404);

        $existingImage = $this->transformRow($existing)['question_image'] ?? null;
        $questionImage = $existingImage;

        if ($request->hasFile('question_image_file')) {
            $this->deleteStoredQuestionImage($existingImage);
            $questionImage = $this->storeQuestionImage($request);
        }

        DB::table('table_choices')
            ->where('id', $quiz)
            ->update($this->buildPayload($validated, $questionImage));

        return response()->json([
            'message' => 'Quiz question updated successfully.',
            'data' => $this->transformRow(
                DB::table('table_choices')->where('id', $quiz)->first()
            ),
        ]);
    }

    public function destroy(int $quiz)
    {
        $existing = DB::table('table_choices')->where('id', $quiz)->first();

        if ($existing) {
            $this->deleteStoredQuestionImage(
                $this->transformRow($existing)['question_image'] ?? null
            );
        }

        DB::table('table_choices')->where('id', $quiz)->delete();

        return response()->json([
            'message' => 'Quiz question deleted successfully.',
        ]);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'level_of_difficulty' => ['required', 'integer', 'min:1', 'max:10'],
            'question_text' => ['required', 'string'],
            'question_image' => ['nullable', 'string'],
            'question_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'choice1_text' => ['required', 'string'],
            'choice2_text' => ['required', 'string'],
            'choice3_text' => ['required', 'string'],
            'choice4_text' => ['required', 'string'],
            'answer_key' => ['required', 'in:choice1,choice2,choice3,choice4'],
        ]);
    }

    private function buildPayload(array $validated, ?string $questionImage = null): array
    {
        return [
            'level_of_difficulty' => (int) $validated['level_of_difficulty'],
            'question' => $this->encodeDelta(
                $validated['question_text'],
                $questionImage
            ),
            'choice1' => $this->encodeDelta($validated['choice1_text']),
            'choice2' => $this->encodeDelta($validated['choice2_text']),
            'choice3' => $this->encodeDelta($validated['choice3_text']),
            'choice4' => $this->encodeDelta($validated['choice4_text']),
            'answer' => json_encode($validated['answer_key']),
        ];
    }

    private function transformRow(object $row): array
    {
        $question = $this->parseDeltaContent($row->question);
        $choice1 = $this->parseDeltaContent($row->choice1);
        $choice2 = $this->parseDeltaContent($row->choice2);
        $choice3 = $this->parseDeltaContent($row->choice3);
        $choice4 = $this->parseDeltaContent($row->choice4);

        return [
            'id' => (int) $row->id,
            'level_of_difficulty' => (int) $row->level_of_difficulty,
            'question_text' => $question['text'],
            'question_image' => $question['image'],
            'choice1_text' => $choice1['text'],
            'choice2_text' => $choice2['text'],
            'choice3_text' => $choice3['text'],
            'choice4_text' => $choice4['text'],
            'answer_key' => $this->normalizeAnswerKey($row->answer),
        ];
    }

    private function parseDeltaContent(?string $rawJson): array
    {
        $delta = $this->decodeDelta($rawJson);
        $text = collect($delta)
            ->map(function ($item) {
                $insert = $item['insert'] ?? null;

                return is_string($insert) ? $insert : '';
            })
            ->implode('');

        $image = collect($delta)
            ->map(function ($item) {
                return $item['insert']['image'] ?? null;
            })
            ->first(fn ($value) => filled($value));

        return [
            'text' => trim(preg_replace('/\s+/', ' ', $text ?? '')),
            'image' => $image,
        ];
    }

    private function decodeDelta(?string $rawJson): array
    {
        if (!$rawJson) {
            return [];
        }

        $decoded = json_decode($rawJson, true);

        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }

        if (isset($decoded['ops']) && is_array($decoded['ops'])) {
            return $decoded['ops'];
        }

        return is_array($decoded) ? $decoded : [];
    }

    private function encodeDelta(string $text, ?string $image = null): string
    {
        $ops = [];

        if (filled($text)) {
            $ops[] = ['insert' => trim($text) . "\n"];
        }

        if (filled($image)) {
            $ops[] = ['insert' => ['image' => $image]];
            $ops[] = ['insert' => "\n"];
        }

        return json_encode(json_encode($ops, JSON_UNESCAPED_SLASHES));
    }

    private function storeQuestionImage(Request $request): ?string
    {
        if (!$request->hasFile('question_image_file')) {
            return null;
        }

        $path = $request->file('question_image_file')->store('quiz-images', 'public');

        return '/storage/' . $path;
    }

    private function deleteStoredQuestionImage(?string $imagePath): void
    {
        if (!$imagePath || !str_starts_with($imagePath, '/storage/')) {
            return;
        }

        $storagePath = ltrim(str_replace('/storage/', '', $imagePath), '/');

        if ($storagePath !== '') {
            Storage::disk('public')->delete($storagePath);
        }
    }

    private function normalizeAnswerKey(mixed $answerKey): ?string
    {
        if ($answerKey === null) {
            return null;
        }

        $normalized = trim((string) $answerKey);
        $decoded = json_decode($normalized, true);

        if (is_string($decoded)) {
            $normalized = $decoded;
        }

        $normalized = trim($normalized, " \t\n\r\0\x0B\"'");

        return $normalized !== '' ? $normalized : null;
    }
}
