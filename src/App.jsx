import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/LoadingScreen";
import useAppBootstrap from "./hooks/useAppBootstrap";
import "./styles/LoadingScreen.css";

function AppGate() {
    const location = useLocation();
    const { ready, bootError } = useAppBootstrap({
        minDelayMs: 500,
        timeoutMs: 7000,
        enableHealthCheck: false,
    });
    const [showLoading, setShowLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (!ready) {
            setShowLoading(true);
            setIsFading(false);
            return;
        }

        setIsFading(true);
        const timerId = window.setTimeout(() => {
            setShowLoading(false);
        }, 200);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [ready]);

    if (showLoading) {
        return <LoadingScreen message="로딩중..." fading={isFading} />;
    }

    if (bootError?.type === "NETWORK") {
        if (location.pathname === "/network-error") {
            return <AppRoutes />;
        }
        return <Navigate to="/network-error" replace />;
    }

    if (location.pathname === "/network-error") {
        return <Navigate to="/" replace />;
    }

    return <AppRoutes />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AppGate />
        </BrowserRouter>
    );
}
