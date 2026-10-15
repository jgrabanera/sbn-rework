import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FaPlusCircle } from "react-icons/fa";

const DosAndDontsCategory = () => {
    const sampleItems = [
        {
            id: 1,
            area: "Balinsasayao Twin Lakes",
            type: "Do",
            title: "Stay on marked trails",
            description:
                "Guide visitors to remain on designated paths to protect fragile habitat and reduce erosion.",
        },
        {
            id: 2,
            area: "Apo Island",
            type: "Don't",
            title: "Do not touch marine life",
            description:
                "Remind guests to avoid handling corals, turtles, and other marine animals during tours and snorkeling.",
        },
    ];

    return (
        <>
            <Head title="Do's and Don'ts Category" />

            <div className="cms-shell">
                <div className="cms-container">
                    <div className="cms-card p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
                                    Do&apos;s and Don&apos;ts Category
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                    Prepare visitor reminders, behavior guides,
                                    and safety messaging for each protected
                                    area.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn-accent"
                            >
                                <FaPlusCircle size={18} />
                                Add Reminder
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Placeholder Preview
                                </h2>
                                <p className="cms-page-description">
                                    This layout is ready for CRUD wiring once
                                    the table and fields are finalized.
                                </p>
                            </div>

                            <input
                                type="text"
                                placeholder="Search reminders..."
                                className="input md:w-80"
                            />
                        </div>

                        <div className="table-shell table-scroll">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            Area
                                        </th>
                                        <th>
                                            Type
                                        </th>
                                        <th>
                                            Title
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            
                                        >
                                            <td>
                                                {item.area}
                                            </td>
                                            <td>
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        item.type === "Do"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">
                                                {item.title}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-left text-gray-600">
                                                {item.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5 space-y-4 md:hidden">
                            {sampleItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-lg border border-gray-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.type === "Do"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-rose-100 text-rose-700"
                                            }`}
                                        >
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {item.area}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            Suggested fields:
                            `area_id`, `type`, `title`, `description`,
                            `sort_order`, `status`
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DosAndDontsCategory;

DosAndDontsCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
