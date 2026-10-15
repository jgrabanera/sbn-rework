import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { KioskEmpty, KioskError, KioskLoading } from "@/Components/KioskStates";
import PdfCard from "@/Components/PdfCard";
import PDFViewer from "@/Components/PDFViewer";
import useKioskSection from "@/Hooks/useKioskSection";
import { resolveStoredUrl } from "@/Utils/storage";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const ResearchesTab = ({ id }) => {
    const { data, loading, error, retry } = useKioskSection(
        `/get-researches-section?area=${id}`,
        { enabled: Boolean(id) },
    );

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(600);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Responsive PDF width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 640) setPageWidth(width * 0.9);
            else if (width < 1024) setPageWidth(width * 0.7);
            else setPageWidth(800);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedPdf(null);
    };

    useEffect(() => {
        setIsOpen(false);
        setSelectedPdf(null);
    }, [id]);

    return (
        <div className="bg-white/70 p-4 sm:p-5 rounded-lg w-full md:min-h-[68vh] h-full">
            {loading && <KioskLoading />}

            {!loading && error && <KioskError message={error} onRetry={retry} />}

            {!loading && !error && !data?.length && (
                <KioskEmpty message="No researches available" />
            )}

            {!loading && !error && data?.length > 0 && (
                /* GRID */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {data.map((research) => (
                        <PdfCard
                            key={research.id}
                            research={research}
                            onClick={() => {
                                setSelectedPdf(research);
                                setIsOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* MODAL */}
            <PDFViewer isOpen={isOpen} onClose={handleClose}>
                {selectedPdf && (
                    <div className="w-full mx-auto">
                        <div className="text-center h-full md:max-h-[75vh] overflow-y-auto sm:px-4">
                            {/* TITLE */}
                            <h2 className="text-base sm:text-lg md:text-2xl font-semibold mb-3">
                                {selectedPdf.pdf_title}
                            </h2>

                            {/* PDF */}
                            {/* Stored filenames contain spaces/commas, so the
                                path must be encoded before react-pdf fetches it. */}
                            <Document
                                file={resolveStoredUrl(selectedPdf.pdf_url)}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex justify-center"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    width={pageWidth}
                                />
                            </Document>

                            {/* CONTROLS */}
                            <div className="mt-4 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() =>
                                        setPageNumber((p) => Math.max(1, p - 1))
                                    }
                                    disabled={pageNumber <= 1}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="px-2 sm:px-4 py-2 text-sm sm:text-base font-semibold">
                                    Page {pageNumber} of {numPages}
                                </span>

                                <button
                                    onClick={() => setPageNumber((p) => p + 1)}
                                    disabled={pageNumber >= numPages}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PDFViewer>
        </div>
    );
};

export default ResearchesTab;