// import { useParams } from "react-router-dom";
import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const WildlifeTab = ({ id }) => {
    const [Wildlife, setWildlife] = useState([]);
    // const [WildlifeItems, setWildlifeItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const areaWildlife = useMemo(() => {
        return Wildlife.filter((tab) => tab.area_id == Number(id));
    }, [Wildlife, id]);

    const [activeTab, setActiveTab] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    const loadWildlife = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-wildlife-section`);
            setWildlife(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWildlife();
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (areaWildlife.length > 0) {
            const firstTab = areaWildlife[0];
            const firstItem = firstTab.wildlife_items?.[0] || null;

            setActiveTab(firstTab);
            setActiveItem(firstItem);
        }
    }, [areaWildlife]);

    if (!areaWildlife.length) {
        return (
            <p className="text-white text-center">No wildlife data found.</p>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full ">
            {/* TABS */}
            <div className="flex justify-start gap-4 w-full md:overflow-hidden overflow-x-scroll ">
                {areaWildlife.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab);
                            setActiveItem(tab.wildlife_items?.[0] || null);
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
                                    onClick={() => setActiveItem(item)}
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
