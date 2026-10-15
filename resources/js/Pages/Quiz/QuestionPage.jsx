import React, { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { HiOutlineXMark } from "react-icons/hi2";
import Lottie from "lottie-react";

const QuestionPage = ({
    quizNum,
    question,
    totalQuestions,
    selectedAnswer: initialSelectedAnswer,
    answeredQuestions = [],
    answerStates = {},
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState(
        initialSelectedAnswer ?? null,
    );
    const [correctAnimation, setCorrectAnimation] = useState(null);
    const [wrongAnimation, setWrongAnimation] = useState(null);
    const [timeoutAnimation, setTimeoutAnimation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);
    const [feedbackState, setFeedbackState] = useState(null);
    const [isNarrating, setIsNarrating] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const speechUtteranceRef = useRef(null);
    const progressItems = Array.from(
        { length: totalQuestions || 0 },
        (_, index) => index + 1,
    );

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            fetch("/assets/lottie/correct.json").then((response) =>
                response.json(),
            ),
            fetch("/assets/lottie/monkey_wrong.json").then((response) =>
                response.json(),
            ),
            fetch("/assets/lottie/times_up.json").then((response) =>
                response.json(),
            ),
        ])
            .then(([correctData, wrongData, timeoutData]) => {
                if (isMounted) {
                    setCorrectAnimation(correctData);
                    setWrongAnimation(wrongData);
                    setTimeoutAnimation(timeoutData);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setCorrectAnimation(null);
                    setWrongAnimation(null);
                    setTimeoutAnimation(null);
                }
            });

        return () => {
            isMounted = false;
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        setSelectedAnswer(initialSelectedAnswer ?? null);
        setTimeLeft(20);
        setFeedbackState(null);
        setIsTimerActive(false);
        setIsNarrating(false);
    }, [quizNum, initialSelectedAnswer]);

    useEffect(() => {
        if (!question?.question) {
            setIsTimerActive(true);
            setIsNarrating(false);
            return undefined;
        }

        if (!window.speechSynthesis) {
            setIsTimerActive(true);
            setIsNarrating(false);
            return undefined;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(question.question);
        speechUtteranceRef.current = utterance;
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        const availableVoices = window.speechSynthesis.getVoices();
        const preferredVoice =
            availableVoices.find((voice) =>
                /en(-|_| )?(PH|US|GB)/i.test(voice.lang),
            ) ||
            availableVoices.find((voice) => /english/i.test(voice.name)) ||
            availableVoices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            setIsNarrating(true);
            setIsTimerActive(false);
        };

        utterance.onend = () => {
            setIsNarrating(false);
            setIsTimerActive(true);
        };

        utterance.onerror = () => {
            setIsNarrating(false);
            setIsTimerActive(true);
        };

        setIsNarrating(true);
        setIsTimerActive(false);
        window.speechSynthesis.speak(utterance);

        return () => {
            utterance.onstart = null;
            utterance.onend = null;
            utterance.onerror = null;
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [quizNum, question?.question]);

    useEffect(() => {
        if (isSubmitting || feedbackState || !isTimerActive) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setTimeLeft((currentTime) => {
                if (currentTime <= 1) {
                    window.clearInterval(timerId);
                    setFeedbackState("timeout");
                    window.setTimeout(() => {
                        submitAnswer(null);
                    }, 1400);

                    return 0;
                }

                return currentTime - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [quizNum, isSubmitting, feedbackState, isTimerActive]);

    const handleClose = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        router.visit("/quiz");
    };

    const submitAnswer = (answer) => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsNarrating(false);
        setIsTimerActive(false);
        setIsSubmitting(true);
        router.post(
            `/quiz/${quizNum}/answer`,
            {
                selected_answer: answer,
            },
            {
                preserveScroll: true,
                onError: () => {
                    setIsSubmitting(false);
                    setFeedbackState(null);
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const playFeedbackAndSubmit = (answer) => {
        if (isSubmitting || feedbackState) {
            return;
        }

        const isCorrect = answer !== null && answer === question?.answer_key;
        setFeedbackState(isCorrect ? "correct" : "wrong");

        window.setTimeout(() => {
            submitAnswer(answer);
        }, 1400);
    };

    const handleSelectAnswer = (answerKey) => {
        if (isSubmitting || feedbackState) {
            return;
        }

        setSelectedAnswer(answerKey);
        playFeedbackAndSubmit(answerKey);
    };

    return (
        <>
            <Head title="Question" />

            <div className="relative h-screen overflow-hidden bg-[#2f97df]">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,#48b15a_0%,#43ae8f_36%,#3daac3_66%,#2f97df_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

                {feedbackState ? (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/22">
                        <div className="flex w-[18.5rem] max-w-[84vw] flex-col items-center rounded-[2rem] bg-white border-4 border-x-amber-400 border-y-amber-700 bg-white/96 px-6 py-7 shadow-[0_28px_70px_rgba(15,23,42,0.24)] sm:w-[23rem] sm:px-8">
                            <div className="w-full max-w-[12rem] sm:max-w-[14rem]">
                                <Lottie
                                    animationData={
                                        feedbackState === "correct"
                                            ? correctAnimation
                                            : feedbackState === "timeout"
                                              ? timeoutAnimation
                                              : wrongAnimation
                                    }
                                    loop={false}
                                    autoplay
                                />
                            </div>

                            <p
                                className={`mt-1 text-center text-2xl font-black uppercase tracking-[0.14em] ${
                                    feedbackState === "correct"
                                        ? "text-emerald-600"
                                        : "text-rose-600"
                                }`}
                            >
                                {feedbackState === "correct"
                                    ? "Correct"
                                    : feedbackState === "timeout"
                                      ? "Time's Up"
                                      : "Wrong"}
                            </p>

                            {feedbackState === "wrong" ? (
                                <p className="mt-4 text-center text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                                    Correct answer:
                                    <span className="mt-1 block text-base font-bold text-slate-800 sm:text-lg">
                                        {question?.answer}
                                    </span>
                                </p>
                            ) : feedbackState === "timeout" ? (
                                <p className="mt-4 text-center text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                                    No answer was submitted before the timer
                                    ended.
                                    <span className="mt-1 block text-base font-bold text-slate-800 sm:text-lg">
                                        Correct answer: {question?.answer}
                                    </span>
                                </p>
                            ) : (
                                <p className="mt-4 text-center text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                                    Great job. Moving to the next question.
                                </p>
                            )}
                        </div>
                    </div>
                ) : null}

                <div className="relative z-10 h-screen overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
                    <div className="mx-auto flex h-full w-full max-w-[92rem] flex-col">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.15)] backdrop-blur transition  hover:bg-white/75 focus:outline-none focus:ring-4 focus:ring-white/30 sm:h-11 sm:w-11"
                                aria-label="Close quiz"
                            >
                                <HiOutlineXMark className="h-6 w-6 sm:h-7 sm:w-7" />
                            </button>
                        </div>

                        <div className="mx-auto mt-1 flex w-full max-w-[84rem] flex-1 flex-col items-center overflow-visible pt-6 sm:pt-7">
                            <div className="relative w-full rounded-[1.75rem] border-4 border-amber-400 bg-gradient-to-b from-[#fff8c9] to-[#fff5b0] px-4 pb-4 pt-12 shadow-[0_24px_60px_rgba(0,0,0,0.14)] sm:px-6 sm:pb-5 sm:pt-14 lg:px-10">
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 bg-fuchsia-700 text-xl font-black text-white shadow-[0_10px_25px_rgba(192,38,211,0.35)] sm:h-20 sm:w-20 sm:text-2xl">
                                        {timeLeft}
                                    </div>
                                </div>

                                {isNarrating ? (
                                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-sky-700 sm:text-sm">
                                        Reading question...
                                    </p>
                                ) : null}

                                {question?.question_image ? (
                                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center lg:gap-8">
                                        <div className="flex h-full items-center lg:pr-2">
                                            <p className="w-full text-center text-base font-medium leading-relaxed text-slate-700 sm:text-[1.2rem] lg:text-left lg:text-[1.45rem] lg:leading-[1.6]">
                                                {question?.question}
                                            </p>
                                        </div>

                                        <div className="flex justify-center lg:justify-end">
                                            <img
                                                src={question.question_image}
                                                alt="Question visual"
                                                className="max-h-[10.5rem] w-full max-w-2xl rounded-[1.2rem] border-2 border-white/70 bg-white object-contain shadow-[0_14px_32px_rgba(15,23,42,0.16)] sm:max-h-[12rem] lg:max-h-[15rem] lg:max-w-[28rem]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-base font-medium leading-relaxed text-slate-700 sm:text-[1.2rem] lg:text-[1.45rem]">
                                        {question?.question}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex w-full max-w-[84rem] flex-wrap items-center justify-center gap-2 sm:gap-3">
                                {progressItems.map((item) => {
                                    const isCurrent = item === quizNum;
                                    const isAnswered =
                                        answeredQuestions.includes(item);
                                    const answerState = answerStates[item];

                                    return (
                                        <span
                                            key={item}
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 text-xs font-bold transition sm:h-10 sm:w-10 sm:text-sm ${
                                                isCurrent
                                                    ? "border-slate-900 bg-white/85 text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.15)]"
                                                    : isAnswered &&
                                                        answerState ===
                                                            "correct"
                                                      ? "border-emerald-700 bg-emerald-100/95 text-emerald-800"
                                                      : isAnswered
                                                        ? "border-rose-700 bg-rose-100/95 text-rose-800"
                                                        : "border-slate-900/90 bg-transparent text-transparent"
                                            }`}
                                        >
                                            {isCurrent || isAnswered
                                                ? item
                                                : "."}
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="mt-5 grid w-full max-w-[84rem] flex-1 grid-cols-2 gap-3 overflow-hidden sm:mt-6 sm:gap-4 lg:gap-5">
                                {question?.choices?.map((choice, index) => {
                                    const isSelected =
                                        selectedAnswer === choice.key;
                                    const optionLabel = String.fromCharCode(
                                        65 + index,
                                    );

                                    return (
                                        <button
                                            key={choice.key}
                                            type="button"
                                            onClick={() =>
                                                handleSelectAnswer(choice.key)
                                            }
                                            disabled={
                                                isSubmitting || !!feedbackState
                                            }
                                            className={`group relative flex min-h-[5rem] items-center overflow-visible rounded-[1.1rem] border-[3px] border-slate-800 bg-white pl-14 pr-5 text-left text-base font-semibold text-slate-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-white/35 sm:min-h-[5.3rem] sm:pl-16 sm:pr-6 sm:text-[1.05rem] lg:min-h-[5.6rem] lg:pl-[4.6rem] lg:pr-7 lg:text-[1.18rem] ${
                                                isSelected
                                                    ? "bg-[#fff8da] ring-2 ring-amber-200/70"
                                                    : "bg-white"
                                            } ${
                                                isSubmitting || feedbackState
                                                    ? "cursor-not-allowed opacity-75"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            <span
                                                className={`absolute left-[-3px] top-1/2 flex h-[calc(100%+6px)] w-[3.6rem] -translate-y-1/2 items-center justify-center rounded-[1.05rem] border-[3px] border-slate-800 text-lg font-black uppercase tracking-[0.02em] sm:w-[3.9rem] lg:w-[4.2rem] ${
                                                    isSelected
                                                        ? "bg-amber-300 text-slate-900"
                                                        : "bg-amber-400 text-slate-900"
                                                }`}
                                            >
                                                {optionLabel}
                                            </span>

                                            <span className="flex min-w-0 flex-1 items-center py-3">
                                                {choice.image ? (
                                                    <img
                                                        src={choice.image}
                                                        alt={
                                                            choice.text ||
                                                            "Choice"
                                                        }
                                                        className="mr-3 max-h-16 w-20 shrink-0 rounded-lg border border-slate-200 bg-white object-contain sm:max-h-20 sm:w-24"
                                                    />
                                                ) : null}
                                                <span className="block leading-snug text-slate-800">
                                                    {choice.text}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionPage;
