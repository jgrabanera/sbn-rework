import MainLayout from "@/Layouts/MainLayout";
import BottomHNav from "@/Components/BottomHNav";
import Header from "@/Components/Header";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import useKioskSection from "@/Hooks/useKioskSection";
import { Head, Link } from "@inertiajs/react";

const AreaCategory = ({ area }) => {
    // The endpoint is already scoped to this area.
    const { data, loading, error, retry } = useKioskSection(
        `/get-protected-area?area=${area?.id}`,
        { enabled: Boolean(area?.id) },
    );

    const categories = Array.isArray(data) ? data : [];

    const getAreaCategoryLink = (areaCategoryItem) =>
        `/protected-area/${area?.id}/section/${areaCategoryItem.area_category_id}`;

    return (
        <>
            <Head title="Category" />
            <div>
                <div className="min-h-screen  w-full p-2 flex flex-col items-center justify-between">
                    {/* Header */}
                    <Header />

                    {/* Title */}
                    <h1 className=" md:text-4xl text-2xl font-bold text-center mb-2 text-white playpenSans text-shadow-lg/50">
                        {area.areaName}
                    </h1>

                    {/* Content */}
                    <div className="md:max-h-10/12 md:h-10/12 h-full w-full md:p-6 p-2 mb-3">
                        {loading && <KioskLoading />}

                        {!loading && error && (
                            <KioskError message={error} onRetry={retry} />
                        )}

                        {!loading && !error && categories.length === 0 && (
                            <KioskEmpty message="No sections available." />
                        )}

                        {!loading && !error && categories.length > 0 && (
                            <div className="mx-auto max-w-[95%] md:w-11/12 flex justify-center">
                                <div className="flex flex-wrap justify-center gap-3 md:gap-5 w-full">
                                    {categories.map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative rounded-2xl border-gray-200 border-2 overflow-hidden bg-white shadow-lg/20 cursor-pointer w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.833rem)] lg:w-[calc(20%-1rem)]"
                                        >
                                            <Link
                                                href={getAreaCategoryLink(item)}
                                            >
                                                <div>
                                                    {/* Image */}
                                                    <img
                                                        src={`/storage/images/${item.imagePath}`}
                                                        alt={item.categoryName}
                                                        className="md:max-h-64 h-full w-full object-cover"
                                                    />

                                                    {/* Label */}
                                                    <div className="h-16 absolute bottom-4 bg-white flex items-center px-4 py-2 rounded-br-lg rounded-tr-lg shadow">
                                                        <p className="md:text-lg text-sm font-semibold text-gray-800 text-center whitespace-wrap playpenSans">
                                                            {item.categoryName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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