const ReviewSuccessToast = ({ show }) => {
    if (!show) return null;

    return (
        <div
            role="status"
            className="fixed left-1/2 top-5 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-xl"
        >
            Review submitted successfully. Thank you for your feedback.
        </div>
    );
};

export default ReviewSuccessToast;
