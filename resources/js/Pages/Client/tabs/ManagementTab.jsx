import CKEditorDisplayer from "@/Components/CKEditorDisplayer";
import axios from "axios";
import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const ManagementTab = ({ id }) => {
    const [Management, setManagement] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const loadContentManagement = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-management-section`);
            setManagement(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentManagement();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {Management?.length > 0 ? (
                Management.map((mgnt) => {
                    if (mgnt.area_id == id) {
                        return (
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
                                        <CKEditorDisplayer
                                            content={mgnt.article1}
                                        />
                                    </div>
                                </div>

                                {/* Text card */}
                                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg/20 p-9">
                                    <div className="flex-1 w-full flex flex-col justify-start   overflow-y-scroll md:min-h-[61vh] md:max-h-[61vh] h-full">
                                        {/* 🔹 Show content exactly as stored (keep bullets, line breaks) */}
                                        <CKEditorDisplayer
                                            content={mgnt.article2}
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

export default ManagementTab;
