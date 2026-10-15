import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";
import { useMemo, useState } from "react";
import { FaInfoCircle, FaHistory, FaRoute } from "react-icons/fa";

const AboutTab = ({ area }) => {
    // Tabs: ABOUT, HISTORY, HOW TO GET THERE
    const [activeTab, setActiveTab] = useState("tab1");

    const { data, loading, error, retry } = useKioskSection(
        `/get-about-section?area=${area}`,
        { enabled: Boolean(area) },
    );

    const baseBtnClasses =
        "w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 text-center font-semibold text-sm rounded-lg transition-all duration-300";

    const safeContentAbout = useMemo(
        () => (Array.isArray(data) ? data : []),
        [data],
    );

    const tabKeyToId = {
        tab1: 1, // ABOUT
        tab2: 2, // HISTORY
        tab3: 3, // HOW TO GET THERE
    };

    const currentTabId = tabKeyToId[activeTab];

    // Retrieve data: get the single row that matches this area + tab
    const current = useMemo(
        () =>
            safeContentAbout.find(
                (item) => String(item.tabID) === String(currentTabId),
            ),
        [safeContentAbout, currentTabId],
    );

    const image1Url =
        current?.imagePath1 && String(current.imagePath1).trim()
            ? `/storage/images/${current.imagePath1}`
            : "";
    const image2Url =
        current?.imagePath2 && String(current.imagePath2).trim()
            ? `/storage/images/${current.imagePath2}`
            : "";

    return (
        <div className="w-full flex flex-col gap-2 md:min-h-[68vh] md:max-h-[68vh] h-full">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row justify-start items-center gap-3 w-full md:w-auto">
                {/* ABOUT */}
                <button
                    className={`${baseBtnClasses} ${
                        activeTab === "tab1"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-100 text-gray-900 hover:bg-blue-200"
                    }`}
                    onClick={() => setActiveTab("tab1")}
                >
                    <FaInfoCircle className="text-lg" />
                    <span>ABOUT</span>
                </button>

                {/* HISTORY */}
                <button
                    className={`${baseBtnClasses} ${
                        activeTab === "tab2"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-100 text-gray-900 hover:bg-blue-200"
                    }`}
                    onClick={() => setActiveTab("tab2")}
                >
                    <FaHistory className="text-lg" />
                    <span>HISTORY</span>
                </button>

                {/* HOW TO GET THERE */}
                <button
                    className={`${baseBtnClasses} ${
                        activeTab === "tab3"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-100 text-gray-900 hover:bg-blue-200"
                    }`}
                    onClick={() => setActiveTab("tab3")}
                >
                    <FaRoute className="text-lg" />
                    <span>HOW TO GET THERE</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {loading && <KioskLoading />}

                {!loading && error && (
                    <KioskError message={error} onRetry={retry} />
                )}

                {!loading && !error && !current && (
                    <div className="text-sm text-gray-500">
                        No content available for this tab.
                    </div>
                )}

                {!loading && !error && current && (
                    <div className="w-full flex flex-col md:flex-row gap-4 items-stretch">
                        {/* Image 1 */}
                        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 ">
                            <div
                                style={{
                                    backgroundImage: image1Url
                                        ? `url('${image1Url}')`
                                        : "none",
                                }}
                                className="w-full  md:h-full rounded-lg bg-center bg-no-repeat bg-cover"
                            />
                        </div>

                        {/* Image 2 */}
                        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4">
                            <div
                                style={{
                                    backgroundImage: image2Url
                                        ? `url('${image2Url}')`
                                        : "none",
                                }}
                                className="w-full  md:h-full rounded-lg bg-center bg-no-repeat bg-cover"
                            />
                        </div>
                        {/* Text card */}
                        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 py-10 px-8 md:min-h-[62vh] md:max-h-[62vh] h-full">
                            <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll ">
                                <h2 className="text-3xl font-semibold mb-2 text-blue-500">
                                    {activeTab === "tab1" && "About"}
                                    {activeTab === "tab2" && "History"}
                                    {activeTab === "tab3" && "How to Get There"}
                                </h2>

                                {/* Show content exactly as stored (keep bullets, line breaks) */}
                                <CKEditorDisplayer
                                    content={current?.content || ""}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutTab;