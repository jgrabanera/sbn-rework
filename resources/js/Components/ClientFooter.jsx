import DostVII from "../../assets/images/dost-vii.png";
import DostSTII from "../../assets/images/dost-stii.png";
import Starbooks from "../../assets/images/starbooks.png";

const ClientFooter = () => {
    const logos = [
        { src: DostVII, label: "DOST-VII" },
        { src: DostSTII, label: "DOST-STII" },
        { src: Starbooks, label: "STARBOOKS" },
    ];

    return (
        <div className="flex justify-center px-4 py-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-md py-3 px-5">
                <div className="flex items-center justify-center gap-6 sm:gap-8">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={logo.src}
                                alt={logo.label}
                                className="h-8 sm:h-10 w-auto object-contain"
                            />
                            <span className="mt-1 text-[10px] sm:text-xs font-semibold text-gray-700">
                                {logo.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientFooter;
