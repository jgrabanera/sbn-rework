import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    PageHeader,
    Pagination,
    SearchInput,
} from "@/Components/Cms";
import ConfirmDialog from "@/Components/ConfirmDialog";
import Modal from "@/Components/Modal";
import { ToastBanner, useToast } from "@/Components/Toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,
    Link as CKLink,
    BlockQuote,
    Undo,
    AutoImage,
    Base64UploadAdapter,
    Image,
    ImageToolbar,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageCaption,
    ImageStyle,
    PictureEditing,
    FontColor,
    Font,
    FontSize,
} from "ckeditor5";

const editorConfig = {
    licenseKey: "GPL",
    plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Heading,
        List,
        CKLink,
        BlockQuote,
        Undo,
        AutoImage,
        Base64UploadAdapter,
        Image,
        ImageToolbar,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageCaption,
        ImageStyle,
        PictureEditing,
        Font,
        FontColor,
        FontSize,
    ],
    toolbar: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "fontColor",
        "fontSize",
        "|",
        "bulletedList",
        "|",
        "blockQuote",
        "|",
        "insertImage",
    ],
};

const EMPTY_PAGE = {
    data: [],
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
};

const CategoryRecordsPage = ({
    title,
    description,
    endpoint,
    searchPlaceholder,
    emptyLabel,
    columns,
    mobileFields,
    createConfig = null,
    editConfig = null,
    deleteConfig = null,
}) => {
    const [records, setRecords] = useState(EMPTY_PAGE);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [areas, setAreas] = useState([]);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { toast, notify, dismiss } = useToast();

    const isEditable = Boolean(editConfig);
    const canCreate = Boolean(createConfig?.storeEndpoint);
    const canDelete = Boolean(deleteConfig?.deleteEndpoint);
    const activeFields = editingRecord
        ? (editConfig?.fields ?? [])
        : (createConfig?.fields ?? editConfig?.fields ?? []);

    const buildEmptyForm = () =>
        [...activeFields].reduce((current, field) => {
            current[field.name] = field.type === "file" ? null : "";
            return current;
        }, {});

    const buildFormFromRecord = (record) =>
        (editConfig?.fields ?? []).reduce((current, field) => {
            if (field.type === "file") {
                current[field.name] = null;
                return current;
            }

            const value =
                field.getValue?.(record) ?? record[field.name] ?? "";
            current[field.name] = String(value ?? "");
            return current;
        }, {});

    /* ---- Data loading ------------------------------------------- */

    const loadAreas = async () => {
        setLookupLoading(true);
        try {
            const res = await axios.get("/loadAllAreas");
            setAreas(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading area options:", error);
        } finally {
            setLookupLoading(false);
        }
    };

    const loadRecords = async (page = 1, keyword = search) => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await axios.get(endpoint, {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords({ ...EMPTY_PAGE, ...res.data });
        } catch (error) {
            console.error(
                `Error loading ${title.toLowerCase()} records:`,
                error,
            );
            setLoadError(
                error?.response?.data?.message ??
                    "The request did not complete.",
            );
            setRecords(EMPTY_PAGE);
        } finally {
            setLoading(false);
        }
    };

    // Debounce the search box so typing does not fire a request per key.
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearch(searchInput.trim());
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        loadRecords(1, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        if (isEditable) loadAreas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditable]);

    /* ---- Derived ------------------------------------------------ */

    const rows = records.data ?? [];
    const listError = loadError;
    const hasRows = rows.length > 0;

    const rowSummary = useMemo(() => {
        if (loading) return `Loading ${title.toLowerCase()} records...`;

        if (!hasRows) {
            return search
                ? `No ${emptyLabel} match the current search.`
                : `No ${emptyLabel} found.`;
        }

        return `${rows.length} ${emptyLabel}${
            rows.length === 1 ? "" : "s"
        } on this page`;
    }, [emptyLabel, hasRows, loading, rows.length, search, title]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadRecords(page, search);
        }
    };

    /* ---- Modal -------------------------------------------------- */

    const closeModal = () => {
        setModalOpen(false);
        setEditingRecord(null);
        setForm({});
        setErrors({});
    };

    const openCreateModal = () => {
        setEditingRecord(null);
        setForm(buildEmptyForm());
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setForm(buildFormFromRecord(record));
        setErrors({});
        setModalOpen(true);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const changedField = activeFields.find(
            (field) => field.name === name,
        );
        const nextValue =
            changedField?.type === "file" ? (files?.[0] ?? null) : value;

        // Switching area in the form re-points the modal at the matching
        // record so article/image fields show that area's content.
        const isAreaField =
            changedField?.type === "select" &&
            (name === "area_id" || name === "areaID");

        if (isAreaField) {
            const matchedRecord = rows.find(
                (record) =>
                    String(record.area_id ?? record.areaID ?? "") === value,
            );

            if (matchedRecord) {
                setEditingRecord(matchedRecord);
                setForm(buildFormFromRecord(matchedRecord));
                setErrors({});
                return;
            }
        }

        setForm((current) => ({ ...current, [name]: nextValue }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            (editingRecord && !editConfig?.updateEndpoint) ||
            (!editingRecord && !createConfig?.storeEndpoint)
        ) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const payload = new FormData();

            activeFields.forEach((field) => {
                const value = form[field.name];

                if (field.type === "file") {
                    if (value) payload.append(field.name, value);
                    return;
                }

                payload.append(field.name, value ?? "");
            });

            if (editingRecord) {
                await axios.post(
                    editConfig.updateEndpoint(editingRecord.id),
                    payload,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );
            } else {
                await axios.post(createConfig.storeEndpoint, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            notify(
                editingRecord
                    ? `${title} updated successfully.`
                    : `${title} added successfully.`,
            );

            const page = editingRecord ? records.current_page : 1;
            closeModal();
            await loadRecords(page, search);
        } catch (error) {
            console.error(
                `Error saving ${title.toLowerCase()} record:`,
                error,
            );

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
                notify("Please correct the highlighted fields.", "error");
            } else {
                notify(
                    error.response?.data?.message ??
                        `Unable to save ${title.toLowerCase()} record.`,
                    "error",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* ---- Delete ------------------------------------------------- */

    const confirmDelete = async () => {
        if (!pendingDelete || !canDelete) return;

        setDeleting(true);

        try {
            await axios.delete(
                deleteConfig.deleteEndpoint(pendingDelete.id),
            );

            const nextPage =
                rows.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            notify(
                deleteConfig?.successMessage?.(pendingDelete) ??
                    `${title} deleted successfully.`,
            );
            setPendingDelete(null);
            await loadRecords(nextPage, search);
        } catch (error) {
            console.error(
                `Error deleting ${title.toLowerCase()} record:`,
                error,
            );
            notify(
                error.response?.data?.message ??
                    `Unable to delete ${title.toLowerCase()} record.`,
                "error",
            );
        } finally {
            setDeleting(false);
        }
    };

    /* ---- Render ------------------------------------------------- */

    const tableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td
                        colSpan={columns.length + (isEditable ? 1 : 0)}
                        className="px-4 py-12"
                    >
                        <LoadingState />
                    </td>
                </tr>
            );
        }

        if (listError) {
            return (
                <tr>
                    <td
                        colSpan={columns.length + (isEditable ? 1 : 0)}
                        className="px-4 py-12"
                    >
                        <ErrorState
                            message={listError}
                            onRetry={() => loadRecords(1, search)}
                        />
                    </td>
                </tr>
            );
        }

        if (!hasRows) {
            return (
                <tr>
                    <td
                        colSpan={columns.length + (isEditable ? 1 : 0)}
                        className="px-4 py-12"
                    >
                        <EmptyState
                            message={
                                search
                                    ? `No ${emptyLabel} match the current search.`
                                    : `No ${emptyLabel} found.`
                            }
                        />
                    </td>
                </tr>
            );
        }

        return rows.map((record) => (
            <tr key={record.id}>
                {columns.map((column) => (
                    <td
                        key={`${record.id}-${column.header}`}
                        className={column.cellClassName ?? ""}
                    >
                        {column.render(record)}
                    </td>
                ))}
                {isEditable ? (
                    <td>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => openEditModal(record)}
                                className="btn-icon-secondary"
                                aria-label={`Edit ${emptyLabel}`}
                            >
                                <AiOutlineEdit size={18} />
                            </button>
                            {canDelete ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPendingDelete(record)
                                    }
                                    className="btn-icon-danger"
                                    aria-label={`Delete ${emptyLabel}`}
                                >
                                    <MdDeleteForever size={18} />
                                </button>
                            ) : null}
                        </div>
                    </td>
                ) : null}
            </tr>
        ));
    };

    return (
        <>
            <Head title={title} />

            <ToastBanner toast={toast} onDismiss={dismiss} />

            <div className="cms-shell">
                <div className="cms-container">
                    <PageHeader
                        title={title}
                        description={description}
                        search={
                            <SearchInput
                                value={searchInput}
                                onChange={setSearchInput}
                                placeholder={searchPlaceholder}
                            />
                        }
                        actions={
                            canCreate ? (
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    disabled={lookupLoading}
                                    className="btn-accent"
                                >
                                    <FaPlusCircle size={18} />
                                    {createConfig?.buttonLabel ??
                                        "Add Record"}
                                </button>
                            ) : null
                        }
                    />

                    <div className="cms-card overflow-hidden p-0">
                        <div className="table-shell">
                            <div className="table-scroll">
                                <table className="table hidden md:table">
                                    <thead>
                                        <tr>
                                            {columns.map((column) => (
                                                <th
                                                    key={column.header}
                                                    className={
                                                        column.headerClassName ??
                                                        ""
                                                    }
                                                >
                                                    {column.header}
                                                </th>
                                            ))}
                                            {isEditable ? (
                                                <th className="w-24 text-center">
                                                    Actions
                                                </th>
                                            ) : null}
                                        </tr>
                                    </thead>
                                    <tbody>{tableBody()}</tbody>
                                </table>

                                {/* Card layout for small screens */}
                                <div className="space-y-3 p-3 md:hidden">
                                    {loading ? (
                                        <LoadingState />
                                    ) : listError ? (
                                        <ErrorState
                                            message={listError}
                                            onRetry={() =>
                                                loadRecords(1, search)
                                            }
                                        />
                                    ) : !hasRows ? (
                                        <EmptyState
                                            message={
                                                search
                                                    ? `No ${emptyLabel} match the current search.`
                                                    : `No ${emptyLabel} found.`
                                            }
                                        />
                                    ) : (
                                        rows.map((record) => (
                                            <article
                                                key={record.id}
                                                className="rounded-control border border-slate-200 bg-white p-4 shadow-sm"
                                            >
                                                {mobileFields.map((field) => (
                                                    <div
                                                        key={`${record.id}-${field.label}`}
                                                        className={
                                                            field.wrapperClassName ??
                                                            "mt-3 first:mt-0"
                                                        }
                                                    >
                                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            {field.label}
                                                        </span>
                                                        <div className="mt-1 text-sm text-slate-700">
                                                            {field.render(
                                                                record,
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {isEditable ? (
                                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    record,
                                                                )
                                                            }
                                                            className="btn-secondary h-9 flex-1"
                                                        >
                                                            <AiOutlineEdit
                                                                size={16}
                                                            />
                                                            Edit
                                                        </button>
                                                        {canDelete ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setPendingDelete(
                                                                        record,
                                                                    )
                                                                }
                                                                className="btn-icon-danger"
                                                                aria-label={`Delete ${emptyLabel}`}
                                                            >
                                                                <MdDeleteForever
                                                                    size={16}
                                                                />
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </article>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pb-4 pt-1 md:px-6">
                            <p className="py-2 text-xs font-medium text-slate-500">
                                {rowSummary}
                            </p>
                            <Pagination
                                page={records.current_page}
                                lastPage={records.last_page}
                                hasPrev={Boolean(records.prev_page_url)}
                                hasNext={Boolean(records.next_page_url)}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Record form */}
            <Modal
                show={modalOpen}
                onClose={closeModal}
                maxWidth="2xl"
            >
                <form
                    onSubmit={handleSubmit}
                    className="modal-panel rounded-none"
                >
                    <div className="modal-header">
                        <div>
                            <h2 className="modal-title">
                                {editingRecord
                                    ? (editConfig?.modalTitle ??
                                      `Edit ${title}`)
                                    : (createConfig?.modalTitle ??
                                      `New ${title}`)}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Fields marked with an asterisk are required.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeModal}
                            className="btn-icon-secondary shrink-0"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {activeFields.map((field) => {
                                const isSelect = field.type === "select";
                                const isFile = field.type === "file";
                                const isRichText =
                                    field.type === "ckeditor";
                                const isTextArea =
                                    field.type === "textarea";
                                const fieldValue = form[field.name] ?? "";
                                const wrapperClassName =
                                    field.fullWidth === false
                                        ? ""
                                        : "md:col-span-2";
                                const existingImage =
                                    field.previewValue?.(
                                        editingRecord,
                                    ) ??
                                    editingRecord?.[
                                        field.previewKey ?? ""
                                    ];

                                return (
                                    <div
                                        key={field.name}
                                        className={wrapperClassName}
                                    >
                                        <label
                                            className="label"
                                            htmlFor={`field-${field.name}`}
                                        >
                                            {field.label}
                                            {field.required ? (
                                                <span className="ml-0.5 text-rose-500">
                                                    *
                                                </span>
                                            ) : null}
                                        </label>

                                        {isSelect ? (
                                            <select
                                                id={`field-${field.name}`}
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                disabled={lookupLoading}
                                                className="select"
                                            >
                                                <option value="">
                                                    {field.placeholder ??
                                                        "Select an area"}
                                                </option>
                                                {areas.map((area) => (
                                                    <option
                                                        key={area.id}
                                                        value={area.id}
                                                    >
                                                        {area.areaName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : isRichText ? (
                                            <div className="overflow-hidden rounded-control border border-slate-300">
                                                <CKEditor
                                                    key={`${
                                                        editingRecord?.id ??
                                                        "new"
                                                    }-${field.name}`}
                                                    editor={ClassicEditor}
                                                    config={editorConfig}
                                                    data={fieldValue}
                                                    onChange={(
                                                        _,
                                                        editor,
                                                    ) => {
                                                        setForm(
                                                            (current) => ({
                                                                ...current,
                                                                [field.name]:
                                                                    editor.getData(),
                                                            }),
                                                        );
                                                        setErrors(
                                                            (current) => ({
                                                                ...current,
                                                                [field.name]:
                                                                    "",
                                                            }),
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ) : isTextArea ? (
                                            <textarea
                                                id={`field-${field.name}`}
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                rows={field.rows ?? 5}
                                                placeholder={
                                                    field.placeholder ??
                                                    ""
                                                }
                                                className="input"
                                            />
                                        ) : isFile ? (
                                            <>
                                                <input
                                                    id={`field-${field.name}`}
                                                    name={field.name}
                                                    type="file"
                                                    accept={
                                                        field.accept ??
                                                        ".jpg,.jpeg,.png,.webp,.gif"
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="input file:mr-3 file:rounded-control file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                                                />
                                                {field.hint ? (
                                                    <p className="field-hint">
                                                        {field.hint}
                                                    </p>
                                                ) : null}
                                            </>
                                        ) : (
                                            <input
                                                id={`field-${field.name}`}
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                type={
                                                    field.type ?? "text"
                                                }
                                                placeholder={
                                                    field.placeholder ??
                                                    ""
                                                }
                                                className="input"
                                            />
                                        )}

                                        {field.previewImage ? (
                                            <div className="mt-3">
                                                {form[field.name] ? (
                                                    <p className="field-hint">
                                                        New file:{" "}
                                                        {
                                                            form[field.name]
                                                                .name
                                                        }
                                                    </p>
                                                ) : existingImage ? (
                                                    <img
                                                        src={`/storage/images/${existingImage}`}
                                                        alt={
                                                            editingRecord?.areaName ??
                                                            title
                                                        }
                                                        className="h-28 w-full max-w-xs rounded-control border border-slate-200 object-cover"
                                                    />
                                                ) : (
                                                    <p className="field-hint">
                                                        No image preview
                                                        available.
                                                    </p>
                                                )}
                                            </div>
                                        ) : null}

                                        {errors[field.name] ? (
                                            <p className="field-error">
                                                {Array.isArray(
                                                    errors[field.name],
                                                )
                                                    ? errors[
                                                          field.name
                                                      ][0]
                                                    : errors[field.name]}
                                            </p>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary"
                        >
                            {submitting
                                ? "Saving..."
                                : editingRecord
                                  ? "Update"
                                  : (createConfig?.submitLabel ??
                                    "Save")}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                busy={deleting}
                title="Delete record"
                message={
                    // The optional call `confirmMessage?.(record)` guards the
                    // function, not the argument, so it must not run before a
                    // record is staged or page configs reading `record.x`
                    // throw on null.
                    pendingDelete
                        ? (deleteConfig?.confirmMessage?.(pendingDelete) ??
                          `This ${emptyLabel} will be permanently deleted.`)
                        : `This ${emptyLabel} will be permanently deleted.`
                }
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    );
};

export default CategoryRecordsPage;