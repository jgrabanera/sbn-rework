import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import ConfirmDialog from "@/Components/ConfirmDialog";
import RowActions from "@/Components/RowActions";
import { ClampText } from "@/Components/Cms";
import VideoPreviewModal from "@/Components/VideoPreviewModal";
import { FaPlusCircle, FaPlayCircle } from "react-icons/fa";
import axios from "axios";

const emptyForm = {
    areaName: "",
    areaDescription: "",
    video: null,
    image: null,
};

const AreaCategory = () => {
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
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [videoRecord, setVideoRecord] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // `areaVideo` is stored as a bare filename on the public videos disk.
    const videoSrc = videoRecord?.areaVideo
        ? `/storage/videos/${videoRecord.areaVideo}`
        : null;

    const loadProtectedArea = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadProtectedArea", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
            setPendingDelete(null);
        } catch (error) {
            console.error("Error loading protected areas:", error);
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
        loadProtectedArea(1, search);
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
            areaName: record.areaName ?? "",
            areaDescription: record.areaDescription ?? "",
            video: null,
            image: null,
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
            name === "image" || name === "video" ? (files?.[0] ?? null) : value;

        setForm((current) => ({ ...current, [name]: nextValue }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("areaName", form.areaName);
        formData.append("areaDescription", form.areaDescription ?? "");

        if (form.image) {
            formData.append("image", form.image);
        }

        if (form.video) {
            formData.append("video", form.video);
        }

        setSubmitting(true);
        setErrors({});

        try {
            if (editingRecord) {
                await axios.post(`/updateArea/${editingRecord.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post("/storeArea", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            closeModal();
            await loadProtectedArea(records.current_page, search);
        } catch (error) {
            console.error("Error saving protected area:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        "Something went wrong. Please try again.",
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
            await axios.delete(`/deleteArea/${record.id}`);

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            await loadProtectedArea(nextPage, search);
        } catch (error) {
            console.error("Error deleting protected area:", error);
            window.alert(
                error.response?.data?.message ??
                    "Unable to delete this protected area.",
            );
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadProtectedArea(page, search);
        }
    };

    const pageSummary = useMemo(() => {
        if (loading) {
            return "Loading protected areas...";
        }

        if (!records.data?.length) {
            return search
                ? "No protected areas match the current search."
                : "No protected areas found.";
        }

        return `${records.data.length} protected area${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [loading, records.data, search]);

    return (
        <>
            <Head title="Protected Areas" />
            <div className="cms-shell">
                <div className="cms-container">
                    <div className="cms-card mb-5 flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
                        <div>
                            <h3 className="cms-page-title">
                                Protected Areas
                            </h3>
                            <p className="cms-page-description">
                                Create, update, search, and remove protected
                                area records.
                            </p>
                        </div>

                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search protected areas..."
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
                                className="md:max-w-40 md:w-full w-full h-12 bg-green-600 hover:bg-green-700 border-2 text-white border-gray-200 rounded-xl py-2 font-bold flex flex-row justify-center items-center gap-3"
                            >
                                <FaPlusCircle size={20} />
                                Add Area
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
                                            <th className="w-[22rem]">
                                                Description
                                            </th>
                                            <th>
                                                Video
                                            </th>
                                            <th>
                                                Image
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
                                                    <td className="border border-gray-200 px-4 py-2 text-sm w-72">
                                                        {record.areaName}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-relaxed max-w-xl">
                                                        <ClampText
                                                            value={
                                                                record.areaDescription
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-sm">
                                                        {record.areaVideo?.trim() ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setVideoRecord(
                                                                        record,
                                                                    )
                                                                }
                                                                className="btn-secondary h-9 max-w-[16rem] justify-start px-3"
                                                                aria-label={`Preview video for ${record.areaName}`}
                                                                title={record.areaVideo}
                                                            >
                                                                <FaPlayCircle
                                                                    size={18}
                                                                />
                                                                <span className="truncate">
                                                                    {
                                                                        record.areaVideo
                                                                    }
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-400">
                                                                No video
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {record.imagePath ? (
                                                            <img
                                                                src={`/storage/images/${record.imagePath}`}
                                                                alt={
                                                                    record.areaName
                                                                }
                                                                className="h-10 w-10 object-cover rounded mx-auto"
                                                            />
                                                        ) : (
                                                            "No Image"
                                                        )}
                                                    </td>

                                                    <td>
                                                        <RowActions
                                        variant="icon"
                                        itemLabel="protected area"
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
                                                    {item.areaName}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Description:
                                                    </span>{" "}
                                                    <ClampText
                                                        value={
                                                            item.areaDescription
                                                        }
                                                    />
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Video:
                                                    </span>{" "}
                                                    {item.areaVideo?.trim() ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setVideoRecord(
                                                                    item,
                                                                )
                                                            }
                                                            className="btn-secondary mt-1 h-8 max-w-full justify-start px-3"
                                                            aria-label={`Preview video for ${item.areaName}`}
                                                            title={item.areaVideo}
                                                        >
                                                            <FaPlayCircle
                                                                size={14}
                                                            />
                                                            <span className="truncate">
                                                                {
                                                                    item.areaVideo
                                                                }
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            No video
                                                        </span>
                                                    )}
                                                </p>

                                                <div className="my-3">
                                                    {item.imagePath ? (
                                                        <img
                                                            src={`/storage/images/${item.imagePath}`}
                                                            alt={item.areaName}
                                                            className="h-16 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            No Image
                                                        </span>
                                                    )}
                                                </div>

                                                <RowActions
                                    variant="labelled"
                                    itemLabel="protected area"
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
                            <h2 className="text-xl font-semibold text-gray-800 flex flex-row gap-3 justify-center items-center">
                                {editingRecord
                                    ? "Edit Protected Area"
                                    : "New Protected Area"}
                            </h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1">
                                    Protected Area Name:
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={form.areaName}
                                    name="areaName"
                                    type="text"
                                    className="input"
                                />
                                {errors.areaName ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.areaName[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Description:
                                </label>
                                <textarea
                                    onChange={handleChange}
                                    value={form.areaDescription}
                                    name="areaDescription"
                                    rows="4"
                                    className="input"
                                />
                                {errors.areaDescription ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.areaDescription[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">Video:</label>
                                <input
                                    onChange={handleChange}
                                    name="video"
                                    type="file"
                                    accept=".mp4,.avi,.mov,.m4v,.mpeg"
                                    className="input"
                                />
                                {form.video ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        New file: {form.video.name}
                                    </p>
                                ) : editingRecord?.areaVideo ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Current video: {editingRecord.areaVideo}
                                    </p>
                                ) : null}
                                {errors.video ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.video[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="block mb-1">Image:</label>
                                <input
                                    name="image"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {form.image ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                        New file: {form.image.name}
                                    </p>
                                ) : editingRecord?.imagePath ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <img
                                            src={`/storage/images/${editingRecord.imagePath}`}
                                            alt={editingRecord.areaName}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Current image will be kept unless a
                                            new file is selected.
                                        </p>
                                    </div>
                                ) : null}
                                {errors.image ? (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image[0]}
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

            <VideoPreviewModal
                open={Boolean(videoRecord)}
                title={videoRecord?.areaName ?? "Video preview"}
                src={videoSrc}
                onClose={() => setVideoRecord(null)}
            />

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title="Delete protected area"
                message={
                    pendingDelete
                        ? `Delete "${pendingDelete.areaName}" from protected areas?`
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

export default AreaCategory;
AreaCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
