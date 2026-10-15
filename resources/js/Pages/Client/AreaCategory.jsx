import MainLayout from "@/Layouts/MainLayout";
import BottomHNav from "@/Components/BottomHNav";
import Header from "@/Components/Header";
import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";

const AreaCategory = ({ area }) => {
    const [areaCategory, setAreaCategory] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        const params = `area=${area?.id}`;
        const res = await axios.get(`/get-protected-area?${params}`);
        setAreaCategory(res.data);

        // console.log("Loaded area category:", res.data);
    };

    useEffect(() => {
        getData();
    }, []);

    const getAreaCategoryLink = (areaCategoryItem) => {
        const areaCategoryId = areaCategoryItem.area_category_id;

        return `/protected-area/${area?.id}/section/${areaCategoryId}`;
    };

    if (loading) return <div>Loading..</div>;
    return (
        <>
            <Head title="Category" />
            <div>
                <div className="min-h-screen  w-full p-2 flex flex-col items-center justify-between">
                    {/* Header */}
                    <Header />

                    {/* Title */}
                    <h1
                        className=" md:text-4xl text-2xl font-bold text-center mb-2 text-white playpenSans text-shadow-lg/50"
                        style={{
                            textShadow: `-1px -1px 0 #000,1px -1px 0 #000,-1px  1px 0 #000,1px  1px 0 #000`,
                        }}
                    >
                        {area.areaName}
                    </h1>
                    {/* Content */}
                    <div className="md:max-h-10/12 md:h-10/12 h-full w-full md:p-6 p-2 mb-3">
                        <div className="mx-auto max-w-[95%] md:w-11/12 flex justify-center">
                            <div className="flex flex-wrap justify-center gap-3 md:gap-5 w-full">
                                {areaCategory.map(
                                    (item, index) =>
                                        item.areaID == area?.id && (
                                            <div
                                                key={index}
                                                className="relative rounded-2xl border-3 border-gray-200 border-2 overflow-hidden bg-white shadow-lg/20 cursor-pointer w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.833rem)] lg:w-[calc(20%-1rem)]"
                                            >
                                                <Link
                                                    href={getAreaCategoryLink(
                                                        item,
                                                    )}
                                                >
                                                    <div>
                                                        {/* Image */}
                                                        <img
                                                            src={`/storage/images/${item.imagePath}`}
                                                            alt={
                                                                item.categoryName
                                                            }
                                                            className="md:max-h-64 h-full w-full object-cover"
                                                        />

                                                        {/* Label */}
                                                        <div className="h-16 absolute bottom-4 bg-white flex items-center px-4 py-2 transition-transform duration-300 hover:scale-105 rounded-br-lg rounded-tr-lg shadow">
                                                            <p className="md:text-lg text-sm font-semibold text-gray-800 text-center whitespace-wrap playpenSans">
                                                                {
                                                                    item.categoryName
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <BottomHNav id={area?.id} />
                </div>
            </div>
        </>
    );
};

export default AreaCategory;
AreaCategory.layout = (page) => (
    <MainLayout user={page.props.auth.user} children={page} />
);
