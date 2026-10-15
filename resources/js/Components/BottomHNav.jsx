import backIcon from "../../assets/images/back.png";
import homeIcon from "../../assets/images/home.png";
import quizIcon from "../../assets/images/quiz.png";
import feedbackIcon from "../../assets/images/positive.png";
import partnerIcon from "../../assets/images/partner.png";
import callIcon from "../../assets/images/call.png";
import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import ReviewModal from "@/Components/ReviewModal";
import ReviewSuccessToast from "@/Components/ReviewSuccessToast";
import PartnersModal from "@/Components/PartnersModal";
import ContactModal from "@/Components/ContactModal";

// import { Link } from "react-router-dom";

const BottomHNav = ({ id = null }) => {
    const [reviewOpen, setReviewOpen] = useState(false);
    const [partnersOpen, setPartnersOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const successTimer = useRef(null);

    useEffect(() => {
        return () => window.clearTimeout(successTimer.current);
    }, []);

    const showSuccessNotification = () => {
        window.clearTimeout(successTimer.current);
        setSuccessOpen(true);
        successTimer.current = window.setTimeout(() => {
            setSuccessOpen(false);
        }, 2500);
    };

    return (
        <>
            <ReviewSuccessToast show={successOpen} />

            <div className="md:max-w-2xl w-full bg-white p-4 rounded-lg  flex flex-row justify-evenly items-center gap-2 shadow-lg">
                <Link href={`/`}>
                    <img
                        src={backIcon}
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-110"
                    />
                </Link>
                <Link href="/">
                    {" "}
                    <img
                        src={homeIcon}
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-110"
                    />
                </Link>
                <Link href="/quiz">
                    {" "}
                    <img
                        src={quizIcon}
                        alt="Quiz Icon"
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-110"
                    />
                </Link>
                <button type="button" onClick={() => setReviewOpen(true)}>
                    <img
                        src={feedbackIcon}
                        alt="Review Icon"
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-110"
                    />
                </button>
                <button type="button" onClick={() => setPartnersOpen(true)}>
                    <img
                        src={partnerIcon}
                        alt="Partners Icon"
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-110"
                    />
                </button>
                <button type="button" onClick={() => setContactOpen(true)}>
                    <img
                        src={callIcon}
                        alt="Contact Icon"
                        className="md:w-10 w-7 transition-transform duration-300 hover:scale-125"
                    />
                </button>
            </div>

            <ReviewModal
                isOpen={reviewOpen}
                onClose={() => setReviewOpen(false)}
                onSuccess={showSuccessNotification}
                areaId={id}
            />
            <PartnersModal
                isOpen={partnersOpen}
                onClose={() => setPartnersOpen(false)}
            />
            <ContactModal
                isOpen={contactOpen}
                onClose={() => setContactOpen(false)}
            />
        </>
    );
};

export default BottomHNav;
