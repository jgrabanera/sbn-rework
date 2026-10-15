import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundImage from "../../assets/images/animated-apo-island.jpg";
import IdleImage from "../../assets/images/idle-image.png";

const activityEvents = [
    "pointerdown",
    "pointermove",
    "keydown",
    "wheel",
    "touchstart",
];

const wakeEvents = new Set(["click", "pointerdown", "touchstart", "keydown"]);

let hasStartedSession = false;

const IdleAttractScreen = ({ timeoutMs = 900000, showInitially = true }) => {
    const [visible, setVisible] = useState(showInitially && !hasStartedSession);
    const visibleRef = useRef(visible);
    const timerRef = useRef(null);

    useEffect(() => {
        visibleRef.current = visible;
    }, [visible]);

    const startTimer = useCallback(() => {
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setVisible(true);
        }, timeoutMs);
    }, [timeoutMs]);

    const handleActivity = useCallback(
        (event) => {
            if (visibleRef.current) {
                if (!wakeEvents.has(event.type)) return;

                hasStartedSession = true;
                setVisible(false);
            }

            startTimer();
        },
        [startTimer],
    );

    useEffect(() => {
        startTimer();

        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity, {
                passive: true,
            });
        });

        return () => {
            window.clearTimeout(timerRef.current);

            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });
        };
    }, [handleActivity, startTimer]);

    if (!visible) return null;

    return (
        <button
            type="button"
            aria-label="Start STARBOOKS Nature"
            onClick={handleActivity}
            style={{ backgroundImage: `url(${BackgroundImage})` }}
            className="fixed inset-0 z-[80] flex h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/85 via-teal-300/75 to-lime-300/85" />

            <div
                className="relative flex items-center justify-center    "
                style={{ width: "clamp(20rem, 43vw, 34rem)" }}
            >
                <img
                    src={IdleImage}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full scale-125 object-cover"
                />
            </div>
        </button>
    );
};

export default IdleAttractScreen;
