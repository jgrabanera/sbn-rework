import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";
import { HiMenuAlt1, HiMenu } from "react-icons/hi";
import ApplicationLogo from "../../assets/images/sbn-logo.png";
import SidebarNavigation from "@/Components/SidebarNavigation";

export default function Authenticated({ children }) {
    const user = usePage().props.auth.user;
    const [isOpen, setIsOpen] = useState(true);

    // Automatically open sidebar on desktop, close on mobile
    const handleResize = () => {
        setIsOpen(window.innerWidth >= 768);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <aside
                className={` fixed border-r   border-gray-200  top-0 left-0 z-40 w-64 h-screen transition-transform bg-blue-50 text-white dark:text-white
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                id="logo-sidebar"
            >
                <SidebarNavigation />
            </aside>

            <div
                className={`transition-all duration-300 flex flex-col relative md:h-screen min-h-screen ${
                    isOpen ? "md:ml-64" : "ml-0"
                }`}
            >
                <nav className="bg-teal-600  to-white border-b border-gray-100  md:static fixed w-full ">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between gap-4 h-16">
                            {/* Sidebar Toggle (Desktop) */}
                            <div className="hidden md:block mt-4">
                                {isOpen ? (
                                    <HiMenuAlt1
                                        className="text-white cursor-pointer "
                                        size={28}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ) : (
                                    <HiMenu
                                        className="text-white cursor-pointer"
                                        size={28}
                                        onClick={() => setIsOpen(true)}
                                    />
                                )}
                            </div>

                            {/* Title (Mobile) */}
                            <div className="md:hidden flex items-center gap-2 text-center">
                                <img
                                    src={ApplicationLogo}
                                    width={34}
                                    alt="STARBOOKS Nature"
                                />
                                <span className="text-lg text-green-950 font-semibold ">
                                    Admin Dashboard
                                </span>
                            </div>

                            {/* Sidebar Toggle (Mobile) */}
                            <div className="md:hidden block mt-4">
                                {isOpen ? (
                                    <HiMenuAlt1
                                        className="text-green-950 cursor-pointer"
                                        size={28}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ) : (
                                    <HiMenu
                                        className="text-green-950 cursor-pointer"
                                        size={28}
                                        onClick={() => setIsOpen(true)}
                                    />
                                )}
                            </div>

                            {/* PROFILE DROPDOWN */}
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="w-full md:mt-0 mt-12">{children}</div>
            </div>
        </div>
    );
}
