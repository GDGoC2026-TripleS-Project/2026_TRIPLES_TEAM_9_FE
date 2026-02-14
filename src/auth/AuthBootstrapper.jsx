import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthBootstrapper({ children }) {
    const { authReady, setAuthReady, refreshAuth } = useAuth();

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
        const onVisible = () => {
            if (document.visibilityState !== "visible") return;
            refreshAuth();
        };

        const onOnline = () => {
            refreshAuth();
        };

        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("online", onOnline);

        return () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("online", onOnline);
        };
    }, [refreshAuth]);

    if (!authReady) return null;
    return children;
}
