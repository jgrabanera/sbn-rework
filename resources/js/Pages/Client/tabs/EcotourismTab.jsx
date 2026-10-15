import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const EcotourismTab = ({ id }) => {
    // const { id } = useParams();
    // const { Ecotourism } = useAppContext();
    const [Ecotourism, setEcotourism] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const loadContentEcotourism = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-ecotourism-section`);
            setEcotourism(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentEcotourism();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
            {Ecotourism?.length > 0 ? (
                Ecotourism.map((eco) => {
                    if (eco.area_id == id) {
                        return (
                            <div
                                key={eco.id}
                                className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                            >
                                {/* Image 1 */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 md:min-h-150">
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
                                        <CKEditorDisplayer
                                            content={eco.article1}
                                        />
                                    </div>
                                </div>
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9   ">
                                    <div className="flex-1 w-full flex flex-col justify-start  md:min-h-[61vh] md:max-h-[61vh] overflow-y-scroll ">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={eco.article2}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })
            ) : (
                <div className="text-center">No Records Found.</div>
            )}
        </div>
    );
};

export default EcotourismTab;
