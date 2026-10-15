// import { Link, useParams } from "react-router-dom";
// import { useAppContext } from "../../contexts/AppContext";
import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { useEffect, useMemo, useState } from "react";

const SightsTab = ({ id }) => {
    const [ContentSights, setContentSights] = useState([]);
    const [Sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);

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
    const activeSite = useMemo(
        () => Sites.find((site) => site.id == id) || null,
        [Sites, id],
    );

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 items-stretch md:min-h-[68vh] md:max-h-[68vh] h-full">
            {/* Map Image */}
            {activeSite && (
                <div
                    style={{
                        backgroundImage: `url("/storage/images/${activeSite?.map_filename}")`,
                    }}
                    className="h-56 md:min-h-[68vh] md:max-h-[68vh]  w-full max-w-5xl bg-cover bg-center bg-no-repeat rounded-2xl border-4 border-white/70 shadow-xl"
                ></div>
            )}

            {/* Glass Content Panel */}
            <div className="flex-1 flex flex-col bg-white/10s border bg-white border-white/30 rounded-2xl shadow-2xl p-6 text-white">
                <div className="flex-1 w-full flex flex-col justify-start overflow-y-auto">
                    {ContentSights.length > 0 ? (
                        ContentSights.map((content) => {
                            if (content.areaID == id) {
                                return (
                                    <div
                                        key={content.id}
                                        className="text-black leading-relaxed md:max-h-140 overflow-y-auto"
                                    >
                                        <CKEditorDisplayer
                                            content={content.content}
                                        />
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <p className="text-white/60 text-sm">
                            Loading sights...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SightsTab;
