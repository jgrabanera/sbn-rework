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
import ConfirmDialog from "@/Components/ConfirmDialog";
import RowActions from "@/Components/RowActions";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const emptyForm = {
    areaID: "",
    site_name: "",
    content: "",
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
        AutoImage,
        Base64UploadAdapter, //
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

const SightsCategory = () => {
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

    const loadContentSights = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadContentSights", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
            setPendingDelete(null);
        } catch (error) {
            console.error("Error loading sights content:", error);
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
        loadContentSights(1, search);
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
            site_name: record.site_name ?? "",
            content: record.content ?? "",
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setErrors({});

        try {
            if (editingRecord) {
                await axios.post(
                    `/updateContentSights/${editingRecord.id}`,
                    form,
                );
            } else {
                await axios.post("/storeContentSights", form);
            }

            closeModal();
            await loadContentSights(records.current_page, search);
        } catch (error) {
            console.error("Error saving sights content:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        "Unable to save sights content.",
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
            await axios.delete(`/deleteContentSights/${record.id}`);

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            await loadContentSights(nextPage, search);
        } catch (error) {
            console.error("Error deleting sights content:", error);
            window.alert(
                error.response?.data?.message ??
                    "Unable to delete sights content.",
            );
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadContentSights(page, search);
        }
    };

    const pageSummary = useMemo(() => {
        if (loading) {
            return "Loading sights records...";
        }

        if (!records.data?.length) {
            return search
                ? "No sights records match the current search."
                : "No sights records found.";
        }

        return `${records.data.length} sights record${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [loading, records.data, search]);

    return (
        <>
            <Head title="Sights To See Category" />
            <div className="cms-shell">
                <div className="cms-container">
                    <div className="cms-card mb-5 flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
                        <div>
                            <h3 className="cms-page-title">
                                Sights To See Category
                            </h3>
                            <p className="cms-page-description">
                                Manage site names and CKEditor content for each
                                protected area.
                            </p>
                        </div>

                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by area, site, or content..."
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
                                // disabled={lookupLoading}
                                disabled
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
                                                Site Name
                                            </th>
                                            <th>
                                                Content
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
                                                        {record.site_name ??
                                                            "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-loose max-w-xl">
                                                        {record.content?.trim()
                                                            ? `${record.content.slice(0, 180)}${record.content.length > 180 ? "..." : ""}`
                                                            : "-"}
                                                    </td>
                                                    <td>
                                                        <RowActions
                                        variant="icon"
                                        itemLabel="sight"
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
                                                    colSpan="4"
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
                                                        Site:
                                                    </span>{" "}
                                                    {item.site_name ?? "-"}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Content:
                                                    </span>{" "}
                                                    {item.content?.trim()
                                                        ? `${item.content.slice(0, 160)}${item.content.length > 160 ? "..." : ""}`
                                                        : "-"}
                                                </p>

                                                <RowActions
                                        variant="labelled"
                                        itemLabel="sight"
                                        showDelete={false}
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

            <Modal
                show={modalOpen}
                onClose={closeModal}
                maxWidth="xl"
                maxHeight="70vh"
            >
                <form onSubmit={handleSubmit}>
                    <div className="relative bg-white rounded-xl shadow-lg p-6 lg:max-w-4xl md:min-w-64  w-auto overflow-auto">
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
                                    ? "Edit Sights Content"
                                    : "New Sights Content"}
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
                                <label className="block mb-1">Site Name:</label>
                                <input
                                    name="site_name"
                                    value={form.site_name}
                                    onChange={handleChange}
                                    type="text"
                                    className="input"
                                />
                                {errors.site_name ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.site_name[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1">Content:</label>
                                <div className="border border-gray-300 rounded-md overflow-hidden ">
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
                title="Delete sight"
                message={
                    pendingDelete
                        ? `Delete "${pendingDelete.areaName} / ${pendingDelete.site_name}"?`
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

export default SightsCategory;
SightsCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
