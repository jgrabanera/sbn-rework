import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";

const SightsTab = ({ id }) => {
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

    const loading = loadingSights || loadingSites;
    const error = errorSights || errorSites;
    const retry = () => {
        retrySights();
        retrySites();
    };

    // Both endpoints are already scoped to this area, so the map row is
    // simply the first one returned.
    const activeSite = sites?.[0] ?? null;

    if (loading) return <KioskLoading />;
    if (error) return <KioskError message={error} onRetry={retry} />;
    if (!contentSights?.length) {
        return <KioskEmpty message="No sights content available." />;
    }

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 items-stretch md:min-h-[68vh] md:max-h-[68vh] h-full">
            {/* Map Image */}
            {activeSite && (
                <div
                    style={{
                        backgroundImage: `url("/storage/images/${activeSite.map_filename}")`,
                    }}
                    className="h-56 md:min-h-[68vh] md:max-h-[68vh]  w-full max-w-5xl bg-cover bg-center bg-no-repeat rounded-2xl border-4 border-white/70 shadow-xl"
                ></div>
            )}

            {/* Glass Content Panel */}
            <div className="flex-1 flex flex-col border bg-white border-white/30 rounded-2xl shadow-2xl p-6 text-white">
                <div className="flex-1 w-full flex flex-col justify-start overflow-y-auto">
                    {contentSights.map((content) => (
                        <div
                            key={content.id}
                            className="text-black leading-relaxed md:max-h-140 overflow-y-auto"
                        >
                            <CKEditorDisplayer content={content.content} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SightsTab;