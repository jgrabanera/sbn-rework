import { Link } from "@inertiajs/react";
import defaultLogo from "../../assets/images/default.png";

const CategoryNav = ({ id, section, areaCategory }) => {
    const categories = Array.isArray(areaCategory) ? areaCategory : [];
    const currentSection =
        section && typeof section === "object"
            ? section.area_category_id
            : section;

    if (!id || !categories.length) return null;

    return (
        <div className="md:max-w-screen w-full flex-row justify-evenly items-center md:flex hidden">
            {categories.map((category) => {
                const nextSection = String(category.area_category_id);
                const isActive = String(currentSection) === nextSection;
                const iconSrc = category.iconPath
                    ? `/assets/icons/${category.iconPath}`
                    : defaultLogo;

                return (
                    <Link
                        key={`${category.areaID}-${category.area_category_id}`}
                        href={`/protected-area/${id}/section/${nextSection}`}
                        aria-current={isActive ? "page" : undefined}
                        className="flex flex-row justify-evenly items-center"
                    >
                        <div
                            className={`flex flex-col justify-center items-center md:max-w-40 w-full text-center py-2 transition-all duration-300 ${
                                isActive
                                    ? "scale-95"
                                    : "opacity-80 hover:opacity-100"
                            }`}
                        >
                            <img
                                src={iconSrc}
                                className={`w-14 mb-2 transition-all duration-300 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] ${
                                    isActive
                                        ? "bg-white/90 rounded-full p-2 scale-110 shadow-sm"
                                        : "hover:scale-110"
                                }`}
                                alt={category.categoryName}
                            />

                            <span
                                className={`text-white font-bold uppercase tracking-widest px-2 py-1 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? "text-sm [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
                                        : "text-xs [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                                }`}
                            >
                                {category.categoryName}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default CategoryNav;
