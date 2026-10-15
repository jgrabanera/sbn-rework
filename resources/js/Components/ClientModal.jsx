const ClientModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal content */}
            <div
                className="
          relative z-10
          w-full min-h-32
          max-h-[90vh] 
          max-w-[95vw]  md:max-w-xl 
          bg-white rounded-xl shadow-lg p-5
          overflow-y-auto
          py-4
        "
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="z-10 absolute top-2 right-2 text-sm hover:cursor-pointer hover:bg-amber-200 bg-white rounded-3xl p-2 shadow-md"
                >
                    ❌
                </button>

                {children}
            </div>
        </div>
    );
};

export default ClientModal;
