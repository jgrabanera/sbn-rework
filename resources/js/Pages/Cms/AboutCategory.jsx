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
} from "ckeditor5";
import ConfirmDialog from "@/Components/ConfirmDialog";
import RowActions from "@/Components/RowActions";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const emptyForm = {
    areaID: "",
    tabID: "",
    content: "",
    image1: null,
    image2: null,
};

const tabLabels = {
    1: "About",
    2: "History",
    3: "How to Get There",
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
    ],
};

const AboutCategory = () => {
    const [records, setRecords] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });
    const [areas, setAreas] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const loadContentAbout = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadContentAbout", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
            setPendingDelete(null);
        } catch (error) {
            console.error("Error loading about content:", error);
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

    useEffect(() => {
        loadAreas();
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearch(searchInput.trim());
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        loadContentAbout(1, search);
    }, [search]);

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
            areaID: String(record.areaID ?? ""),
            tabID: String(record.tabID ?? ""),
            content: record.content ?? "",
            image1: null,
            image2: null,
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
        const nextValue =
            name === "image1" || name === "image2"
                ? (files?.[0] ?? null)
                : value;

        setForm((current) => ({ ...current, [name]: nextValue }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("areaID", form.areaID);
        formData.append("tabID", form.tabID);
        formData.append("content", form.content ?? "");

        if (form.image1) {
            formData.append("image1", form.image1);
        }

        if (form.image2) {
            formData.append("image2", form.image2);
        }

        setSubmitting(true);
        setErrors({});

        try {
            if (editingRecord) {
                await axios.post(
                    `/updateContentAbout/${editingRecord.id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            } else {
                await axios.post("/storeContentAbout", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            closeModal();
            await loadContentAbout(records.current_page, search);
        } catch (error) {
            console.error("Error saving about content:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        "Unable to save about content.",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const requestDelete = (record) => {
        setPendingDelete(record);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`/deleteContentAbout/${record.id}`);

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            await loadContentAbout(nextPage, search);
        } catch (error) {
            console.error("Error deleting about content:", error);
            window.alert(
                error.response?.data?.message ??
                    "Unable to delete about content.",
            );
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadContentAbout(page, search);
        }
    };

    const pageSummary = useMemo(() => {
        if (loading) {
            return "Loading about records...";
        }

        if (!records.data?.length) {
            return search
                ? "No about records match the current search."
                : "No about records found.";
        }

        return `${records.data.length} about record${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [loading, records.data, search]);

    return (
        <>
            <Head title="About Category" />
            <div className="cms-shell">
                <div className="cms-container">
                    <div className="cms-card mb-5 flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
                        <div>
                            <h3 className="cms-page-title">
                                About Category
                            </h3>
                            <p className="cms-page-description">
                                Manage About, History, and How to Get There
                                content for each protected area.
                            </p>
                        </div>

                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by area, tab, or content..."
                                className="input"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {pageSummary}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
                        {/* <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={openCreateModal}
                                disabled={lookupLoading}
                                className="btn-accent"
                            >
                                <FaPlusCircle size={18} />
                                Add Content
                            </button>
                        </div> */}

                        <div className="table-shell table-scroll">
                            <div className="w-full">
                                <table className="table hidden md:table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Area Name
                                            </th>
                                            <th>
                                                Tab
                                            </th>
                                            <th>
                                                Content
                                            </th>
                                            <th>
                                                Image 1
                                            </th>
                                            <th>
                                                Image 2
                                            </th>
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {records.data?.length > 0 ? (
                                            records.data.map((record) => (
                                                <tr
                                                    key={record.id}
                                                    
                                                >
                                                    <td>
                                                        {record.areaName ?? "-"}
                                                    </td>
                                                    <td>
                                                        {tabLabels[
                                                            record.tabID
                                                        ] ??
                                                            `Tab ${record.tabID}`}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-loose max-w-xl">
                                                        {record.content?.trim()
                                                            ? `${record.content.slice(0, 180)}${record.content.length > 180 ? "..." : ""}`
                                                            : "-"}
                                                    </td>
                                                    <td>
                                                        {record.imagePath1 ? (
                                                            <img
                                                                src={`/storage/images/${record.imagePath1}`}
                                                                alt="About image 1"
                                                                className="h-12 w-12 object-cover rounded mx-auto"
                                                            />
                                                        ) : (
                                                            "No Image"
                                                        )}
                                                    </td>
                                                    <td>
                                                        {record.imagePath2 ? (
                                                            <img
                                                                src={`/storage/images/${record.imagePath2}`}
                                                                alt="About image 2"
                                                                className="h-12 w-12 object-cover rounded mx-auto"
                                                            />
                                                        ) : (
                                                            "No Image"
                                                        )}
                                                    </td>
                                                    <td>
                                                        <RowActions
                                        variant="icon"
                                        itemLabel="content"
                                        showDelete={false}
                                        onEdit={() =>
                                            openEditModal(
                                                record,
                                            )
                                        }
                                        onDelete={() =>
                                            requestDelete(
                                                record,
                                            )
                                        }
                                    /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
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

                                <div className="md:hidden space-y-4 overflow-auto max-h-[21rem] p-2">
                                    {records?.data?.length > 0 ? (
                                        records.data.map((item) => (
                                            <div
                                                key={item.id}
                                                className="mb-2 rounded-card border border-slate-200 bg-white p-4 shadow-card"
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
                                                    {tabLabels[item.tabID] ??
                                                        `Tab ${item.tabID}`}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Content:
                                                    </span>{" "}
                                                    {item.content?.trim()
                                                        ? `${item.content.slice(0, 160)}${item.content.length > 160 ? "..." : ""}`
                                                        : "-"}
                                                </p>

                                                <div className="mt-3 flex gap-3">
                                                    {item.imagePath1 ? (
                                                        <img
                                                            src={`/storage/images/${item.imagePath1}`}
                                                            alt="About image 1"
                                                            className="h-16 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            No Image 1
                                                        </span>
                                                    )}

                                                    {item.imagePath2 ? (
                                                        <img
                                                            src={`/storage/images/${item.imagePath2}`}
                                                            alt="About image 2"
                                                            className="h-16 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            No Image 2
                                                        </span>
                                                    )}
                                                </div>

                                                <RowActions
                                        variant="labelled"
                                        itemLabel="content"
                                        showDelete={true}
                                        onEdit={() =>
                                            openEditModal(item)
                                        }
                                        onDelete={() =>
                                            requestDelete(item)
                                        }
                                    />
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
                                    ? "Edit About Content"
                                    : "New About Content"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Area:</label>
                                <select
                                    name="areaID"
                                    value={form.areaID}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select area</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.areaName}
                                        </option>
                                    ))}
                                </select>
                                {errors.areaID ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.areaID[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">Tab:</label>
                                <select
                                    name="tabID"
                                    value={form.tabID}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select tab</option>
                                    {Object.entries(tabLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {errors.tabID ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.tabID[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1">Content:</label>
                                <div className="border border-gray-300 rounded-md md:max-h-80 overflow-auto">
                                    <CKEditor
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

                            <div>
                                <label className="block mb-1">Image 1:</label>
                                <input
                                    name="image1"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {form.image1 ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        New file: {form.image1.name}
                                    </p>
                                ) : editingRecord?.imagePath1 ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <img
                                            src={`/storage/images/${editingRecord.imagePath1}`}
                                            alt="Current image 1"
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Current image 1 will be kept unless
                                            replaced.
                                        </p>
                                    </div>
                                ) : null}
                                {errors.image1 ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image1[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">Image 2:</label>
                                <input
                                    name="image2"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {form.image2 ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        New file: {form.image2.name}
                                    </p>
                                ) : editingRecord?.imagePath2 ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <img
                                            src={`/storage/images/${editingRecord.imagePath2}`}
                                            alt="Current image 2"
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Current image 2 will be kept unless
                                            replaced.
                                        </p>
                                    </div>
                                ) : null}
                                {errors.image2 ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image2[0]}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex justify-center my-4 gap-2">
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
                                      : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title="Delete content"
                message={
                    pendingDelete
                        ? `Delete "${pendingDelete.areaName} / ${tabLabels[pendingDelete.tabID] ?? `Tab ${pendingDelete.tabID}`}"?`
                        : null
                }
                confirmLabel="Delete"
                onConfirm={() => {
                    if (pendingDelete) {
                        handleDelete(pendingDelete);
                    }
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    );
};

export default AboutCategory;
AboutCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
