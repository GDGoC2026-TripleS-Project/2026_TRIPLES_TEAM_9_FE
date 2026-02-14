import axios from "axios";
import { setAccessToken } from "../token";

const BASE = String(import.meta.env.VITE_BACKEND_BASE_URL ?? "").replace(/\/+$/, "");
const AUTH_DEBUG = import.meta.env.DEV || import.meta.env.VITE_AUTH_DEBUG === "true";
const REFRESH_BODY_MODE = String(import.meta.env.VITE_AUTH_REFRESH_BODY_MODE ?? "empty").toLowerCase();
const REFRESH_PATHS = Array.from(
    new Set([
        import.meta.env.VITE_AUTH_REFRESH_PATH,
        "/auth/refresh",
    ].filter(Boolean)),
);
const refreshClient = axios.create({
    baseURL: BASE,
    withCredentials: true,
    timeout: 10000,
});

let refreshPromise = null;

const debugLog = (...args) => {
    if (!AUTH_DEBUG) return;
    console.debug("[auth:refresh]", ...args);
};

const parseAccessToken = (payload) => {
    const body = payload?.data ?? payload;
    return body?.tokens?.accessToken ?? body?.accessToken ?? null;
};

const joinUrl = (base, path) => {
    if (!path) return base;
    if (/^https?:\/\//i.test(path)) return path;
    const normalizedPath = String(path).startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
};

const getErrorSummary = (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
        data?.message ||
        (typeof data === "string" ? data.split("\n")[0] : null) ||
        error?.message ||
        "알 수 없는 오류";
    return status ? `[${status}] ${message}` : message;
};

const shouldTryNextPath = (error) => {
    const status = error?.response?.status;
    return status === 404;
};

const getRefreshRequestBody = () => {
    // 백엔드가 body 없는 refresh를 기대하면 `VITE_AUTH_REFRESH_BODY_MODE=none` 사용
    if (REFRESH_BODY_MODE === "none") return null;
    return {};
};

export const refreshAccessToken = async () => {
    if (refreshPromise) {
        debugLog("reuse in-flight refresh promise");
        return refreshPromise;
    }

    refreshPromise = (async () => {
        let lastError = null;
        try {
            for (const path of REFRESH_PATHS) {
                const url = joinUrl(BASE, path);
                try {
                    const body = getRefreshRequestBody();
                    debugLog("request", {
                        method: "POST",
                        url,
                        withCredentials: true,
                        bodyMode: body === null ? "none" : "empty",
                    });
                    const response = await refreshClient.post(url, body);

                    const accessToken = parseAccessToken(response?.data);
                    if (!accessToken) {
                        throw new Error("refresh 응답에 accessToken이 없습니다.");
                    }

                    debugLog("success", { status: response?.status ?? null });
                    setAccessToken(accessToken);
                    return accessToken;
                } catch (error) {
                    lastError = error;
                    debugLog("failed", {
                        status: error?.response?.status ?? null,
                        url,
                        message: getErrorSummary(error),
                    });
                    if (!shouldTryNextPath(error)) break;
                }
            }

            throw lastError ?? new Error("refresh 호출에 실패했습니다.");
        } catch (error) {
            console.error("액세스 토큰 갱신에 실패했습니다:", getErrorSummary(error));
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};
