/**
 * Shared chrome for admin screens.
 *
 * Extracted so every CMS page renders an identical header, search field and
 * state panel instead of each one restating its own utility strings.
 */

export const PageHeader = ({
    title,
    description = null,
    actions = null,
    search = null,
}) => (
    <header className="cms-card mb-5 flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
        <div className="min-w-0">
            <h1 className="cms-page-title">{title}</h1>
            {description ? (
                <p className="cms-page-description">{description}</p>
            ) : null}
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            {search}
            {actions}
        </div>
    </header>
);

export const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    label = "Search records",
    className = "",
}) => (
    <div className={`w-full md:w-80 ${className}`}>
        <label className="sr-only" htmlFor="cms-search">
            {label}
        </label>
        <input
            id="cms-search"
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="input"
        />
    </div>
);

export const LoadingState = ({ label = "Loading records..." }) => (
    <div className="state-panel" role="status" aria-live="polite">
        <span
            className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-500 border-t-transparent"
            aria-hidden="true"
        />
        <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
);

export const EmptyState = ({ message = "No records found." }) => (
    <div className="state-panel">
        <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
);

export const ErrorState = ({ message = null, onRetry = null }) => (
    <div
        className="state-panel border-rose-200 bg-rose-50"
        role="alert"
    >
        <p className="text-sm font-semibold text-rose-800">
            Unable to load this section
        </p>
        {message ? (
            <p className="max-w-md text-sm text-rose-700">{message}</p>
        ) : null}
        {onRetry ? (
            <button
                type="button"
                onClick={onRetry}
                className="btn-secondary"
            >
                Try again
            </button>
        ) : null}
    </div>
);

export const Pagination = ({ page, lastPage, hasPrev, hasNext, onChange }) => {
    if (lastPage <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4"
        >
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={!hasPrev}
                className="btn-secondary h-9 px-3"
            >
                Previous
            </button>

            <span className="text-sm font-medium text-slate-600">
                Page {page} of {lastPage}
            </span>

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={!hasNext}
                className="btn-secondary h-9 px-3"
            >
                Next
            </button>
        </nav>
    );
};

/** Strip markup so rich-text previews and tooltips read as plain text. */
const toPlainText = (value) =>
    String(value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();

/** Keep the hover tooltip readable; a 2000-char description is not a tooltip. */
const TOOLTIP_LIMIT = 220;

/**
 * Long-text cell content, clamped to a fixed number of lines.
 *
 * Clamping by line count rather than by character count keeps row heights
 * uniform and adapts to the column width instead of assuming a fixed
 * character budget.
 *
 * The width cap is load-bearing, not cosmetic: `max-w-*` on a <td> is
 * ignored under auto table layout, and `display:-webkit-box` reports a
 * max-content width equal to the whole unwrapped string. Without an
 * explicit width the column stretches to fit the entire description on one
 * line, which makes the clamp a no-op and blows out the table. Setting the
 * width on the clamped element constrains the column from inside.
 */
export const ClampText = ({
    value,
    lines = 2,
    className = "",
    widthClass = "max-w-[22rem]",
    empty = "-",
}) => {
    const text = toPlainText(value);

    if (!text) {
        return <span className="text-slate-400">{empty}</span>;
    }

    const tooltip =
        text.length > TOOLTIP_LIMIT
            ? `${text.slice(0, TOOLTIP_LIMIT).trimEnd()}...`
            : text;

    return (
        <span
            className={`${widthClass} line-clamp-${lines} ${className}`}
            title={tooltip}
        >
            {text}
        </span>
    );
};
