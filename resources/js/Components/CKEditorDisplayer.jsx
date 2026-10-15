export default function CKEditorDisplayer({ content }) {
    if (!content) {
        return <p className="text-gray-400 italic">No content available.</p>;
    }

    return (
        <div
            className="ck-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
