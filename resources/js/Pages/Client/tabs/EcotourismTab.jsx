import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";

const EcotourismTab = ({ id }) => {
    const { data, loading, error, retry } = useKioskSection(
        `/get-ecotourism-section?area=${id}`,
        { enabled: Boolean(id) },
    );

    if (loading) return <KioskLoading />;
    if (error) return <KioskError message={error} onRetry={retry} />;
    if (!data?.length) {
        return <KioskEmpty message="No ecotourism content available." />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
            {data.map((eco) => (
                <div
                    key={eco.id}
                    className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                >
                    {/* Image 1 */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 md:min-h-[38rem]">
                        <div
                            style={{
                                backgroundImage: `url(/storage/images/${eco.image_url})`,
                            }}
                            className="w-full h-full rounded-lg bg-center bg-no-repeat bg-cover"
                        />
                    </div>
                    {/* Text card */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9  ">
                        <div className="flex-1 w-full flex flex-col justify-start  md:min-h-[61vh] md:max-h-[61vh]  overflow-y-scroll ">
                            {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                            <CKEditorDisplayer content={eco.article1} />
                        </div>
                    </div>
                    {/* Text card */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9   ">
                        <div className="flex-1 w-full flex flex-col justify-start  md:min-h-[61vh] md:max-h-[61vh] overflow-y-scroll ">
                            {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                            <CKEditorDisplayer content={eco.article2} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EcotourismTab;