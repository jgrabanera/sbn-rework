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
        "flex items-center px-3 py-2 rounded-control transition-colors";
    const activeNav = `${baseNav} bg-brand-700 text-white`;
    const inactiveNav = `${baseNav} text-slate-700 hover:bg-brand-50 hover:text-brand-800`;

    // Longest route first so `/area-category` wins over `/area`.
    const isActive = (route) => {
        const current = url.split("?")[0].replace(/\/$/, "");
        return current === route || current.startsWith(`${route}/`);
    };

    return (
        <div className="flex flex-col justify-between text-slate-900">
            {/* Logo */}
            <Link
                href="/"
                className="flex items-center justify-center border-b border-slate-200 px-4 py-4"
            >
                <ApplicationLogoWide className="h-14 w-auto drop-shadow" />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <Link
                    href={route("dashboard")}
                    className={
                        isActive("/dashboard")
                            ? activeNav
                            : inactiveNav
                    }
                >
                    <FaHome className="mr-3 h-5 w-5" />
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
                                <Icon className="mr-3 h-5 w-5 shrink-0" />
                            ) : (
                                <span className="mr-3 h-5 w-5 shrink-0" />
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