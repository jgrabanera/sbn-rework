import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

/**
 * Row-level Edit/Delete controls.
 *
 * These five screens predate CategoryRecordsPage and each had its own
 * action markup: bare icon buttons on desktop (colour supplied as a hard
 * coded hex prop on the icon, no className on the button at all) and
 * plain text links on mobile. This component is the single definition so
 * they match the shared records table and are keyboard accessible.
 *
 * `showDelete` is explicit per breakpoint because delete visibility
 * currently differs per screen; passing it as a prop keeps that
 * difference visible in code instead of as commented-out JSX.
 */
const RowActions = ({
    onEdit,
    onDelete,
    showDelete = false,
    itemLabel = "record",
    variant = "icon",
}) => {
    if (variant === "labelled") {
        return (
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="btn-secondary h-9 flex-1"
                >
                    <AiOutlineEdit size={16} />
                    Edit
                </button>

                {showDelete ? (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="btn-icon-danger"
                        aria-label={`Delete ${itemLabel}`}
                    >
                        <MdDeleteForever size={16} />
                    </button>
                ) : null}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={onEdit}
                className="btn-icon-secondary"
                aria-label={`Edit ${itemLabel}`}
            >
                <AiOutlineEdit size={18} />
            </button>

            {showDelete ? (
                <button
                    type="button"
                    onClick={onDelete}
                    className="btn-icon-danger"
                    aria-label={`Delete ${itemLabel}`}
                >
                    <MdDeleteForever size={18} />
                </button>
            ) : null}
        </div>
    );
};

export default RowActions;