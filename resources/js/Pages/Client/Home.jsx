import SBNLogo from "../../../assets/images/starbooks-nature-logo.png";

import { useState, useRef, useEffect } from "react";

// import { Link } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
import ClientModal from "@/Components/ClientModal";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import ClientFooter from "@/Components/ClientFooter";
import axios from "axios";

const Home = () => {
    // const { areas } = useAppContext();
    const [areas, setAreas] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);

    const loadAreas = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-areas`);
            setAreas(res.data);
            // console.log("Loaded areas:", res.data);
        } catch (requestError) {
            console.log("Error loading areas:", requestError);
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAreas();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // console.log("close");
        setSelectedArea(null);
    };

    const videoRef = useRef(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.play();
        }

        if (!isOpen && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // reset video
        }
    }, [isOpen]);

    return (
        <>
            <Head title="Home" />

            <div className="p-2 flex flex-col items-center justify-between min-h-screen">
                {/* Logo */}
                <img
                    src={SBNLogo}
                    alt="STARBOOKS Nature"
                    className="md:h-18 h-16 object-contain"
                />

                {/* Content */}
                <div className=" my-5 grid grid-cols-1 md:flex md:justify-evenly gap-12 w-full max-w-10/12 mx-auto px-4">
                    {areas?.length > 0 ? (
                        areas.map((area, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedArea(area);
                                    setIsOpen(true);
                                }}
                                className=" flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 w-full md:w-auto"
                            >
                                <img
                                    src={`/storage/images/${area.imagePath}`}
                                    alt={`/storage/images/${area.imagePath}`}
                                    className="w-full max-w-xs sm:max-w-sm md:max-w-96 object-contain rounded-full small-bounce"
                                />

                                <div className="bg-white p-4 sm:p-5 rounded-lg mt-3 w-full text-center">
                                    <p className="text-sm sm:text-base font-medium playpenSans">
                                        {area.areaName ?? ""}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">No Records Found.</div>
                    )}
                </div>

                <ClientFooter />

                {/* Modal */}
                <ClientModal isOpen={isOpen} onClose={handleClose}>
                    {selectedArea && (
                        <div className="w-full md:max-w-2xl mx-auto overflow-hidden ">
                            {/* Video Player */}
                            <div>
                                <video
                                    ref={videoRef}
                                    src={`/storage/videos/${selectedArea.areaVideo}`}
                                    autoPlay
                                    playsInline
                                    controls
                                    className="w-full md:max-h-96 h-full rounded-lg shadow-lg"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Content */}
                            <div className="px-4 sm:px-8 md:px-6 md:py-6 py-6 text-center">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 playpenSans">
                                    {selectedArea.areaName}
                                </h2>

                                <p className="text-sm sm:sm text-gray-900 leading-relaxed max-w-3xl mx-auto">
                                    {selectedArea.areaDescription}
                                </p>

                                {/* Button */}
                                <div className="md:mt-4 mt-6">
                                    <Link
                                        href={`/protected-area/${selectedArea.id}`}
                                    >
                                        <button className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-emerald-400 text-black font-semibold hover:bg-emerald-500 transition">
                                            SEE MORE
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </ClientModal>
            </div>
        </>
    );
};

export default Home;
Home.layout = (page) => (
    <MainLayout user={page.props.auth.user} children={page} />
);
