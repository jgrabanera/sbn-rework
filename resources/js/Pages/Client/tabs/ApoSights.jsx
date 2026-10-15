import { IoMdPin } from "react-icons/io";
import { useState, useMemo, useEffect } from "react";
import { Link } from "@inertiajs/react";
import CKEditorDisplayer from "@/Components/CKEditorDisplayer";

const ApoSightsTab = ({ id }) => {
    const [ContentSights, setContentSights] = useState([]);
    const [Sites, setSites] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [spotID, setSpotID] = useState(1);

    const handleSpotClick = (sID) => {
        setSpotID(sID);
        console.log("Clicked spot ID:", sID);
    };

    // find the active spot by ID
    const activeSpot = useMemo(
        () => ContentSights.find((spot) => spot.id === spotID) || null,
        [ContentSights, spotID],
    );

    const activeSite = useMemo(
        () => Sites.find((site) => site.id == id) || null,
        [Sites, id],
    );

    const loadSights = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-apo-sights-section`);
            setContentSights(res.data);

            const res1 = await axios.get(`/get-sights-section`);
            setSites(res1.data);
            //console.log("Loaded content sights:", res1.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSights();
    }, []);
    const baseBtnClasses =
        "rounded-md h-8 min-w-30 bg-white/80 flex flex-row items-center justify-center absolute px-2 text-gray-900 text-center uppercase text-sm font-semibold  hover:scale-110 duration-100";

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full md:min-h-[68vh] md:max-h-[68vh] h-full">
            {/* Map image with pins */}

            {activeSite && (
                <div
                    style={{
                        backgroundImage: `url("/storage/images/${activeSite?.map_filename}")`,
                    }}
                    className="h-56 md:min-h-[68vh] md:max-h-[68vh] w-full max-w-5xl bg-cover bg-center bg-no-repeat rounded-lg border-4 border-gray-200 sm:pt-0"
                >
                    <button
                        href="#"
                        onClick={() => handleSpotClick(6)}
                        className={`md:left-[680px] md:top-[200px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Coconut
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(7)}
                        className={`md:left-[780px] md:top-[256px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Olo
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(8)}
                        className={`md:left-[820px] md:top-[320px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Cogon
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(9)}
                        className={`md:left-[760px] md:top-[420px]  ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Mamsa Point
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(10)}
                        className={`md:left-[720px] md:top-[480px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Kan-Uran
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(11)}
                        className={`md:left-[760px] md:top-[530px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Marine Sanctuary
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(12)}
                        className={`md:left-[710px] md:top-[630px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Rock Point East
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(5)}
                        className={`md:left-[470px] md:top-[690px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Rock Point West
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(4)}
                        className={`md:left-[510px] md:top-[610px]  ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Katipanan
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(3)}
                        className={`md:left-[540px] md:top-[530px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Chapel
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(1)}
                        className={`md:left-[460px] md:top-[450px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Baluarte
                    </button>
                    <button
                        href="#"
                        onClick={() => handleSpotClick(2)}
                        className={`md:left-[420px] md:top-[350px] ${baseBtnClasses}`}
                    >
                        <IoMdPin color="#ff3e3e" size={24} /> Largahan
                    </button>
                </div>
            )}

            {/* Right side – content */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 ">
                <div className="flex-1 w-full flex flex-col justify-start overflow-y-scroll">
                    {!ContentSights.length && (
                        <p className="text-gray-400 text-sm">
                            Loading sights...
                        </p>
                    )}

                    {activeSpot && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4 text-blue-500">
                                {activeSpot.site_name}
                            </h2>
                            <div className="text-gray-600 mb-4">
                                <CKEditorDisplayer
                                    content={activeSpot.content}
                                />
                            </div>
                        </>
                    )}

                    {!activeSpot && ContentSights.length > 0 && (
                        <p className="text-gray-500 text-sm italic">
                            Click a pin on the map to view details about a dive
                            site.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApoSightsTab;
