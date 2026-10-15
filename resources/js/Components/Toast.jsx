import { useCallback, useEffect, useState } from "react";

const VARIANT_STYLES = {
    success: "border-accent-200 bg-accent-50 text-accent-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-brand-200 bg-brand-50 text-brand-800",
};

/**
 * Transient banner state for admin screens.
 *
 * Returns `notify` plus the current `toast`, which should be rendered via
 * <ToastBanner />. Self-dismisses, and calling notify again replaces the
 * message and restarts the timer instead of stacking banners.
 */
export const useToast = ({ durationMs = 3000 } = {}) => {
    const [toast, setToast] = useState(null);

    const notify = useCallback((message, variant = "success") => {
        setToast({ message, variant, id: Date.now() });
    }, []);

    const dismiss = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(
            () => setToast(null),
            durationMs,
        );

        return () => window.clearTimeout(timer);
    }, [toast, durationMs]);

    return { toast, notify, dismiss };
};

export const ToastBanner = ({ toast, onDismiss }) => {
    if (!toast) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto fixed left-1/2 top-5 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-control border px-4 py-3 text-sm font-semibold shadow-lg ${
                VARIANT_STYLES[toast.variant] ??
                VARIANT_STYLES.success
            }`}
        >
            <span>{toast.message}</span>
            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss notification"
                className="shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100"
            >
                &times;
            </button>
        </div>
    );
};

export default ToastBanner;