import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ClampText } from "@/Components/Cms";
import CategoryRecordsPage from "@/Components/CategoryRecordsPage";

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

const ManagementCategory = () => (
    <CategoryRecordsPage
        title="Management Category"
        description="Browse management records saved for each protected area."
        endpoint="/loadManagementItems"
        editConfig={{
            modalTitle: "Edit Management Content",
            updateEndpoint: (id) => `/updateManagementItem/${id}`,
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
        emptyLabel="management record"
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
                render: (record) => <ClampText value={record.article1} />,
            },
            {
                header: "Article 2",
                cellClassName: "text-start max-w-xl",
                render: (record) => <ClampText value={record.article2} />,
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
                render: (record) => <ClampText value={record.article1} />,
            },
            {
                label: "Article 2",
                render: (record) => <ClampText value={record.article2} />,
            },
        ]}
    />
);

export default ManagementCategory;
ManagementCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
