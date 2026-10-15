import DOMPurify from "dompurify";

/**
 * Renders CMS rich-text content.
 *
 * Content arrives as raw HTML authored in CKEditor and stored as-is, so
 * it is untrusted: any account able to reach the CMS could otherwise
 * inject script into the public kiosk. Every render path funnels through
 * here so sanitisation happens in exactly one place.
 */
const CKEditorDisplayer = ({ content }) => {
    if (!content) {
        return <p className="text-gray-400 italic">No content available.</p>;
    }

    const safeHtml = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target", "rel"],
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["style"],
    });

    return (
        <div
            className="ck-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
};

export default CKEditorDisplayer;