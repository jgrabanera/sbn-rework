// import { useParams } from "react-router-dom";
// import { useAppContext } from "../../contexts/AppContext";
// import CKEditorDisplayer from "../../components/CKEditorDisplayer";

import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import axios from "axios";
import { useEffect, useState } from "react";

const PeopleTab = ({ id }) => {
    // const { id } = useParams();
    // const { People } = useAppContext();
    const [People, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const loadContentPeople = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-people-section`);
            setPeople(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentPeople();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {People?.length > 0 ? (
                People.map((ppl) => {
                    if (ppl.area_id == id) {
                        return (
                            <div
                                key={ppl.id}
                                className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                            >
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9  md:min-h-150 md:max-h-150 ">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={ppl.article1}
                                        />
                                    </div>
                                </div>

                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9 ">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={ppl.article2}
                                        />
                                    </div>
                                </div>
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9   ">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={ppl.article3}
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

export default PeopleTab;
