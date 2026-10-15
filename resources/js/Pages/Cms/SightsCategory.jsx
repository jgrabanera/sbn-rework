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
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
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
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const loadContentSights = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadContentSights", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
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

    const handleDelete = async (record) => {
        const confirmed = window.confirm(
            `Delete "${record.areaName} / ${record.site_name}"?`,
        );

        if (!confirmed) {
            return;
        }

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
            <div className="min-h-screen flex flex-col items-center justify-start">
                <div className="w-full md:px-8 px-4 py-6">
                    <div className="flex flex-col gap-3 md:flex-row justify-between items-center bg-white shadow-sm rounded-md md:p-6 p-4 mb-4 border border-gray-200">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                Sights To See Category
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
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
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                                className="md:max-w-44 md:w-full w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-green-300 border-2 text-white border-gray-200 rounded-xl py-2 font-bold flex flex-row justify-center items-center gap-3"
                            >
                                <FaPlusCircle size={18} />
                                Add Content
                            </button>
                        </div> */}

                        <div className="bg-white rounded-md border border-gray-100 overflow-x-auto">
                            <div className="w-full">
                                <table className="table-auto border-collapse w-full text-left min-w-full hidden md:table rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-600 text-white text-center">
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Area Name
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm">
                                                Site Name
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
                                                        {record.site_name ??
                                                            "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-loose max-w-xl">
                                                        {record.content?.trim()
                                                            ? `${record.content.slice(0, 180)}${record.content.length > 180 ? "..." : ""}`
                                                            : "-"}
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
                                                            {/* <button
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
                                                            </button> */}
                                                        </div>
                                                    </td>
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
                                                    {/* <button
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
                                                    </button> */}
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
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

export default SightsCategory;
SightsCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
