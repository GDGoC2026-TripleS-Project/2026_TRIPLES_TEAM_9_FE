import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthBootstrapper({ children }) {
    const { setAuthReady, refreshAuth } = useAuth();
    const lastRefreshAtRef = useRef(0);

    useEffect(() => {
        let alive = true;

        const runInitialRefresh = async () => {
            await refreshAuth();
            if (alive) setAuthReady(true);
        };

        runInitialRefresh();

        return () => {
            alive = false;
        };
    }, [refreshAuth, setAuthReady]);

    useEffect(() => {
        const triggerRefresh = () => {
            const now = Date.now();
            if (now - lastRefreshAtRef.current < 5000) return;
            lastRefreshAtRef.current = now;
            refreshAuth();
        };

        const onVisible = () => {
            if (document.visibilityState !== "visible") return;
            triggerRefresh();
        };

        const onOnline = () => {
            triggerRefresh();
        };

        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("online", onOnline);

        return () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("online", onOnline);
        };
    }, [refreshAuth]);

    return children;
}
