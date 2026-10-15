import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryRecordsPage from "@/Components/CategoryRecordsPage";
import PdfModal from "@/Components/PdfModal";
import { FaFilePdf } from "react-icons/fa";
import { resolveStoredUrl } from "@/Utils/storage";

const resolvePdfUrl = (value) => resolveStoredUrl(value, "pdf");

const ResearchesCategory = () => {
    const [preview, setPreview] = useState(null);

    // Clicking the button previews the file in a modal rather than leaving
    // the page. The filename is kept in the button's tooltip.
    const renderPreviewButton = (value) =>
        value ? (
            <button
                type="button"
                onClick={() => setPreview(value)}
                className="btn-secondary h-9"
                title={String(value).split("/").pop()}
            >
                <FaFilePdf />
                Preview PDF
            </button>
        ) : (
            <span className="text-slate-400">No file</span>
        );

    return (
        <>
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
                        render: (record) => renderPreviewButton(record.pdf_url),
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
                        render: (record) => renderPreviewButton(record.pdf_url),
                    },
                ]}
            />

            <PdfModal
                open={Boolean(preview)}
                title={preview ? String(preview).split("/").pop() : ""}
                url={resolvePdfUrl(preview)}
                onClose={() => setPreview(null)}
            />
        </>
    );
};

export default ResearchesCategory;
ResearchesCategory.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user} children={page} />
);