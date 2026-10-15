import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";

const ManagementTab = ({ id }) => {
    const { data, loading, error, retry } = useKioskSection(
        `/get-management-section?area=${id}`,
        { enabled: Boolean(id) },
    );

    if (loading) return <KioskLoading />;
    if (error) return <KioskError message={error} onRetry={retry} />;
    if (!data?.length) {
        return <KioskEmpty message="No management content available." />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {data.map((mgnt) => (
                <div
                    key={mgnt.id}
                    className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                >
                    {/* Image 1 */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4">
                        <div
                            style={{
                                backgroundImage: `url(/storage/images/${mgnt.image_url})`,
                            }}
                            className="w-full md:h-full rounded-lg bg-center bg-no-repeat bg-cover  h-full"
                        />
                    </div>
                    {/* Text card */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                        <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                            {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                            <CKEditorDisplayer content={mgnt.article1} />
                        </div>
                    </div>

                    {/* Text card */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                        <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                            {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                            <CKEditorDisplayer content={mgnt.article2} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManagementTab;