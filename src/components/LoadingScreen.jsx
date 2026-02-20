import { useEffect } from "react";
import "../styles/LoadingScreen.css";

export default function LoadingScreen({ message = "로딩중...", fading = false }) {
    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
        };
    }, []);

    return (
        <div className={`loading-screen${fading ? " is-fading" : ""}`}>
            <div className="loading-screen-status" role="status" aria-live="polite" aria-busy="true">
                <div className="loading-screen-brand">Knowledge Garden</div>
                <div className="loading-screen-spinner" aria-hidden="true" />
                <p className="loading-screen-message">{message}</p>
                <p className="loading-screen-subtext">지식을 연결하는 중입니다</p>
            </div>
        </div>
    );
}
