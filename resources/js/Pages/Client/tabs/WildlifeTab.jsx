import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";
import { useMemo, useState } from "react";

const WildlifeTab = ({ id }) => {
    // The endpoint is already scoped to this area, so the payload only
    // contains the tabs that belong here.
    const { data, loading, error, retry } = useKioskSection(
        `/get-wildlife-section?area=${id}`,
        { enabled: Boolean(id) },
    );

    const [activeTabId, setActiveTabId] = useState(null);
    const [activeItemId, setActiveItemId] = useState(null);

    const tabs = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    // Derive rather than sync via effect: a null selection means "first one".
    const activeTab =
        tabs.find((tab) => tab.id === activeTabId) ?? tabs[0] ?? null;

    const activeItem =
        activeTab?.wildlife_items?.find((item) => item.id === activeItemId) ??
        activeTab?.wildlife_items?.[0] ??
        null;

    if (loading) return <KioskLoading />;
    if (error) return <KioskError message={error} onRetry={retry} />;
    if (!tabs.length) {
        return <KioskEmpty message="No wildlife data found." />;
    }

    return (
        <div className="flex flex-col gap-2 w-full ">
            {/* TABS */}
            <div className="flex justify-start gap-4 w-full md:overflow-hidden overflow-x-scroll ">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTabId(tab.id);
                            setActiveItemId(null);
                        }}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold
              ${
                  activeTab?.id === tab.id
                      ? "bg-white text-black-500"
                      : "bg-white/70 text-gray-500"
              }`}
                    >
                        {tab.tab_name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="flex md:flex-row flex-col  gap-5 w-full h-full  ">
                {/* LEFT GRID */}
                <div className="md:max-w-3/5 w-full bg-white/30 rounded-xl p-4 h-full ">
                    <div className="md:min-h-[61vh] md:max-h-[61vh] h-full overflow-y-scroll  [scrollbar-width:thin]">
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 grid-rows-3 gap-4">
                            {activeTab?.wildlife_items?.map((item) => (
                                <img
                                    key={item.id}
                                    src={`/storage/images/${item.thumbnail_url}`}
                                    alt={`${
                                        activeTab?.tab_name || "Wildlife"
                                    } thumbnail`}
                                    onClick={() => setActiveItemId(item.id)}
                                    className={`object-cover rounded-lg cursor-pointer md:h-40 md:w-60 border-4 m-auto border-white
                  ${
                      activeItem?.id === item.id
                          ? "border-blue-500"
                          : "border-transparent"
                  }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="md:max-w-2/5 w-full bg-white rounded-xl p-4  h-full">
                    <div className="h-full md:min-h-[61vh] md:max-h-[61vh]  overflow-y-scroll   [scrollbar-width:thin]">
                        {activeItem ? (
                            <>
                                {activeItem.contents?.map((c) => (
                                    <CKEditorDisplayer
                                        key={c.id}
                                        content={c.content}
                                    />
                                ))}
                            </>
                        ) : (
                            <p className="text-gray-500">
                                No wildlife item selected.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WildlifeTab;