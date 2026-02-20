import { useCallback, useEffect, useState } from "react";
import { getAccessToken, getStoredUser } from "../lib/token";
import { refreshAccessToken } from "../lib/auth/refresh";

const BOOT_ERROR_TYPES = {
    NETWORK: "NETWORK",
    AUTH: "AUTH",
    SERVER: "SERVER",
    UNKNOWN: "UNKNOWN",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NETWORK_MESSAGE = "네트워크가 불안정합니다.";
const AUTH_MESSAGE = "인증 상태를 확인할 수 없습니다.";
const SERVER_MESSAGE = "서버 상태가 불안정합니다.";
const UNKNOWN_MESSAGE = "초기화 중 오류가 발생했습니다.";

const getErrorMessage = (error) => {
    if (typeof error?.message === "string" && error.message.trim()) {
        return error.message;
    }
    return UNKNOWN_MESSAGE;
};

const createBootError = (type, message) => ({ type, message });

const classifyError = (error) => {
    const status = error?.status ?? error?.response?.status;

    if (status === 401 || status === 403) {
        return createBootError(BOOT_ERROR_TYPES.AUTH, AUTH_MESSAGE);
    }

    if (typeof status === "number" && status >= 500) {
        return createBootError(BOOT_ERROR_TYPES.SERVER, SERVER_MESSAGE);
    }

    const name = String(error?.name ?? "");
    const code = String(error?.code ?? "");
    const message = String(error?.message ?? "").toLowerCase();

    if (
        name === "AbortError" ||
        code === "ECONNABORTED" ||
        message.includes("timeout") ||
        message.includes("failed to fetch") ||
        message.includes("network error") ||
        message.includes("networkerror")
    ) {
        return createBootError(BOOT_ERROR_TYPES.NETWORK, NETWORK_MESSAGE);
    }

    return createBootError(BOOT_ERROR_TYPES.UNKNOWN, getErrorMessage(error));
};

const toErrorWithStatus = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const fetchWithTimeout = async (url, timeoutMs) => {
    const controller = new AbortController();
    const timerId = window.setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    try {
        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
            signal: controller.signal,
        });
        return response;
    } finally {
        window.clearTimeout(timerId);
    }
};

const resolveHealthUrl = () => {
    const base = String(import.meta.env.VITE_BACKEND_BASE_URL ?? "").replace(/\/+$/, "");
    if (!base) return "/api/health";
    return `${base}/api/health`;
};

const checkNetworkHealth = async (timeoutMs) => {
    if (navigator.onLine === false) {
        throw createBootError(BOOT_ERROR_TYPES.NETWORK, NETWORK_MESSAGE);
    }

    const response = await fetchWithTimeout(resolveHealthUrl(), timeoutMs);
    if (!response.ok) {
        throw toErrorWithStatus(response.status, `health check failed: ${response.status}`);
    }
};

const loadRuntimeTheme = () => {
    const savedTheme = window.localStorage.getItem("theme");
    if (!savedTheme) return;
    document.documentElement.dataset.theme = savedTheme;
};

export default function useAppBootstrap({
    minDelayMs = 500,
    timeoutMs = 7000,
    enableHealthCheck = false,
} = {}) {
    const [ready, setReady] = useState(false);
    const [bootError, setBootError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => {
        setReady(false);
        setBootError(null);
        setAttempt((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const runBootstrap = async () => {
            setReady(false);
            setBootError(null);
            const delayPromise = sleep(minDelayMs);

            try {
                if (navigator.onLine === false) {
                    throw createBootError(BOOT_ERROR_TYPES.NETWORK, NETWORK_MESSAGE);
                }

                if (enableHealthCheck) {
                    await checkNetworkHealth(timeoutMs);
                }

                const token = getAccessToken();
                const user = getStoredUser();

                if (token && !user) {
                    await refreshAccessToken();
                }

                loadRuntimeTheme();
            } catch (error) {
                if (!cancelled) {
                    const nextError =
                        error?.type && error?.message
                            ? error
                            : classifyError(error);
                    setBootError(nextError);
                }
            } finally {
                await delayPromise;
                if (!cancelled) {
                    setReady(true);
                }
            }
        };

        runBootstrap();

        return () => {
            cancelled = true;
        };
    }, [attempt, enableHealthCheck, minDelayMs, timeoutMs]);

    return { ready, bootError, retry };
}
