import { FaRedo } from "react-icons/fa";

const shellClasses =
    "w-full flex flex-col items-center justify-center gap-3 rounded-xl bg-white/90 px-6 py-10 text-center shadow-lg";

const KioskLoading = ({ label = "Loading..." }) => (
    <div className={shellClasses} role="status" aria-live="polite">
        <span
            className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"
            aria-hidden="true"
        />
        <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
);

const KioskError = ({ message, onRetry }) => (
    <div className={shellClasses} role="alert">
        <p className="text-base font-semibold text-red-700">
            Unable to load this section
        </p>
        {message ? (
            <p className="max-w-md text-sm text-gray-600">{message}</p>
        ) : null}
        {onRetry ? (
            <button
                type="button"
                onClick={onRetry}
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-emerald-500"
            >
                <FaRedo aria-hidden="true" />
                Try again
            </button>
        ) : null}
    </div>
);

const KioskEmpty = ({ message = "No records found." }) => (
    <div className={shellClasses}>
        <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
);

export { KioskLoading, KioskError, KioskEmpty };