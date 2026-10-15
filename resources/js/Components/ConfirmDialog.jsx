import Modal from "@/Components/Modal";

/**
 * Confirmation dialog. Replaces window.confirm(), which blocks the main
 * thread, cannot be styled, and cannot render rich content.
 */
const ConfirmDialog = ({
    open = false,
    title = "Are you sure?",
    message = null,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmClassName = "btn-danger",
    busy = false,
    onConfirm = () => {},
    onCancel = () => {},
}) => (
    <Modal show={open} onClose={busy ? () => {} : onCancel} maxWidth="sm">
        <div className="modal-panel">
            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
            </div>

            <div className="modal-body">
                <p className="text-sm leading-6 text-slate-600">
                    {message ?? "This action cannot be undone."}
                </p>
            </div>

            <div className="modal-footer">
                <button
                    type="button"
                    className={confirmClassName}
                    onClick={onConfirm}
                    disabled={busy}
                >
                    {busy ? "Working..." : confirmLabel}
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                    disabled={busy}
                >
                    {cancelLabel}
                </button>
            </div>
        </div>
    </Modal>
);

export default ConfirmDialog;