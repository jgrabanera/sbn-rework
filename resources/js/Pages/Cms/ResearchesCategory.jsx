import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryRecordsPage from "@/Components/CategoryRecordsPage";

const resolvePdfUrl = (value) => {
    const path = String(value ?? "").trim();

    if (!path) {
        return "";
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/storage/")) {
        return path;
    }

    return `/storage/pdf/${path}`;
};

const renderPdfLink = (value) =>
    value ? (
        <a
            href={resolvePdfUrl(value)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
        >
            {String(value).split("/").pop()}
        </a>
    ) : (
        "-"
    );

const ResearchesCategory = () => (
    <CategoryRecordsPage
        title="Researches Category"
        description="Browse research files and titles linked to each protected area."
        endpoint="/loadResearchItems"
        createConfig={{
            buttonLabel: "Add Research",
            modalTitle: "New Research Content",
            submitLabel: "Save",
            storeEndpoint: "/storeResearchItem",
            fields: [
                {
                    name: "area_id",
                    label: "Area",
                    type: "select",
                    fullWidth: false,
                },
                {
                    name: "pdf_title",
                    label: "PDF Title",
                    type: "text",
                },
                {
                    name: "pdf",
                    label: "PDF File",
                    type: "file",
                    accept: ".pdf,application/pdf",
                    fullWidth: false,
                },
            ],
        }}
        editConfig={{
            modalTitle: "Edit Research Content",
            updateEndpoint: (id) => `/updateResearchItem/${id}`,
            fields: [
                {
                    name: "area_id",
                    label: "Area",
                    type: "select",
                    fullWidth: false,
                },
                {
                    name: "pdf_title",
                    label: "PDF Title",
                    type: "text",
                },
                {
                    name: "pdf",
                    label: "PDF File",
                    type: "file",
                    accept: ".pdf,application/pdf",
                    fullWidth: false,
                },
            ],
        }}
        deleteConfig={{
            deleteEndpoint: (id) => `/deleteResearchItem/${id}`,
            confirmMessage: (record) =>
                `Delete "${record.pdf_title?.trim() || "this research"}" from ${record.areaName ?? "the selected area"}?`,
        }}
        searchPlaceholder="Search by area, PDF title, or file..."
        emptyLabel="research record"
        columns={[
            {
                header: "Area Name",
                render: (record) => record.areaName ?? "-",
            },
            {
                header: "PDF Title",
                cellClassName: "text-start max-w-xl",
                render: (record) => record.pdf_title?.trim() || "-",
            },
            {
                header: "PDF File",
                cellClassName: "break-all",
                render: (record) => renderPdfLink(record.pdf_url),
            },
        ]}
        mobileFields={[
            {
                label: "Area",
                render: (record) => record.areaName ?? "-",
            },
            {
                label: "PDF Title",
                render: (record) => record.pdf_title?.trim() || "-",
            },
            {
                label: "PDF File",
                render: (record) => renderPdfLink(record.pdf_url),
            },
        ]}
    />
);

export default ResearchesCategory;
ResearchesCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);
