import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAdminSections } from "@/Hooks/useAdminSections";

import area from "../../../assets/lottiefiles/area.json";
import leaf from "../../../assets/lottiefiles/leaf.json";
import mountain from "../../../assets/lottiefiles/mountain.json";
import wildlife from "../../../assets/lottiefiles/wildlife.json";
import ecotour from "../../../assets/lottiefiles/ecotourism.json";
import conservation from "../../../assets/lottiefiles/conservation.json";
import people from "../../../assets/lottiefiles/people.json";
import alert from "../../../assets/lottiefiles/threats.json";
import research from "../../../assets/lottiefiles/research.json";
import management from "../../../assets/lottiefiles/management.json";

const cardAnimations = {
    area,
    about: leaf,
    sights: mountain,
    wildlife,
    ecotourism: ecotour,
    conservation,
    people,
    threats: alert,
    researches: research,
    management,
    dosanddonts: management,
    quiz: research,
};

function DashboardCard({ section, count }) {
    return (
        <Link href={section.route} className="group block h-full">
            <article className="flex h-full flex-col rounded-card border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">
                            {section.title}
                        </h2>
                    </div>
                    <div className="rounded-full bg-accent-50 px-3 py-1 text-sm font-semibold text-accent-700">
                        {count}
                    </div>
                </div>

                <div className="mt-2 flex justify-center">
                    <Lottie
                        animationData={cardAnimations[section.key]}
                        loop={true}
                        autoplay={true}
                        style={{ width: 120, height: 120 }}
                    />
                </div>

                <p className="mt-auto text-sm leading-6 text-slate-600">
                    {section.description}
                </p>
            </article>
        </Link>
    );
}

export default function Dashboard() {
    const fallbackSections = useAdminSections();
    const [totals, setTotals] = useState({
        sections: fallbackSections.length,
        records: 0,
    });
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let active = true;

        const loadSummary = async () => {
            try {
                const response = await axios.get("/admin/summary");

                if (!active) return;

                const sections = Array.isArray(response.data?.sections)
                    ? response.data.sections
                    : [];

                setCounts(
                    Object.fromEntries(sections.map((s) => [s.key, s.count])),
                );
                setTotals(response.data?.totals ?? totals);
                setFailed(false);
            } catch {
                if (!active) return;
                // The cards still render from the shared config; only the
                // per-section counts fall back to a dash.
                setFailed(true);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadSummary();

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head title="Dashboard" />

            <div className="cms-shell">
                <div className="cms-container">
                    {/* <section className="overflow-hidden rounded-card bg-gradient-to-r from-brand-800 via-brand-700 to-accent-600 p-6 text-white shadow-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-100">
                            Admin Control Center
                        </p>

                        {failed && (
                            <p
                                role="alert"
                                className="mt-3 rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900"
                            >
                                Record counts are unavailable. Section links
                                still work.
                            </p>
                        )}

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-control bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-sm text-accent-50/80">
                                    Sections
                                </p>
                                <p className="mt-1 text-3xl font-semibold">
                                    {totals.sections}
                                </p>
                            </div>
                            <div className="rounded-control bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-sm text-accent-50/80">
                                    Tracked records
                                </p>
                                <p className="mt-1 text-3xl font-semibold">
                                    {loading
                                        ? "..."
                                        : failed
                                          ? "-"
                                          : totals.records}
                                </p>
                            </div>
                            <div className="rounded-control bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-sm text-accent-50/80">
                                    Admin entry
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    /admin
                                </p>
                            </div>
                        </div>
                    </section> */}

                    <section className=" grid gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {fallbackSections.map((section) => (
                            <DashboardCard
                                key={section.key}
                                section={section}
                                count={
                                    loading ? "-" : (counts[section.key] ?? "-")
                                }
                            />
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
