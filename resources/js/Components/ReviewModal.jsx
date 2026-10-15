import { useState } from "react";
import axios from "axios";
import SBNLogo from "../../assets/images/starbooks-nature-logo.png";

const reviewQuestions = [
    {
        key: "interaction_rating",
        label: "Interacting with the kiosk is easy.",
    },
    {
        key: "interface_design_rating",
        label: "The visual design of the kiosk's interface is appealing.",
    },
    {
        key: "navigation_rating",
        label: "The buttons and menus on the kiosk were easy to understand.",
    },
    {
        key: "response_speed_rating",
        label: "The kiosk responded quickly to my interactions.",
    },
    {
        key: "information_relevance_rating",
        label: "The information and services provided by the kiosk were relevant.",
    },
    {
        key: "content_usefulness_rating",
        label: "The content presented on the kiosk was informative and useful.",
    },
    {
        key: "overall_satisfaction_rating",
        label: "My overall experience in using the kiosk was satisfactory.",
    },
];

const defaultRatings = reviewQuestions.reduce((ratings, question) => {
    ratings[question.key] = 4;
    return ratings;
}, {});

const ReviewModal = ({ isOpen, onClose, onSuccess, areaId = null }) => {
    const [ratings, setRatings] = useState(defaultRatings);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const updateRating = (key, value) => {
        setRatings((current) => ({
            ...current,
            [key]: value,
        }));
        setMessage("");
        setStatus("");
        setErrors({});
    };

    const resetForm = () => {
        setRatings(defaultRatings);
        setComment("");
        setErrors({});
        setStatus("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");
            setStatus("");
            setErrors({});

            await axios.post("/storeReview", {
                area_id: areaId,
                ...ratings,
                comment,
            });

            resetForm();
            setSubmitting(false);
            onSuccess?.();
            onClose?.();
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
            setMessage(
                requestError?.response?.data?.message ||
                    "Unable to submit your review. Please try again.",
            );
            setStatus("error");
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setMessage("");
        setStatus("");
        setErrors({});
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4">
            <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-[28px] border-[10px] border-emerald-900/60 bg-[#fbf9ff] px-5 py-7 shadow-2xl sm:px-8 md:px-9">
                <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close review modal"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-500 bg-white text-xl leading-none text-slate-900 transition hover:bg-sky-50"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center pt-2">
                        <img
                            src={SBNLogo}
                            alt="STARBOOKS Nature"
                            className="h-20 w-auto object-contain sm:h-24"
                        />
                    </div>

                    <p className="max-w-4xl text-sm leading-relaxed text-gray-700 sm:text-base">
                        Please rate your experience with the STARBOOKS Nature
                        interactive kiosk by clicking on the corresponding
                        number of stars to indicate your level of satisfaction
                        or rate your experience. Your feedback is valuable in
                        helping us improve our services.
                    </p>

                    <div className="space-y-5">
                        {reviewQuestions.map((question, index) => (
                            <div
                                key={question.key}
                                className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
                            >
                                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                                    {index + 1}. {question.label}
                                </p>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const selected =
                                            ratings[question.key] >= star;

                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    updateRating(
                                                        question.key,
                                                        star,
                                                    )
                                                }
                                                aria-label={`${star} star rating for question ${
                                                    index + 1
                                                }`}
                                                className={`text-4xl leading-none transition hover:scale-110 sm:text-5xl ${
                                                    selected
                                                        ? "text-amber-400"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                &#9733;
                                            </button>
                                        );
                                    })}
                                </div>

                                {errors[question.key] && (
                                    <p className="text-sm text-red-600 md:col-span-2">
                                        {errors[question.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label
                            htmlFor="review-comment"
                            className="mb-1 block text-sm leading-relaxed text-gray-700 sm:text-base"
                        >
                            8. Please share your feedback with kiosk, what you
                            like the most and what areas of improvement are
                            needed?
                        </label>
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(event) => {
                                setComment(event.target.value);
                                setMessage("");
                                setStatus("");
                                setErrors({});
                            }}
                            rows={2}
                            placeholder="Comment"
                            className="w-full resize-none rounded border-gray-400 bg-transparent px-3 py-3 text-base shadow-none focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        {errors.comment && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.comment}
                            </p>
                        )}
                    </div>

                    {message && (
                        <p
                            className={`text-center text-sm ${
                                status === "error"
                                    ? "text-red-600"
                                    : "text-emerald-700"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="min-w-64 rounded-full border border-gray-200 bg-green-600 px-10 py-3 text-sm font-medium uppercase text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
