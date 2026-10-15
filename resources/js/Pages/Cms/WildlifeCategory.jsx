import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
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
    Image,
    ImageToolbar,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageCaption,
    ImageStyle,
    PictureEditing,
    Base64UploadAdapter,
} from "ckeditor5";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";

const emptyForm = {
    area_id: "",
    tab_name: "",
    content: "",
    thumbnail: null,
};

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
        Image,
        ImageToolbar,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageCaption,
        ImageStyle,
        PictureEditing,
        Base64UploadAdapter,
    ],
    toolbar: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "link",
        "blockQuote",
        "|",
        "insertImage",
    ],
    image: {
        insert: {
            type: "url",
        },
        toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "resizeImage",
        ],
    },
};

const stripHtml = (value) =>
    String(value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .trim();

const getContentPreview = (value, limit) => {
    const plainText = stripHtml(value);

    if (!plainText) {
        return "-";
    }

    return `${plainText.slice(0, limit)}${
        plainText.length > limit ? "..." : ""
    }`;
};

const WildlifeCategory = () => {
    const [records, setRecords] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });
    const [areas, setAreas] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const editorInstanceKey = editingRecord?.id ?? "new";

    const loadWildlifeItems = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadWildlifeItems", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
        } catch (error) {
            console.error("Error loading wildlife items:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const loadTabs = async () => {
        try {
            const res = await axios.get("/loadWildlifeTabs");
            setTabs(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading wildlife tabs:", error);
        }
    };

    useEffect(() => {
        loadAreas();
        loadTabs();
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearch(searchInput.trim());
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        loadWildlifeItems(1, search);
    }, [search]);

    useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            setSuccessMessage("");
        }, 2800);

        return () => window.clearTimeout(timeout);
    }, [successMessage]);

    const tabOptions = useMemo(() => {
        if (!form.area_id) {
            return tabs;
        }

        return tabs.filter(
            (tab) => String(tab.area_id) === String(form.area_id),
        );
    }, [form.area_id, tabs]);

    useEffect(() => {
        if (!form.tab_name) {
            return;
        }

        const hasMatchingTab = tabOptions.some(
            (tab) => tab.tab_name === form.tab_name,
        );

        if (!hasMatchingTab) {
            setForm((current) => ({
                ...current,
                tab_name: "",
            }));
        }
    }, [form.area_id, form.tab_name, tabOptions]);

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
        setEditingRecord(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setForm({
            area_id: String(record.area_id ?? ""),
            tab_name: record.tab_name ?? "",
            content: record.content ?? "",
            thumbnail: null,
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const nextValue = name === "thumbnail" ? files?.[0] ?? null : value;
        setForm((current) => ({ ...current, [name]: nextValue }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("area_id", form.area_id);
        formData.append("tab_name", form.tab_name);
        formData.append("content", form.content ?? "");

        if (form.thumbnail) {
            formData.append("thumbnail", form.thumbnail);
        }

        setSubmitting(true);
        setErrors({});

        try {
            if (editingRecord) {
                await axios.post(
                    `/updateWildlifeItem/${editingRecord.id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            } else {
                await axios.post("/storeWildlifeItem", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setSuccessMessage(
                editingRecord
                    ? "Wildlife item updated successfully."
                    : "Wildlife item added successfully.",
            );
            closeModal();
            await loadTabs();
            await loadWildlifeItems(records.current_page, search);
        } catch (error) {
            console.error("Error saving wildlife item:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        "Unable to save wildlife item.",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record) => {
        const confirmed = window.confirm(
            `Delete "${record.areaName} / ${record.tab_name}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`/deleteWildlifeItem/${record.id}`);

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            setSuccessMessage("Wildlife item deleted successfully.");
            await loadTabs();
            await loadWildlifeItems(nextPage, search);
        } catch (error) {
            console.error("Error deleting wildlife item:", error);
            window.alert(
                error.response?.data?.message ??
                    "Unable to delete wildlife item.",
            );
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadWildlifeItems(page, search);
        }
    };

    const pageSummary = useMemo(() => {
        if (loading) {
            return "Loading wildlife records...";
        }

        if (!records.data?.length) {
            return search
                ? "No wildlife records match the current search."
                : "No wildlife records found.";
        }

        return `${records.data.length} wildlife record${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [loading, records.data, search]);

    return (
        <>
            <Head title="Wildlife Category" />
            {successMessage ? (
                <div className="fixed left-1/2 top-6 z-[80] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
                    <div
                        role="status"
                        className="rounded-2xl border-4 border-emerald-200 bg-emerald-600 px-6 py-4 text-center text-base font-bold text-white shadow-2xl"
                    >
                        {successMessage}
                    </div>
                </div>
            ) : null}
            <div className="min-h-screen flex flex-col items-center justify-start">
                <div className="w-full md:px-8 px-4 py-6">
                    <div className="flex flex-col gap-3 md:flex-row justify-between items-center bg-white shadow-sm rounded-md md:p-6 p-4 mb-4 border border-gray-200">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                Wildlife Category
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage wildlife tabs, thumbnails, and main
                                habitat content for each protected area.
                            </p>
                        </div>

                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
                                placeholder="Search by area, tab, or content..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {pageSummary}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={openCreateModal}
                                disabled={lookupLoading}
                                className="md:max-w-44 md:w-full w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-green-300 border-2 text-white border-gray-200 rounded-xl py-2 font-bold flex flex-row justify-center items-center gap-3"
                            >
                                <FaPlusCircle size={18} />
                                Add Wildlife
                            </button>
                        </div>

                        <div className="bg-white rounded-md border border-gray-100 overflow-x-auto">
                            <div className="w-full">
                                <table className="table-auto border-collapse w-full text-left min-w-full hidden md:table rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-600 text-white text-center">
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Area Name
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Tab Name
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Thumbnail
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Content
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {records.data?.length > 0 ? (
                                            records.data.map((record) => (
                                                <tr
                                                    key={record.id}
                                                    className="rounded p-4 shadow bg-white text-center"
                                                >
                                                    <td className="border border-gray-200 px-4 py-2 text-sm">
                                                        {record.areaName ?? "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-sm">
                                                        {record.tab_name ?? "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-sm">
                                                        {record.thumbnail_url ? (
                                                            <img
                                                                src={`/storage/images/${record.thumbnail_url}`}
                                                                alt={record.tab_name}
                                                                className="h-12 w-12 object-cover rounded mx-auto"
                                                            />
                                                        ) : (
                                                            "No Image"
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-loose max-w-xl">
                                                        {getContentPreview(
                                                            record.content,
                                                            180,
                                                        )}
                                                    </td>
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
                                                                    size={24}
                                                                    className="cursor-pointer"
                                                                />
                                                            </button>
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
                                                                    size={24}
                                                                    className="cursor-pointer"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    {loading
                                                        ? "Loading..."
                                                        : "No records found."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="md:hidden space-y-4 overflow-auto max-h-85 p-2">
                                    {records?.data?.length > 0 ? (
                                        records.data.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border rounded p-4 shadow mb-2 bg-white"
                                            >
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Area:
                                                    </span>{" "}
                                                    {item.areaName ?? "-"}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Tab:
                                                    </span>{" "}
                                                    {item.tab_name ?? "-"}
                                                </p>
                                                <div className="mt-3">
                                                    {item.thumbnail_url ? (
                                                        <img
                                                            src={`/storage/images/${item.thumbnail_url}`}
                                                            alt={item.tab_name}
                                                            className="h-16 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            No Image
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm mt-3">
                                                    <span className="font-semibold">
                                                        Content:
                                                    </span>{" "}
                                                    {getContentPreview(
                                                        item.content,
                                                        160,
                                                    )}
                                                </p>

                                                <div className="mt-4 flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        className="flex items-center gap-2 text-sky-600"
                                                    >
                                                        <AiOutlineEdit
                                                            size={18}
                                                        />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="flex items-center gap-2 text-red-500"
                                                    >
                                                        <MdDeleteForever
                                                            size={18}
                                                        />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {loading
                                                ? "Loading..."
                                                : "No records found."}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <button
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

            <Modal show={modalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={handleSubmit}>
                    <div className="relative bg-white rounded-xl shadow-lg p-6 lg:max-w-4xl md:min-w-64 w-auto overflow-auto">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            x
                        </button>

                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingRecord
                                    ? "Edit Wildlife Item"
                                    : "New Wildlife Item"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Area:</label>
                                <select
                                    name="area_id"
                                    value={form.area_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select area</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.areaName}
                                        </option>
                                    ))}
                                </select>
                                {errors.area_id ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.area_id[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Tab Name:
                                </label>
                                <select
                                    name="tab_name"
                                    value={form.tab_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    disabled={!form.area_id}
                                >
                                    <option value="">
                                        {form.area_id
                                            ? "Select tab"
                                            : "Select area first"}
                                    </option>
                                    {tabOptions.map((tab) => (
                                        <option key={tab.id} value={tab.tab_name}>
                                            {tab.tab_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.tab_name ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.tab_name[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1">
                                    Thumbnail:
                                </label>
                                <input
                                    name="thumbnail"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {form.thumbnail ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        New file: {form.thumbnail.name}
                                    </p>
                                ) : editingRecord?.thumbnail_url ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <img
                                            src={`/storage/images/${editingRecord.thumbnail_url}`}
                                            alt={editingRecord.tab_name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Current thumbnail will be kept
                                            unless replaced.
                                        </p>
                                    </div>
                                ) : null}
                                {errors.thumbnail ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.thumbnail[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1">Content:</label>
                                <div className="border border-gray-300 rounded-md overflow-hidden">
                                    <CKEditor
                                        key={editorInstanceKey}
                                        editor={ClassicEditor}
                                        config={editorConfig}
                                        data={form.content}
                                        onChange={(_, editor) => {
                                            const data = editor.getData();
                                            setForm((current) => ({
                                                ...current,
                                                content: data,
                                            }));
                                            setErrors((current) => ({
                                                ...current,
                                                content: "",
                                            }));
                                        }}
                                    />
                                </div>
                                {errors.content ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.content[0]}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex justify-center my-4 gap-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
                            >
                                {submitting
                                    ? "Saving..."
                                    : editingRecord
                                      ? "Update"
                                      : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default WildlifeCategory;
WildlifeCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
