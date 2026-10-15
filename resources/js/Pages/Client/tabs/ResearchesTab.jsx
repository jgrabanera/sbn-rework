import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import axios from "axios";
import PdfCard from "@/Components/PdfCard";
import PDFViewer from "@/Components/PDFViewer";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const ResearchesTab = ({ id }) => {
    const [Researches, setResearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(600);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Fetch data
    const loadContentResearches = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-researches-section`);
            setResearches(res.data);
        } catch (requestError) {
            setErrors(requestError?.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContentResearches();
    }, []);

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

    const filteredResearches = Researches?.filter(
        (r) => String(r.area_id) === String(id),
    );

    useEffect(() => {
        setIsOpen(false);
        setSelectedPdf(null);
    }, [id]);

    return (
        <div className="bg-white/70 p-4 sm:p-5 rounded-lg w-full md:min-h-[68vh] h-full">
            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {filteredResearches?.length > 0 ? (
                    filteredResearches.map((research) => (
                        <PdfCard
                            key={research.id}
                            research={research}
                            onClick={() => {
                                setSelectedPdf(research);
                                setIsOpen(true);
                            }}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No researches available
                    </p>
                )}
            </div>

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
                            <Document
                                file={selectedPdf.pdf_url}
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
                                    onClick={() => setPageNumber((p) => p - 1)}
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
