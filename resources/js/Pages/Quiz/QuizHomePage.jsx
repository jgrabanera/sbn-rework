import React from "react";
import { Head, router } from "@inertiajs/react";

const accentShapes = [
    {
        className:
            "left-[18%] top-[24%] h-4 w-4 rotate-30 border-[3px] border-pink-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "13s",
            animationDelay: "-2s",
            "--particle-x": "16px",
            "--particle-y": "-20px",
            "--particle-rotate": "70deg",
        },
    },
    {
        className:
            "left-[16%] bottom-[20%] h-5 w-5 rounded-full border-[4px] border-pink-400",
        style: {
            animationDuration: "11s",
            animationDelay: "-5s",
            "--particle-x": "-18px",
            "--particle-y": "-26px",
            "--particle-rotate": "-45deg",
        },
    },
    {
        className:
            "left-[41%] bottom-[21%] h-4 w-4 rotate-30 border-[3px] border-cyan-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "15s",
            animationDelay: "-7s",
            "--particle-x": "22px",
            "--particle-y": "-18px",
            "--particle-rotate": "90deg",
        },
    },
    {
        className:
            "top-[20%] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[4px] border-amber-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "12s",
            animationDelay: "-4s",
            "--particle-x": "10px",
            "--particle-y": "-24px",
            "--particle-rotate": "55deg",
        },
    },
    {
        className:
            "right-[17%] top-[20%] h-4 w-4 rotate-30 border-[3px] border-cyan-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "14s",
            animationDelay: "-1.5s",
            "--particle-x": "-20px",
            "--particle-y": "-22px",
            "--particle-rotate": "-85deg",
        },
    },
    {
        className:
            "right-[20%] top-[48%] h-4 w-4 rounded-full border-[4px] border-cyan-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "10s",
            animationDelay: "-6s",
            "--particle-x": "14px",
            "--particle-y": "-16px",
            "--particle-rotate": "40deg",
        },
    },
    {
        className:
            "right-[14%] bottom-[21%] h-4 w-4 rotate-30 border-[3px] border-amber-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "16s",
            animationDelay: "-8s",
            "--particle-x": "-24px",
            "--particle-y": "-18px",
            "--particle-rotate": "-70deg",
        },
    },
    {
        className:
            "right-[36%] bottom-[31%] h-4 w-4 rounded-full border-[4px] border-pink-400 sm:h-5 sm:w-5",
        style: {
            animationDuration: "12.5s",
            animationDelay: "-3.5s",
            "--particle-x": "18px",
            "--particle-y": "-28px",
            "--particle-rotate": "65deg",
        },
    },
];

const QuizHomePage = () => {
    const handleStartQuiz = () => {
        router.visit("/quiz/start");
    };

    const handleBackToStarbooksNature = () => {
        router.visit("/");
    };

    return (
        <>
            <Head title="Quiz" />
            <div className="relative min-h-screen overflow-hidden bg-[#0b4c84]">
                <style>{`
                @keyframes quizParticleFloat {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
                        opacity: 0.72;
                    }
                    25% {
                        transform: translate3d(calc(var(--particle-x, 14px) * 0.45), calc(var(--particle-y, -18px) * 0.4), 0) scale(1.08) rotate(calc(var(--particle-rotate, 45deg) * 0.35));
                        opacity: 1;
                    }
                    50% {
                        transform: translate3d(var(--particle-x, 14px), var(--particle-y, -18px), 0) scale(0.96) rotate(var(--particle-rotate, 45deg));
                        opacity: 0.9;
                    }
                    75% {
                        transform: translate3d(calc(var(--particle-x, 14px) * -0.35), calc(var(--particle-y, -18px) * 0.55), 0) scale(1.04) rotate(calc(var(--particle-rotate, 45deg) * -0.3));
                        opacity: 0.82;
                    }
                }
            `}</style>

                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/assets/images/quiz-wallpaper.png')",
                    }}
                />
                <div className="absolute inset-0 bg-[#0b4c84]/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,173,255,0.18),transparent_34%),radial-gradient(circle_at_bottom,rgba(4,28,54,0.2),transparent_38%)]" />

                <div className="absolute inset-0">
                    {accentShapes.map(({ className, style }, index) => (
                        <span
                            key={index}
                            className={`absolute block will-change-transform motion-safe:animate-[quizParticleFloat_ease-in-out_infinite] ${className}`}
                            style={style}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
                    <div className="flex w-full max-w-4xl flex-col items-center">
                        <div className="w-full max-w-[19rem] rounded-[2rem] bg-white px-6 py-2 shadow-[0_22px_60px_rgba(4,16,34,0.28)] backdrop-blur sm:max-w-[28rem] sm:px-10 sm:py-7 lg:max-w-[34rem]">
                            <img
                                src="/assets/images/starbooks-logo.png"
                                alt="Starbooks"
                                className="mx-auto h-auto w-full max-w-[12rem] object-contain sm:max-w-[18rem] lg:max-w-[22rem]"
                            />
                        </div>

                        <div className="mt-8 flex w-full max-w-[17rem] flex-col gap-3 sm:mt-10 sm:max-w-[19rem]">
                            <button
                                type="button"
                                onClick={handleStartQuiz}
                                className="rounded-full bg-gradient-to-b from-sky-400 to-sky-500 px-6 py-3 text-base font-bold tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(14,165,233,0.35)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-300 hover:to-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200/40 sm:text-lg"
                            >
                                START QUIZ
                            </button>

                            <button
                                type="button"
                                onClick={handleBackToStarbooksNature}
                                className="rounded-full bg-gradient-to-b from-green-500 to-green-600 px-6 py-3 text-base font-bold tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(239,68,68,0.35)] transition duration-200 hover:-translate-y-0.5 hover:from-green-400 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-200/40 sm:text-lg"
                            >
                                STARBOOKS NATURE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizHomePage;
