import Modal from "@/Components/Modal";
import { useState, useCallback } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaTableList } from "react-icons/fa6";
import { LuFile, LuUpload } from "react-icons/lu";

const AreaModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [errors, setErrors] = useState({});

    const handleImageFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };
    const handleVideoFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };
    const handleClose = () => {
        setModalOpen(false);
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        console.log(name, ":", value);
    }, []);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", data.desc);
        formData.append("desc", data.code);
        formData.append("video", videoFile);
        formData.append("image", imageFile);

        try {
            setLoading(true);

            const response = await axios.post("/storeArea", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert(response.data.message || "Data saved successfully!");
                setModalOpen(false);
            } else {
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <div>Loading...</div>
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="md:max-w-40 md:w-full  w-full h-12 mb-2 bg-green-600 hover:bg-green-700 border-2 text-white hover:text-gray-40000 border-gray-200 rounded-xl py-2 my-2  font-bold flex flex-row justify-center items-center gap-3 hover:cursor-pointer"
            >
                <FaPlusCircle size={20} />
                Add Area
            </button>{" "}
            <Modal
                show={modalOpen}
                onClose={handleClose}
                className={" "}
                maxWidth="xl"
            >
                <form className="">
                    <div className="relative bg-white rounded-xl shadow-lg p-6 lg:max-w-4xl md:min-w-64 md:max-h-min max-h-[90vh] w-auto overflow-auto">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-800 flex flex-row gap-3 justify-center items-center">
                                <FaTableList size={18} />
                                New Protected Area
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="flex  flex-col gap-4">
                            <div className="flex flex-col justify-center w-full sm: gap-2">
                                <div className="">
                                    <label>Protected Area Name:</label>
                                    <input
                                        onChange={handleChange}
                                        name="desc"
                                        type="text"
                                        className="input w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label>Description:</label>
                                    <textarea
                                        onChange={handleChange}
                                        name="code"
                                        type="text"
                                        rows="4"
                                        className=" input w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex md:flex-row flex-col gap-4 items-center justify-center">
                                {/* IMAGE UPLOAD */}
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full min-w-60 h-36 cursor-pointer px-5 hover:border-blue-400 transition"
                                >
                                    {imageFile ? (
                                        <div className="flex flex-col items-center text-gray-700">
                                            <LuFile className="w-10 h-10 text-blue-500 mb-2" />
                                            <p className="text-sm font-medium">
                                                {imageFile.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                File selected
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <LuUpload className="w-7 h-7 mb-2 text-blue-500" />
                                            <p className="text-sm font-medium">
                                                Drag and drop file here or{" "}
                                                <span className="text-blue-500 underline">
                                                    choose file
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Supported formats: JPG, JPEG,
                                                PNG
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleImageFileChange}
                                        className="hidden"
                                    />
                                </label>

                                {/* VIDEO UPLOAD */}
                                <label
                                    htmlFor="video-upload"
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full min-w-60 h-36 cursor-pointer px-5 hover:border-blue-400 transition"
                                >
                                    {videoFile ? (
                                        // --- State 1: File is selected ---
                                        <div className="flex flex-col items-center text-gray-700">
                                            {/* FIX 2: Made the file icon size consistent (w-7 h-7) */}
                                            <LuFile className="w-7 h-7 text-blue-500 mb-2" />
                                            <p className="text-sm font-medium">
                                                {videoFile.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                File selected
                                            </p>
                                        </div>
                                    ) : (
                                        // --- State 2: No file selected ---
                                        <div className="flex flex-col items-center text-gray-500">
                                            <LuUpload className="w-7 h-7 mb-2 text-blue-500" />
                                            <p className="text-sm font-medium">
                                                Upload video here or{" "}
                                                <span className="text-blue-500 underline">
                                                    choose file
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Supported formats: **MP4, AVI,
                                                MPEG4**{" "}
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="video-upload"
                                        type="file"
                                        // These are the accepted file formats
                                        accept=".mp4,.avi,.mpeg4"
                                        onChange={handleVideoFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center my-4">
                            <button
                                type="text"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AreaModal;
