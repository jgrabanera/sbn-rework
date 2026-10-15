import SBNLogo from "../../assets/images/starbooks-nature-logo.png";
import DostVII from "../../assets/images/dost-vii.png";
import DENR from "../../assets/images/DENR-RO7.png";
import PGNO from "../../assets/images/GOV-NEGROS-ORIENTAL.png";
import NORSU from "../../assets/images/NOSU.png";
import SU from "../../assets/images/SILIMAN-UNIVERSITY.png";

const partners = [
    {
        name: "Department of Science and Technology - Regional Office No. 7",
        shortName: "DOST VII",
        logo: DostVII,
        accent: "from-sky-500 to-cyan-400",
    },
    {
        name: "Department of Environment and Natural Resources - Regional Office VII",
        shortName: "DENR RO7",
        logo: DENR,
        accent: "from-emerald-600 to-lime-500",
    },
    {
        name: "Provincial Government of Negros Oriental",
        shortName: "PGNO",
        logo: PGNO,
        accent: "from-indigo-600 to-sky-500",
    },
    {
        name: "Negros Oriental State University",
        shortName: "NORSU",
        logo: NORSU,
        accent: "from-amber-500 to-yellow-300",
    },
    {
        name: "Silliman University",
        shortName: "SU",
        logo: SU,
        accent: "from-red-600 to-rose-400",
    },
];

const PartnersModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4">
            <div
                className="absolute inset-0"
                aria-hidden="true"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-6xl max-h-[94vh] overflow-y-auto rounded-[28px] border-[10px] border-emerald-900/60 bg-[#fbf9ff] px-5 py-7 shadow-2xl sm:px-8 md:px-10">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close partners modal"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-500 bg-white text-xl leading-none text-slate-900 transition hover:bg-sky-50"
                >
                    &times;
                </button>

                <div className="flex flex-col items-center gap-4">
                    <img
                        src={SBNLogo}
                        alt="STARBOOKS Nature"
                        className="h-20 w-auto object-contain sm:h-24"
                    />

                    <div className="text-center">
                        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 sm:text-2xl">
                            Partners
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-emerald-500" />
                    </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {partners.map((partner) => (
                        <div
                            key={partner.shortName}
                            className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 p-3 shadow-inner">
                                {partner.logo ? (
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div
                                        className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${partner.accent} px-2 text-center text-lg font-bold text-white shadow`}
                                    >
                                        {partner.shortName}
                                    </div>
                                )}
                            </div>

                            <p className="mt-5 text-sm font-medium leading-relaxed text-gray-700 sm:text-base">
                                {partner.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartnersModal;
