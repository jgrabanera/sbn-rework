import { FaHome } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import {
    GiFlyingFlag,
    GiPlantsAndAnimals,
    GiCircleForest,
} from "react-icons/gi";
import { GiArchiveResearch } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { MdOutlineCompost } from "react-icons/md";
import { TbHelpHexagonFilled } from "react-icons/tb";
import { Link, usePage } from "@inertiajs/react";
import { PiSealWarningFill } from "react-icons/pi";
import ApplicationLogoWide from "@/Components/ApplicationLogoWide";
import { BsPatchQuestionFill } from "react-icons/bs";
import { useAdminSections } from "@/Hooks/useAdminSections";

// Icon components keyed by the `icon` value in config/admin.php.
const ICONS = {
    category: BiSolidCategoryAlt,
    help: TbHelpHexagonFilled,
    flag: GiFlyingFlag,
    animals: GiPlantsAndAnimals,
    compost: MdOutlineCompost,
    forest: GiCircleForest,
    people: FaPeopleRoof,
    warning: PiSealWarningFill,
    research: GiArchiveResearch,
    accounts: MdManageAccounts,
    checklist: MdOutlineChecklistRtl,
    quiz: BsPatchQuestionFill,
};

const SidebarNavigation = () => {
    const { url } = usePage();
    const sections = useAdminSections();

    const baseNav =
        "flex items-center px-3 py-2 rounded-lg hover:bg-teal-800 hover:text-yellow-100";
    const activeNav = `${baseNav} bg-teal-800 text-white`;
    const inactiveNav = `${baseNav} text-black`;

    // Longest route first so `/area-category` wins over `/area`.
    const isActive = (route) => {
        const current = url.split("?")[0].replace(/\/$/, "");
        return current === route || current.startsWith(`${route}/`);
    };

    return (
        <div className=" text-gray-900 flex flex-col justify-between">
            {/* Logo */}
            <Link href="/" className="flex justify-center items-center py-4">
                <ApplicationLogoWide className="drop-shadow block h-14 w-auto fill-current text-gray-800" />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <Link
                    href={route("dashboard")}
                    className={`${baseNav} ${
                        isActive("/dashboard")
                            ? "bg-teal-800 text-white"
                            : "text-black"
                    }`}
                >
                    <FaHome className="w-5 h-5 mr-3" />
                    <span className="flex-1">Dashboard</span>
                </Link>

                {sections.map((section) => {
                    const Icon = ICONS[section.icon];

                    return (
                        <Link
                            key={section.key}
                            href={section.route}
                            className={isActive(section.route)
                                ? activeNav
                                : inactiveNav}
                        >
                            {Icon ? (
                                <Icon className="w-5 h-5 mr-3" />
                            ) : (
                                <span className="w-5 h-5 mr-3" />
                            )}
                            <span className="flex-1">
                                {section.sidebar_label ?? section.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default SidebarNavigation;