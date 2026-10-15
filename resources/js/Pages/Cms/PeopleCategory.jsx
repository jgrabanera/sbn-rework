import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ClampText } from "@/Components/Cms";
import CategoryRecordsPage from "@/Components/CategoryRecordsPage";

const PeopleCategory = () => (
    <CategoryRecordsPage
        title="People Category"
        description="Browse people content records linked to each protected area."
        endpoint="/loadPeopleItems"
        editConfig={{
            modalTitle: "Edit People Content",
            updateEndpoint: (id) => `/updatePeopleItem/${id}`,
            fields: [
                {
                    name: "area_id",
                    label: "Area",
                    type: "select",
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
                {
                    name: "article3",
                    label: "Article 3",
                    type: "ckeditor",
                },
            ],
        }}
        searchPlaceholder="Search by area or article..."
        emptyLabel="people record"
        columns={[
            {
                header: "Area Name",
                render: (record) => record.areaName ?? "-",
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
            {
                header: "Article 3",
                cellClassName: "text-start max-w-xl",
                render: (record) => <ClampText value={record.article3} />,
            },
        ]}
        mobileFields={[
            {
                label: "Area",
                render: (record) => record.areaName ?? "-",
            },
            {
                label: "Article 1",
                render: (record) => <ClampText value={record.article1} />,
            },
            {
                label: "Article 2",
                render: (record) => <ClampText value={record.article2} />,
            },
            {
                label: "Article 3",
                render: (record) => <ClampText value={record.article3} />,
            },
        ]}
    />
);

export default PeopleCategory;
PeopleCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
