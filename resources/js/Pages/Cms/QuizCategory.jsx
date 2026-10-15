import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const emptyForm = {
    level_of_difficulty: 1,
    question_text: "",
    question_image: "",
    question_image_file: null,
    choice1_text: "",
    choice2_text: "",
    choice3_text: "",
    choice4_text: "",
    answer_key: "choice1",
};

const answerOptions = [
    { value: "choice1", label: "Choice 1" },
    { value: "choice2", label: "Choice 2" },
    { value: "choice3", label: "Choice 3" },
    { value: "choice4", label: "Choice 4" },
];

const QuizCategory = () => {
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
    const [questionImagePreview, setQuestionImagePreview] = useState("");

    const loadQuizItems = async (page = 1, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get("/loadQuizItems", {
                params: { page, search: keyword, per_page: 10 },
            });
            setRecords(response.data);
        } catch (error) {
            console.error("Error loading quiz items:", error);
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
        loadQuizItems(1, search);
    }, [search]);

    useEffect(() => {
        if (form.question_image_file) {
            const objectUrl = URL.createObjectURL(form.question_image_file);
            setQuestionImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }

        setQuestionImagePreview(form.question_image || "");
        return undefined;
    }, [form.question_image_file, form.question_image]);

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
        setEditingRecord(null);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setForm({
            level_of_difficulty: record.level_of_difficulty ?? 1,
            question_text: record.question_text ?? "",
            question_image: record.question_image ?? "",
            question_image_file: null,
            choice1_text: record.choice1_text ?? "",
            choice2_text: record.choice2_text ?? "",
            choice3_text: record.choice3_text ?? "",
            choice4_text: record.choice4_text ?? "",
            answer_key: record.answer_key ?? "choice1",
        });
        setErrors({});
        setModalOpen(true);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const nextValue =
            name === "question_image_file" ? (files?.[0] ?? null) : value;

        setForm((current) => ({ ...current, [name]: nextValue }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append("level_of_difficulty", form.level_of_difficulty);
        formData.append("question_text", form.question_text);
        formData.append("question_image", form.question_image ?? "");
        formData.append("choice1_text", form.choice1_text);
        formData.append("choice2_text", form.choice2_text);
        formData.append("choice3_text", form.choice3_text);
        formData.append("choice4_text", form.choice4_text);
        formData.append("answer_key", form.answer_key);

        if (form.question_image_file) {
            formData.append("question_image_file", form.question_image_file);
        }

        try {
            if (editingRecord) {
                await axios.post(
                    `/updateQuizItem/${editingRecord.id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );
            } else {
                await axios.post("/storeQuizItem", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            closeModal();
            await loadQuizItems(records.current_page, search);
        } catch (error) {
            console.error("Error saving quiz item:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                window.alert(
                    error.response?.data?.message ??
                        "Something went wrong while saving the quiz item.",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record) => {
        const confirmed = window.confirm(`Delete quiz question #${record.id}?`);

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`/deleteQuizItem/${record.id}`);

            const nextPage =
                records.data.length === 1 && records.current_page > 1
                    ? records.current_page - 1
                    : records.current_page;

            await loadQuizItems(nextPage, search);
        } catch (error) {
            console.error("Error deleting quiz item:", error);
            window.alert(
                error.response?.data?.message ??
                    "Unable to delete this quiz question.",
            );
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= records.last_page && !loading) {
            loadQuizItems(page, search);
        }
    };

    const pageSummary = useMemo(() => {
        if (loading) {
            return "Loading quiz questions...";
        }

        if (!records.data?.length) {
            return search
                ? "No quiz questions match the current search."
                : "No quiz questions found.";
        }

        return `${records.data.length} quiz question${
            records.data.length === 1 ? "" : "s"
        } on this page`;
    }, [loading, records.data, search]);

    return (
        <>
            <Head title="Quiz CMS" />

            <div className="min-h-screen bg-slate-100">
                <div className="w-full px-4 py-6 md:px-8">
                    <div className="mb-4 flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 md:text-xl">
                                Quiz CMS
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage quiz questions, choices, correct answers,
                                difficulty levels, and question image URLs.
                            </p>
                        </div>

                        <div className="w-full md:w-[28rem]">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                placeholder="Search quiz questions or choices..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {pageSummary}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md md:p-6">
                        <div className="mb-4 flex justify-end">
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 bg-green-600 px-5 font-bold text-white hover:bg-green-700 md:w-auto"
                            >
                                <FaPlusCircle size={20} />
                                Add Question
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-md border border-gray-100 bg-white">
                            <table className="hidden min-w-full table-auto border-collapse text-left md:table">
                                <thead>
                                    <tr className="bg-teal-600 text-center text-white">
                                        <th className="border border-gray-300 px-4 py-2 text-sm">
                                            ID
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-sm">
                                            Difficulty
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-sm">
                                            Question
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-sm">
                                            Choices
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-sm">
                                            Answer
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
                                                className="bg-white text-center"
                                            >
                                                <td className="border border-gray-200 px-4 py-2 text-sm">
                                                    {record.id}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-sm">
                                                    {record.level_of_difficulty}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-left text-sm">
                                                    <p className="font-semibold text-slate-800">
                                                        {record.question_text}
                                                    </p>
                                                    {record.question_image ? (
                                                        <a
                                                            href={
                                                                record.question_image
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-1 inline-block text-xs text-sky-600 underline"
                                                        >
                                                            View image
                                                        </a>
                                                    ) : (
                                                        <span className="mt-1 inline-block text-xs text-slate-400">
                                                            No image
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-left text-sm leading-6">
                                                    <p>
                                                        <span className="font-semibold">
                                                            1:
                                                        </span>{" "}
                                                        {record.choice1_text}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            2:
                                                        </span>{" "}
                                                        {record.choice2_text}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            3:
                                                        </span>{" "}
                                                        {record.choice3_text}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            4:
                                                        </span>{" "}
                                                        {record.choice4_text}
                                                    </p>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-sm">
                                                    {record.answer_key}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-sm">
                                                    <div className="flex items-center justify-center gap-1">
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
                                                colSpan="6"
                                                className="py-4 text-center text-gray-500"
                                            >
                                                {loading
                                                    ? "Loading..."
                                                    : "No quiz records found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="max-h-[34rem] space-y-4 overflow-auto p-2 md:hidden">
                                {records.data?.length > 0 ? (
                                    records.data.map((record) => (
                                        <div
                                            key={record.id}
                                            className="rounded border bg-white p-4 shadow"
                                        >
                                            <p className="text-sm">
                                                <span className="font-semibold">
                                                    ID:
                                                </span>{" "}
                                                {record.id}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold">
                                                    Difficulty:
                                                </span>{" "}
                                                {record.level_of_difficulty}
                                            </p>
                                            <p className="mt-2 text-sm">
                                                <span className="font-semibold">
                                                    Question:
                                                </span>{" "}
                                                {record.question_text}
                                            </p>
                                            <p className="mt-2 text-sm">
                                                <span className="font-semibold">
                                                    Image:
                                                </span>{" "}
                                                {record.question_image ? (
                                                    <a
                                                        href={
                                                            record.question_image
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sky-600 underline"
                                                    >
                                                        View image
                                                    </a>
                                                ) : (
                                                    "No image"
                                                )}
                                            </p>
                                            <div className="mt-2 text-sm">
                                                <p>
                                                    <span className="font-semibold">
                                                        1:
                                                    </span>{" "}
                                                    {record.choice1_text}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        2:
                                                    </span>{" "}
                                                    {record.choice2_text}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        3:
                                                    </span>{" "}
                                                    {record.choice3_text}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        4:
                                                    </span>{" "}
                                                    {record.choice4_text}
                                                </p>
                                            </div>
                                            <p className="mt-2 text-sm">
                                                <span className="font-semibold">
                                                    Answer:
                                                </span>{" "}
                                                {record.answer_key}
                                            </p>
                                            <div className="mt-3 flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(record)
                                                    }
                                                    className="flex items-center gap-2 text-sky-600"
                                                >
                                                    <AiOutlineEdit size={18} />
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(record)
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
                                            : "No quiz records found."}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            records.current_page - 1,
                                        )
                                    }
                                    disabled={!records.prev_page_url}
                                    className={`rounded px-3 py-1 ${
                                        records.prev_page_url
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "cursor-not-allowed bg-gray-300 text-gray-500"
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
                                    className={`rounded px-3 py-1 ${
                                        records.next_page_url
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "cursor-not-allowed bg-gray-300 text-gray-500"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={modalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={handleSubmit}>
                    <div className="relative mx-auto max-h-[82vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-4 shadow-lg md:p-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-700"
                        >
                            x
                        </button>

                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-center text-base font-semibold text-gray-800 md:text-lg">
                                {editingRecord
                                    ? "Edit Quiz Question"
                                    : "New Quiz Question"}
                            </h2>
                        </div>

                        <div className="grid gap-2.5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Question Text:
                                </label>
                                <textarea
                                    name="question_text"
                                    rows="3"
                                    value={form.question_text}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.question_text ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.question_text[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Question Image:
                                </label>
                                <input
                                    type="file"
                                    name="question_image_file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif"
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {form.question_image_file ? (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Selected file:{" "}
                                        {form.question_image_file.name}
                                    </p>
                                ) : form.question_image ? (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Existing image will be kept unless a new
                                        file is selected.
                                    </p>
                                ) : null}
                                {errors.question_image_file ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.question_image_file[0]}
                                    </p>
                                ) : null}
                                {questionImagePreview ? (
                                    <img
                                        src={questionImagePreview}
                                        alt="Question preview"
                                        className="mt-2 max-h-28 rounded-lg border border-gray-200 object-contain"
                                    />
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Choice 1:</label>
                                <input
                                    type="text"
                                    name="choice1_text"
                                    value={form.choice1_text}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.choice1_text ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.choice1_text[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Choice 2:</label>
                                <input
                                    type="text"
                                    name="choice2_text"
                                    value={form.choice2_text}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.choice2_text ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.choice2_text[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Choice 3:</label>
                                <input
                                    type="text"
                                    name="choice3_text"
                                    value={form.choice3_text}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.choice3_text ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.choice3_text[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Choice 4:</label>
                                <input
                                    type="text"
                                    name="choice4_text"
                                    value={form.choice4_text}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.choice4_text ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.choice4_text[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Difficulty:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    name="level_of_difficulty"
                                    value={form.level_of_difficulty}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.level_of_difficulty ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.level_of_difficulty[0]}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Correct Answer:
                                </label>
                                <select
                                    name="answer_key"
                                    value={form.answer_key}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {answerOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.answer_key ? (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.answer_key[0]}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
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

QuizCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);

export default QuizCategory;
