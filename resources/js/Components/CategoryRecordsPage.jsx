import React, { useEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Modal from "@/Components/Modal";
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
    const [records, setRecords] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const isEditable = Boolean(editConfig);
    const canCreate = Boolean(createConfig?.storeEndpoint);
    const canDelete = Boolean(deleteConfig?.deleteEndpoint);

    const buildEmptyForm = () =>
        [...(createConfig?.fields ?? editConfig?.fields ?? [])].reduce(
            (current, field) => {
                current[field.name] = field.type === "file" ? null : "";
                return current;
            },
            {},
        );

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
        try {
            const res = await axios.get(endpoint, {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
        } catch (error) {
            console.error(
                `Error loading ${title.toLowerCase()} records:`,
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearch(searchInput.trim());
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        loadRecords(1, search);
    }, [search]);

    useEffect(() => {
        if (isEditable) {
            loadAreas();
        }
    }, [isEditable]);

    useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            setSuccessMessage("");
        }, 2500);

        return () => window.clearTimeout(timeout);
    }, [successMessage]);

    const pageSummary = useMemo(() => {
        if (loading) {
            return `Loading ${title.toLowerCase()} records...`;
        }

        if (!records.data?.length) {
            return search
                ? `No ${emptyLabel} match the current search.`
                : `No ${emptyLabel} found.`;
        }

        return `${records.data.length} ${emptyLabel}${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [emptyLabel, loading, records.data, search, title]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadRecords(page, search);
        }
    };

    const resetForm = () => {
        setForm(buildEmptyForm());
        setErrors({});
        setEditingRecord(null);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const buildFormFromRecord = (record) => {
        return (editConfig?.fields ?? []).reduce((current, field) => {
            if (field.type === "file") {
                current[field.name] = null;
                return current;
            }

            const value = field.getValue?.(record) ?? record[field.name] ?? "";
            current[field.name] = String(value ?? "");
            return current;
        }, {});
    };

    const openCreateModal = () => {
        setEditingRecord(null);
        setForm(buildEmptyForm());
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        const nextForm = buildFormFromRecord(record);

        setEditingRecord(record);
        setForm(nextForm);
        setErrors({});
        setModalOpen(true);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const changedField = editConfig?.fields?.find(
            (field) => field.name === name,
        );
        const nextValue =
            changedField?.type === "file" ? (files?.[0] ?? null) : value;

        const shouldSyncSelectedAreaRecord =
            changedField?.type === "select" &&
            (name === "area_id" || name === "areaID");

        if (shouldSyncSelectedAreaRecord) {
            const matchedRecord = records.data?.find(
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

        const activeFields =
            editingRecord || !createConfig
                ? (editConfig?.fields ?? [])
                : (createConfig?.fields ?? editConfig?.fields ?? []);

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
                    if (value) {
                        payload.append(field.name, value);
                    }
                    return;
                }

                payload.append(field.name, value ?? "");
            });

            if (editingRecord) {
                await axios.post(
                    editConfig.updateEndpoint(editingRecord.id),
                    payload,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            } else {
                await axios.post(createConfig.storeEndpoint, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setSuccessMessage(
                editingRecord
                    ? `${title} updated successfully.`
                    : `${title} added successfully.`,
            );
            closeModal();
            await loadRecords(editingRecord ? records.current_page : 1, search);
        } catch (error) {
            console.error(`Error saving ${title.toLowerCase()} record:`, error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        `Unable to save ${title.toLowerCase()} record.`,
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record) => {
        if (!canDelete) {
            return;
        }

        const confirmed = window.confirm(
            deleteConfig?.confirmMessage?.(record) ??
                `Delete this ${emptyLabel}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(deleteConfig.deleteEndpoint(record.id));

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            setSuccessMessage(
                deleteConfig?.successMessage?.(record) ??
                    `${title} deleted successfully.`,
            );
            await loadRecords(nextPage, search);
        } catch (error) {
            console.error(
                `Error deleting ${title.toLowerCase()} record:`,
                error,
            );
            window.alert(
                error.response?.data?.message ??
                    `Unable to delete ${title.toLowerCase()} record.`,
            );
        }
    };

    return (
        <>
            <Head title={title} />
            {successMessage ? (
                <div
                    role="status"
                    className="fixed left-1/2 top-5 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-xl"
                >
                    {successMessage}
                </div>
            ) : null}
            <div className="min-h-screen flex flex-col items-center justify-start">
                <div className="w-full md:px-8 px-4 py-6">
                    <div className="flex flex-col gap-3 md:flex-row justify-between items-center bg-white shadow-sm rounded-md md:p-6 p-4 mb-4 border border-gray-200">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {description}
                            </p>
                        </div>

                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
                                placeholder={searchPlaceholder}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {pageSummary}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
                        {canCreate ? (
                            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    disabled={lookupLoading}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-green-600 px-4 font-bold text-white transition hover:bg-green-700 disabled:bg-green-300 md:w-auto"
                                >
                                    <FaPlusCircle size={18} />
                                    {createConfig?.buttonLabel ?? "Add Record"}
                                </button>
                            </div>
                        ) : null}

                        <div className="bg-white rounded-md border border-gray-100 overflow-x-auto">
                            <div className="w-full">
                                <table className="table-auto border-collapse w-full text-left min-w-full hidden md:table rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-600 text-white text-center">
                                            {columns.map((column) => (
                                                <th
                                                    key={column.header}
                                                    className={`border border-gray-300 px-4 py-2 text-sm ${column.headerClassName ?? ""}`}
                                                >
                                                    {column.header}
                                                </th>
                                            ))}
                                            {isEditable ? (
                                                <th className="border border-gray-300 px-4 py-2 text-sm">
                                                    Action
                                                </th>
                                            ) : null}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {records.data?.length > 0 ? (
                                            records.data.map((record) => (
                                                <tr
                                                    key={record.id}
                                                    className="rounded p-4 shadow bg-white text-center"
                                                >
                                                    {columns.map((column) => (
                                                        <td
                                                            key={`${record.id}-${column.header}`}
                                                            className={`border border-gray-200 px-4 py-2 text-sm ${column.cellClassName ?? ""}`}
                                                        >
                                                            {column.render(
                                                                record,
                                                            )}
                                                        </td>
                                                    ))}
                                                    {isEditable ? (
                                                        <td className="border border-gray-200 px-4 py-2 text-sm">
                                                            <div className="flex justify-center items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            record,
                                                                        )
                                                                    }
                                                                >
                                                                    <AiOutlineEdit
                                                                        color="#00ABFF"
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="cursor-pointer"
                                                                    />
                                                                </button>
                                                                {canDelete ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                record,
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdDeleteForever
                                                                            color="#E63B60"
                                                                            size={
                                                                                24
                                                                            }
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        </td>
                                                    ) : null}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        columns.length +
                                                        (isEditable ? 1 : 0)
                                                    }
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    {loading
                                                        ? "Loading..."
                                                        : `No ${emptyLabel} found.`}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="md:hidden space-y-4 overflow-auto max-h-85 p-2">
                                    {records.data?.length > 0 ? (
                                        records.data.map((record) => (
                                            <div
                                                key={record.id}
                                                className="border rounded p-4 shadow mb-2 bg-white"
                                            >
                                                {mobileFields.map((field) => (
                                                    <div
                                                        key={`${record.id}-${field.label}`}
                                                        className={
                                                            field.wrapperClassName ??
                                                            "mt-3 first:mt-0"
                                                        }
                                                    >
                                                        <span className="font-semibold text-sm">
                                                            {field.label}:
                                                        </span>{" "}
                                                        <span className="text-sm">
                                                            {field.render(
                                                                record,
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                                {isEditable ? (
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    record,
                                                                )
                                                            }
                                                            className="flex items-center gap-2 text-sky-600"
                                                        >
                                                            <AiOutlineEdit
                                                                size={18}
                                                            />
                                                            Edit
                                                        </button>
                                                        {canDelete ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        record,
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 text-rose-600"
                                                            >
                                                                <MdDeleteForever
                                                                    size={18}
                                                                />
                                                                Delete
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {loading
                                                ? "Loading..."
                                                : `No ${emptyLabel} found.`}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                records.current_page - 1,
                                            )
                                        }
                                        disabled={!records.prev_page_url}
                                        className={`px-3 py-1 rounded ${
                                            records.prev_page_url
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        Prev
                                    </button>

                                    <span className="text-sm text-gray-700">
                                        Page {records.current_page} of{" "}
                                        {records.last_page}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                records.current_page + 1,
                                            )
                                        }
                                        disabled={!records.next_page_url}
                                        className={`px-3 py-1 rounded ${
                                            records.next_page_url
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={modalOpen} onClose={closeModal} maxWidth="2xl">
                <form
                    onSubmit={handleSubmit}
                    className="flex max-h-[88vh] flex-col bg-white"
                >
                    <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
                                {editingRecord
                                    ? (editConfig?.modalTitle ?? `Edit ${title}`)
                                    : (createConfig?.modalTitle ??
                                      `New ${title}`)}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Update the selected record without leaving this
                                page.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            x
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(
                                editingRecord
                                    ? (editConfig?.fields ?? [])
                                    : (createConfig?.fields ??
                                      editConfig?.fields ??
                                      [])
                            ).map((field) => {
                                const isTextArea = field.type === "textarea";
                                const isSelect = field.type === "select";
                                const isFile = field.type === "file";
                                const isRichText = field.type === "ckeditor";
                                const fieldValue = form[field.name] ?? "";
                                const wrapperClassName =
                                    field.fullWidth === false
                                        ? ""
                                        : "md:col-span-2";
                                const existingImage =
                                    field.previewValue?.(editingRecord) ??
                                    editingRecord?.[field.previewKey ?? ""];

                                return (
                                    <div
                                        key={field.name}
                                        className={wrapperClassName}
                                    >
                                        <label className="block mb-1">
                                            {field.label}:
                                        </label>

                                        {isSelect ? (
                                            <select
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                disabled={lookupLoading}
                                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                                            >
                                                <option value="">
                                                    {field.placeholder ??
                                                        "Select option"}
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
                                            <div className="overflow-hidden rounded-md border border-gray-300">
                                                <CKEditor
                                                    key={`${editingRecord?.id ?? "new"}-${field.name}`}
                                                    editor={ClassicEditor}
                                                    config={editorConfig}
                                                    data={fieldValue}
                                                    onChange={(_, editor) => {
                                                        const data =
                                                            editor.getData();
                                                        setForm((current) => ({
                                                            ...current,
                                                            [field.name]: data,
                                                        }));
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
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                rows={field.rows ?? 5}
                                                placeholder={
                                                    field.placeholder ?? ""
                                                }
                                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        ) : isFile ? (
                                            <input
                                                name={field.name}
                                                type="file"
                                                accept={
                                                    field.accept ??
                                                    ".jpg,.jpeg,.png,.webp,.gif"
                                                }
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        ) : (
                                            <input
                                                name={field.name}
                                                value={fieldValue}
                                                onChange={handleChange}
                                                type={field.type ?? "text"}
                                                placeholder={
                                                    field.placeholder ?? ""
                                                }
                                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        )}

                                        {field.previewImage ? (
                                            form[field.name] ? (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        New file:{" "}
                                                        {form[field.name].name}
                                                    </p>
                                                </div>
                                            ) : existingImage ? (
                                                <img
                                                    src={`/storage/images/${existingImage}`}
                                                    alt={
                                                        editingRecord?.areaName ??
                                                        title
                                                    }
                                                    className="mt-3 h-28 w-full max-w-xs object-cover rounded border border-gray-200"
                                                />
                                            ) : (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    No image preview available.
                                                </p>
                                            )
                                        ) : null}

                                        {errors[field.name] ? (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[field.name][0]}
                                            </p>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {submitting
                                ? "Saving..."
                                : editingRecord
                                  ? "Update"
                                  : (createConfig?.submitLabel ?? "Save")}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CategoryRecordsPage;
