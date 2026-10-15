import Lottie from "lottie-react";
import File from "../../assets/lottiefiles/Files.json";
import { useRef, useState } from "react";

const PdfCard = ({ research, onClick }) => {
    const lottieRef = useRef(null);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => lottieRef.current?.play()}
            onMouseLeave={() => lottieRef.current?.stop()}
            className="relative w-full h-44 hover:scale-105 transition flex flex-col items-center justify-center rounded-xl p-2"
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={File}
                loop
                autoplay={false}
                style={{ width: 120 }}
            />

            <p className="absolute -bottom-5 text-md text-center line-clamp-3 max-w-60">
                {research.pdf_title}
            </p>
        </div>
    );
};

export default PdfCard;
