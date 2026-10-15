import { useEffect, useRef } from "react";
import Modal from "@/Components/Modal";

/**
 * Video preview for a protected area.
 *
 * Closes on Escape (handled by the Dialog) and stops playback on close /
 * unmount so audio does not keep playing behind the dialog.
 */
const VideoPreviewModal = ({ open = false, title = "", src = null, onClose }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        return () => {
            const el = videoRef.current;
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
        };
    }, [open]);

    // `key` on the <video> forces a fresh element per record so closing and
    // reopening the same area replays from the start.
    return (
        <Modal show={open} onClose={onClose} maxWidth="3xl">
            <div className="modal-panel">
                <div className="modal-header">
                    <div className="min-w-0">
                        <h2 className="modal-title truncate">{title}</h2>
                        {src ? (
                            <p className="mt-1 truncate text-xs text-slate-500">
                                {src.split("/").pop()}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-icon-secondary shrink-0"
                        aria-label="Close video"
                    >
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    {src ? (
                        <video
                            key={src}
                            ref={videoRef}
                            src={src}
                            controls
                            autoPlay
                            playsInline
                            preload="metadata"
                            className="w-full rounded-control bg-black"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p className="text-sm text-slate-600">
                            No video has been uploaded for this area.
                        </p>
                    )}
                </div>

                <div className="modal-footer">
                    {src ? (
                        <a
                            href={src}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                        >
                            Open in new tab
                        </a>
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
};

export default VideoPreviewModal;