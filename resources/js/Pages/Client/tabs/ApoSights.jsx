import { IoMdPin } from "react-icons/io";
import { useMemo, useState } from "react";
import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";

// Map pin layout for the APO Island dive sites. Positions are artwork
// specific, so they stay in code alongside the site id they activate.
const SPOTS = [
    { id: 6, name: "Coconut", pos: "md:left-[680px] md:top-[200px]" },
    { id: 7, name: "Olo", pos: "md:left-[780px] md:top-[256px]" },
    { id: 8, name: "Cogon", pos: "md:left-[820px] md:top-[320px]" },
    { id: 9, name: "Mamsa Point", pos: "md:left-[760px] md:top-[420px]" },
    { id: 10, name: "Kan-Uran", pos: "md:left-[720px] md:top-[480px]" },
    { id: 11, name: "Marine Sanctuary", pos: "md:left-[760px] md:top-[530px]" },
    { id: 12, name: "Rock Point East", pos: "md:left-[710px] md:top-[630px]" },
    { id: 5, name: "Rock Point West", pos: "md:left-[470px] md:top-[690px]" },
    { id: 4, name: "Katipanan", pos: "md:left-[510px] md:top-[610px]" },
    { id: 3, name: "Chapel", pos: "md:left-[540px] md:top-[530px]" },
    { id: 1, name: "Baluarte", pos: "md:left-[460px] md:top-[450px]" },
    { id: 2, name: "Largahan", pos: "md:left-[420px] md:top-[350px]" },
];

const ApoSightsTab = ({ id }) => {
    const {
        data: contentSights,
        loading: loadingSights,
        error: errorSights,
        retry: retrySights,
    } = useKioskSection(`/get-apo-sights-section?area=${id}`, {
        enabled: Boolean(id),
    });

    const {
        data: sites,
        loading: loadingSites,
        error: errorSites,
        retry: retrySites,
    } = useKioskSection(`/get-sights-section?area=${id}`, {
        enabled: Boolean(id),
    });

    const [spotID, setSpotID] = useState(null);

    const loading = loadingSights || loadingSites;
    const error = errorSights || errorSites;
    const retry = () => {
        retrySights();
        retrySites();
    };

    const sights = useMemo(
        () => (Array.isArray(contentSights) ? contentSights : []),
        [contentSights],
    );

    // Derive with a fallback so the panel is never empty by default.
    const activeSpot =
        sights.find((spot) => spot.id === spotID) ?? sights[0] ?? null;

    // Only render pins that have real content behind them.
    const visibleSpots = SPOTS.filter((spot) =>
        sights.some((sight) => sight.id === spot.id),
    );

    const activeSite = sites?.[0] ?? null;

    if (loading) return <KioskLoading />;
    if (error) return <KioskError message={error} onRetry={retry} />;
    if (!sights.length) {
        return <KioskEmpty message="No dive site content available." />;
    }

    const baseBtnClasses =
        "rounded-md h-8 min-w-30 bg-white/80 flex flex-row items-center justify-center absolute px-2 text-gray-900 text-center uppercase text-sm font-semibold  hover:scale-110 duration-100";

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full md:min-h-[68vh] md:max-h-[68vh] h-full">
            {/* Map image with pins */}
            {activeSite && (
                <div
                    style={{
                        backgroundImage: `url("/storage/images/${activeSite.map_filename}")`,
                    }}
                    className="h-56 md:min-h-[68vh] md:max-h-[68vh] w-full max-w-5xl bg-cover bg-center bg-no-repeat rounded-lg border-4 border-gray-200 sm:pt-0"
                >
                    {visibleSpots.map((spot) => (
                        <button
                            key={spot.id}
                            type="button"
                            onClick={() => setSpotID(spot.id)}
                            aria-pressed={activeSpot?.id === spot.id}
                            className={`${spot.pos} ${baseBtnClasses} ${
                                activeSpot?.id === spot.id
                                    ? "ring-2 ring-emerald-400"
                                    : ""
                            }`}
                        >
                            <IoMdPin color="#ff3e3e" size={24} />
                            {spot.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Right side – content */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 ">
                <div className="flex-1 w-full flex flex-col justify-start overflow-y-scroll">
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
                </div>
            </div>
        </div>
    );
};

export default ApoSightsTab;