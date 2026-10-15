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

const renderImage = (value, alt) =>
    value ? (
        <img
            src={`/storage/images/${value}`}
            alt={alt}
            className="h-12 w-12 object-cover rounded mx-auto"
        />
    ) : (
        "No Image"
    );

const ConservationCategory = () => (
    <CategoryRecordsPage
        title="Conservation Category"
        description="Browse conservation content saved for each protected area."
        endpoint="/loadConservationItems"
        editConfig={{
            modalTitle: "Edit Conservation Content",
            updateEndpoint: (id) => `/updateConservationItem/${id}`,
            fields: [
                {
                    name: "area_id",
                    label: "Area",
                    type: "select",
                    fullWidth: false,
                },
                {
                    name: "image",
                    label: "Image",
                    type: "file",
                    previewImage: true,
                    previewKey: "image_url",
                    fullWidth: false,
                },
                {
                    name: "article1",
                    label: "Article 1",
                    type: "ckeditor",
                },
                {
                    name: "article2",
                    label: "Article 2",
                    type: "ckeditor",
                },
            ],
        }}
        searchPlaceholder="Search by area, article, or image..."
        emptyLabel="conservation record"
        columns={[
            {
                header: "Area Name",
                render: (record) => record.areaName ?? "-",
            },
            {
                header: "Image",
                render: (record) =>
                    renderImage(record.image_url, record.areaName),
            },
            {
                header: "Article 1",
                cellClassName: "text-start max-w-xl",
                render: (record) => previewText(record.article1),
            },
            {
                header: "Article 2",
                cellClassName: "text-start max-w-xl",
                render: (record) => previewText(record.article2),
            },
        ]}
        mobileFields={[
            {
                label: "Area",
                render: (record) => record.areaName ?? "-",
            },
            {
                label: "Image",
                render: (record) =>
                    renderImage(record.image_url, record.areaName),
            },
            {
                label: "Article 1",
                render: (record) => previewText(record.article1, 120),
            },
            {
                label: "Article 2",
                render: (record) => previewText(record.article2, 120),
            },
        ]}
    />
);

export default ConservationCategory;
ConservationCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
