import SBNLogo from "../../assets/images/starbooks-nature-logo.png";

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4">
            <div
                className="absolute inset-0"
                aria-hidden="true"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-3xl rounded-[28px] border-[8px] border-emerald-900/60 bg-[#fbf9ff] px-5 py-8 shadow-2xl sm:px-10 sm:py-10">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close contact modal"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-500 bg-white text-xl leading-none text-slate-900 transition hover:bg-sky-50"
                >
                    &times;
                </button>

                <div className="flex flex-col items-center text-center">
                    <img
                        src={SBNLogo}
                        alt="STARBOOKS Nature"
                        className="h-20 w-auto object-contain sm:h-24"
                    />

                    <h2 className="mt-4 text-xl font-bold uppercase tracking-wide text-gray-800 sm:text-2xl">
                        Contact Information
                    </h2>
                    <div className="mt-3 h-1 w-20 rounded-full bg-emerald-500" />
                </div>

                <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white px-5 py-5 text-center shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                            Address
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-gray-800">
                            PO BOX 1, Dumaguete, Negros Oriental, Philippines
                        </p>
                    </div>

                    <a
                        href="tel:+63354240888"
                        className="rounded-lg border border-gray-200 bg-white px-5 py-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                            Phone Number
                        </p>
                        <p className="mt-3 text-xl font-bold text-gray-900">
                            (035) 424-0888
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
