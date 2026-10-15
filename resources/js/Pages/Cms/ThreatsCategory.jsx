import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryRecordsPage from "@/Components/CategoryRecordsPage";

const previewText = (value, limit = 140) => {
    const text = String(value ?? "").trim();

    if (!text) {
        return "-";
    }

    return `${text.slice(0, limit)}${text.length > limit ? "..." : ""}`;
};

const ThreatsCategory = () => (
    <CategoryRecordsPage
        title="Threats Category"
        description="Browse recorded threats for each protected area."
        endpoint="/loadThreatItems"
        editConfig={{
            modalTitle: "Edit Threat Content",
            updateEndpoint: (id) => `/updateThreatItem/${id}`,
            fields: [
                {
                    name: "area_id",
                    label: "Area",
                    type: "select",
                    fullWidth: false,
                },
                {
                    name: "threat1",
                    label: "Threat 1",
                    type: "ckeditor",
                },
                {
                    name: "threat2",
                    label: "Threat 2",
                    type: "ckeditor",
                },
                {
                    name: "threat3",
                    label: "Threat 3",
                    type: "ckeditor",
                },
            ],
        }}
        searchPlaceholder="Search by area or threat text..."
        emptyLabel="threat record"
        columns={[
            {
                header: "Area Name",
                render: (record) => record.areaName ?? "-",
            },
            {
                header: "Threat 1",
                cellClassName: "text-start max-w-xl",
                render: (record) => previewText(record.threat1),
            },
            {
                header: "Threat 2",
                cellClassName: "text-start max-w-xl",
                render: (record) => previewText(record.threat2),
            },
            {
                header: "Threat 3",
                cellClassName: "text-start max-w-xl",
                render: (record) => previewText(record.threat3),
            },
        ]}
        mobileFields={[
            {
                label: "Area",
                render: (record) => record.areaName ?? "-",
            },
            {
                label: "Threat 1",
                render: (record) => previewText(record.threat1, 120),
            },
            {
                label: "Threat 2",
                render: (record) => previewText(record.threat2, 120),
            },
            {
                label: "Threat 3",
                render: (record) => previewText(record.threat3, 120),
            },
        ]}
    />
);

export default ThreatsCategory;
ThreatsCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
