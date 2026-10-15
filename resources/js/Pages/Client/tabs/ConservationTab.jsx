import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import axios from "axios";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const ConservationTab = ({ id }) => {
    // const { id } = useParams();
    // const { Conservation } = useAppContext();
    const [Conservation, setConservation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const loadContentConservation = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-conservation-section`);
            setConservation(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentConservation();
    }, []);
    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {Conservation?.length > 0 ? (
                Conservation.map((con) => {
                    if (con.area_id == id) {
                        return (
                            <div
                                key={con.id}
                                className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                            >
                                {/* Image 1 */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-4 ">
                                    <div
                                        style={{
                                            backgroundImage: `url(/storage/images/${con.image_url})`,
                                        }}
                                        className="w-full rounded-lg bg-center bg-no-repeat bg-cover  h-full"
                                    />
                                </div>

                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9 ">
                                    <div className=" flex-1 w-full flex flex-col justify-start overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={con.article1}
                                        />
                                    </div>
                                </div>
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                                    <div className="flex-1 w-full flex flex-col justify-start overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={con.article2}
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

export default ConservationTab;

{
    /* <div className="flex flex-row bg-white rounded-lg shadow-lg/20 p-4">
  <div className="flex-1  bg-white rounded-lg shadow-lg/20 p-4 md:min-h-150">
    <div
      style={{
        backgroundImage: `url(${apiUrl}/storage/uploaded-images/${eco.image_url})`,
      }}
      className="w-full h-64 md:h-full rounded-lg bg-center bg-no-repeat bg-cover"
    />
  </div>
</div>; */
}
