import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import backgroundImage from "../../assets/images/apo-island-seaside.jpg";

export default function Guest({ children }) {
    return (
        <div
            style={{ backgroundImage: `url('${backgroundImage}')` }}
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />

            <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-md md:max-w-4xl">
                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md md:mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="hidden md:flex flex-col justify-between bg-black/25 p-8 text-white">
                                <Link
                                    href="/"
                                    className="inline-flex rounded-xl py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/30"
                                >
                                    <ApplicationLogo className="h-12 w-auto md:h-20" />
                                </Link>
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        <span className="text-yellow-400 text-lg">
                                            STARBOOKS Nature Admin
                                        </span>{" "}
                                    </h2>
                                    <p className="mt-2 text-sm text-white/80">
                                        Manage content, users, and updates in
                                        one place.
                                    </p>
                                </div>

                                <div className="text-xs text-white/60">
                                    Secure access • Responsive • Fast
                                </div>
                            </div>

                            <div className="bg-white p-6 sm:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
