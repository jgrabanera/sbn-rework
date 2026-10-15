import Modal from "@/Components/Modal";

/**
 * PDF preview dialog backed by an <iframe>, which hands rendering to the
 * browser's built-in PDF viewer.
 *
 * Advantages over react-pdf: the document is displayed by the browser, so
 * the viewer's own search, zoom, print and page controls work, and the
 * heavy canvas/pdf.js bundle is not needed.
 *
 * Relies on the response being served as application/pdf and on no
 * X-Frame-Options / frame-ancestors header blocking the embed.
 */
const PdfModal = ({ open = false, title = "", url = null, onClose }) => (
    <Modal show={open} onClose={onClose} maxWidth="5xl">
        <div className="modal-panel">
            <div className="modal-header">
                <div className="min-w-0">
                    <h2 className="modal-title truncate">{title}</h2>
                    {url ? (
                        <p className="mt-1 truncate text-xs text-slate-500">
                            {decodeURIComponent(url.split("/").pop() ?? "")}
                        </p>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn-icon-secondary shrink-0"
                    aria-label="Close PDF"
                >
                    &times;
                </button>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-100 p-3">
                {url ? (
                    <iframe
                        key={url}
                        src={url}
                        title={title || "PDF preview"}
                        className="h-[75vh] w-full rounded-control border border-slate-200 bg-white"
                    />
                ) : (
                    <p className="py-10 text-center text-sm text-slate-600">
                        No file selected.
                    </p>
                )}
            </div>

            <div className="modal-footer">
                {url ? (
                    <>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                        >
                            Open in new tab
                        </a>
                        <a href={url} download className="btn-secondary">
                            Download
                        </a>
                    </>
                ) : null}
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary"
                >
                    Close
                </button>
            </div>
        </div>
    </Modal>
);

export default PdfModal;