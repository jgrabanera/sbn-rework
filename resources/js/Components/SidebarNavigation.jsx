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

const SidebarNavigation = ({ user }) => {
    const { url } = usePage();
    const baseNav =
        "flex items-center px-3 py-2 rounded-lg hover:bg-teal-800 hover:text-yellow-100";
    const activeNav = `${baseNav} bg-teal-800 text-white`;
    const inactiveNav = `${baseNav} text-black`;

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
                    className={`${
                        url.includes("/dashboard") ? activeNav : inactiveNav
                    }`}
                >
                    <FaHome className="w-5 h-5 mr-3" />
                    <span className="flex-1">Dashboard</span>
                </Link>
                <Link
                    href={route("area-category")}
                    className={`${
                        url.includes("/area") ? activeNav : inactiveNav
                    }`}
                >
                    <BiSolidCategoryAlt className="w-5 h-5 mr-3" />
                    <span className="flex-1">Area Category</span>
                </Link>
                <Link
                    href={route("about-category")}
                    className={`${
                        url.includes("/about") ? activeNav : inactiveNav
                    }`}
                >
                    <TbHelpHexagonFilled className="w-5 h-5 mr-3" />
                    <span className="flex-1">About</span>
                </Link>
                <Link
                    href={route("sights-category")}
                    className={`${
                        url.includes("/sights") ? activeNav : inactiveNav
                    }`}
                >
                    <GiFlyingFlag className="w-5 h-5 mr-3" />
                    <span className="flex-1">Sights To See</span>
                </Link>
                <Link
                    href={route("wildlife-category")}
                    className={`${
                        url.includes("/wildlife") ? activeNav : inactiveNav
                    }`}
                >
                    <GiPlantsAndAnimals className="w-5 h-5 mr-3" />
                    <span className="flex-1">Wildlife</span>
                </Link>

                <Link
                    href={route("ecotourism-category")}
                    className={`${
                        url.includes("/ecotourism") ? activeNav : inactiveNav
                    }`}
                >
                    <MdOutlineCompost className="w-5 h-5 mr-3" />
                    <span className="flex-1">Ecotourism</span>
                </Link>
                <Link
                    href={route("conservation-category")}
                    className={`${
                        url.includes("/conservation") ? activeNav : inactiveNav
                    }`}
                >
                    <GiCircleForest className="w-5 h-5 mr-3" />
                    <span className="flex-1">Conservation</span>
                </Link>
                <Link
                    href={route("people-category")}
                    className={`${
                        url.includes("/people") ? activeNav : inactiveNav
                    }`}
                >
                    <FaPeopleRoof className="w-5 h-5 mr-3" />
                    <span className="flex-1">People</span>
                </Link>
                <Link
                    href={route("threats-category")}
                    className={`${
                        url.includes("/threats") ? activeNav : inactiveNav
                    }`}
                >
                    <PiSealWarningFill className="w-5 h-5 mr-3" />
                    <span className="flex-1">Threats</span>
                </Link>
                <Link
                    href={route("researches-category")}
                    className={`${
                        url.includes("/researches") ? activeNav : inactiveNav
                    }`}
                >
                    <GiArchiveResearch className="w-5 h-5 mr-3" />
                    <span className="flex-1">Researches</span>
                </Link>
                <Link
                    href={route("management-category")}
                    className={`${
                        url.includes("/management") ? activeNav : inactiveNav
                    }`}
                >
                    <MdManageAccounts className="w-5 h-5 mr-3" />
                    <span className="flex-1">Management</span>
                </Link>
                <Link
                    href={route("dos-and-donts-category")}
                    className={`${
                        url.includes("/dos-and-donts")
                            ? activeNav
                            : inactiveNav
                    }`}
                >
                    <MdOutlineChecklistRtl className="w-5 h-5 mr-3" />
                    <span className="flex-1">Do&apos;s and Don&apos;ts</span>
                </Link>
                <Link
                    href={route("quiz-category")}
                    className={`${
                        url.includes("/quiz-category")
                            ? activeNav
                            : inactiveNav
                    }`}
                >
                    <BsPatchQuestionFill className="w-5 h-5 mr-3" />
                    <span className="flex-1">Quiz CMS</span>
                </Link>
            </nav>
        </div>
    );
};

export default SidebarNavigation;
