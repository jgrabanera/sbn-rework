import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import Lottie from "lottie-react";

const ResultPage = ({ score, totalQuestions, answers = [] }) => {
    const [congratsAnimation, setCongratsAnimation] = useState(null);
    const [redirectIn, setRedirectIn] = useState(30);
    const percentage = totalQuestions
        ? Math.round((score / totalQuestions) * 100)
        : 0;

    useEffect(() => {
        let isMounted = true;

        fetch("/assets/lottie/congrats.json")
            .then((response) => response.json())
            .then((data) => {
                if (isMounted) {
                    setCongratsAnimation(data);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setCongratsAnimation(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setRedirectIn((current) => {
                if (current <= 1) {
                    window.clearInterval(timerId);
                    router.visit("/quiz");
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, []);

    return (
        <>
            <Head title="Quiz Result" />
            <div className="relative h-screen overflow-hidden bg-[#2f97df]">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,#48b15a_0%,#43ae8f_36%,#3daac3_66%,#2f97df_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

                <div className="relative z-10 mx-auto flex h-screen w-full max-w-[96rem] items-center px-3 py-3 sm:px-5 sm:py-4 lg:px-7">
                    <div className="grid h-full w-full grid-cols-1 gap-4 rounded-[2rem] bg-white/94 p-4   lg:grid-cols-[minmax(21rem,0.95fr)_minmax(30rem,1.25fr)] lg:gap-5 lg:p-6">
                        <div className="flex min-h-0 flex-col rounded-[1.7rem] bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-5 py-5 lg:px-6 lg:py-6">
                            <div className="flex flex-1 flex-col items-center justify-center text-center">
                                {congratsAnimation ? (
                                    <div className="w-36 sm:w-44 md:w-64">
                                        <Lottie
                                            animationData={congratsAnimation}
                                            loop
                                            autoplay
                                        />
                                    </div>
                                ) : null}

                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">
                                    Quiz Complete
                                </p>
                                <h1 className="mt-3 text-3xl font-black text-slate-800 sm:text-4xl">
                                    {score} / {totalQuestions}
                                </h1>
                                <p className="mt-2 text-lg font-semibold text-slate-700 sm:text-xl">
                                    {percentage}% correct
                                </p>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                                    Review your answers only if you want the
                                    details. The main result stays clean for
                                    landscape viewing.
                                </p>
                                <p className="mt-3 text-sm font-semibold text-amber-600 sm:text-base">
                                    Returning to Quiz Home in {redirectIn}s
                                </p>

                                <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
                                    <div className="rounded-[1.15rem] bg-white px-3 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Score
                                        </p>
                                        <p className="mt-1 text-2xl font-black text-slate-800">
                                            {score}
                                        </p>
                                    </div>
                                    <div className="rounded-[1.15rem] bg-white px-3 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Total
                                        </p>
                                        <p className="mt-1 text-2xl font-black text-slate-800">
                                            {totalQuestions}
                                        </p>
                                    </div>
                                    <div className="rounded-[1.15rem] bg-white px-3 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Rate
                                        </p>
                                        <p className="mt-1 text-2xl font-black text-slate-800">
                                            {percentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-center lg:mt-6">
                                <button
                                    type="button"
                                    onClick={() => router.visit("/quiz/start")}
                                    className="rounded-full bg-gradient-to-b from-sky-400 to-sky-500 px-8 py-3 text-base font-bold tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(14,165,233,0.35)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-300 hover:to-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200/40"
                                >
                                    PLAY AGAIN
                                </button>
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-col rounded-[1.7rem] bg-slate-50/80 p-3 sm:p-4">
                            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                                {answers.map((answer) => (
                                    <details
                                        key={answer.question_number}
                                        className={`group rounded-[1.35rem] border bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${
                                            answer.is_correct
                                                ? "border-emerald-200"
                                                : "border-rose-200"
                                        }`}
                                    >
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                                    Question{" "}
                                                    {answer.question_number}
                                                </p>
                                                <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                                                    {answer.question}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                                                        answer.is_correct
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    {answer.is_correct
                                                        ? "Correct"
                                                        : "Wrong"}
                                                </span>
                                                <span className="text-lg font-black text-slate-400 transition group-open:rotate-180">
                                                    ˅
                                                </span>
                                            </div>
                                        </summary>

                                        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                                            <p className="text-sm leading-relaxed text-slate-700">
                                                {answer.question}
                                            </p>
                                            <p className="mt-3 text-sm text-slate-600">
                                                Your answer:{" "}
                                                <span className="font-semibold text-slate-800">
                                                    {answer.selected_answer ||
                                                        "No answer"}
                                                </span>
                                            </p>
                                            {!answer.is_correct ? (
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Correct answer:{" "}
                                                    <span className="font-semibold text-slate-800">
                                                        {answer.correct_answer}
                                                    </span>
                                                </p>
                                            ) : null}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultPage;
