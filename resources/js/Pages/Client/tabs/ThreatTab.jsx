import React, { useEffect, useState } from "react";
import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import axios from "axios";

const ThreatTab = ({ id }) => {
    const [Threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const loadContentThreats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-threats-section`);
            setThreats(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentThreats();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {Threats?.length > 0 ? (
                Threats.map((trt) => {
                    if (trt.area_id == id) {
                        return (
                            <div
                                key={trt.id}
                                className="w-full flex flex-col md:flex-row gap-4 items-stretch"
                            >
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={trt.article1}
                                        />
                                    </div>
                                </div>

                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={trt.article2}
                                        />
                                    </div>
                                </div>
                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={trt.article3}
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

export default ThreatTab;
