import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";

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
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const loadProtectedArea = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get("/loadProtectedArea", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(res.data);
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

    const handleDelete = async (record) => {
        const confirmed = window.confirm(
            `Delete "${record.areaName}" from protected areas?`,
        );

        if (!confirmed) {
            return;
        }

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
            <div className="min-h-screen flex flex-col items-center justify-start">
                <div className="w-full md:px-8 px-4 py-6">
                    <div className="flex flex-col gap-3 md:flex-row justify-between items-center bg-white shadow-sm rounded-md md:p-6 p-4 mb-4 border border-gray-200">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                Protected Areas
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
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
                                className="md:max-w-40 md:w-full w-full h-12 bg-green-600 hover:bg-green-700 border-2 text-white border-gray-200 rounded-xl py-2 font-bold flex flex-row justify-center items-center gap-3"
                            >
                                <FaPlusCircle size={20} />
                                Add Area
                            </button>
                        </div> */}

                        <div className="bg-white rounded-md border border-gray-100 overflow-x-auto">
                            <div className="w-full">
                                <table className="table-auto border-collapse w-full text-left min-w-full hidden md:table rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-600 text-white text-center">
                                            <th className="border border-gray-300 px-4 py-2 text-sm text-center w-72">
                                                Area Name
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm text-center">
                                                Description
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm text-center w-60">
                                                Video
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm text-center">
                                                Image
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-sm text-center">
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
                                                    <td className="border border-gray-200 px-4 py-2 text-sm w-72">
                                                        {record.areaName}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-start text-sm leading-loose max-w-xl">
                                                        {record.areaDescription?.trim() ||
                                                            "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-sm break-all">
                                                        {record.areaVideo?.trim() ||
                                                            "-"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2 text-sm">
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
                                                    {item.areaName}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Description:
                                                    </span>{" "}
                                                    {item.areaDescription?.trim() ||
                                                        "-"}
                                                </p>
                                                <p className="text-sm break-all">
                                                    <span className="font-semibold">
                                                        Video:
                                                    </span>{" "}
                                                    {item.areaVideo?.trim() ||
                                                        "-"}
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

                                                <p className="text-sm flex items-center gap-3">
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
                                                </p>
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
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

export default AreaCategory;
AreaCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
