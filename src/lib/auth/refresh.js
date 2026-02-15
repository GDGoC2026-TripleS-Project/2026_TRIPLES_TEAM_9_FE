import axios from "axios";
import { setAccessToken } from "../token";

const BASE = String(import.meta.env.VITE_BACKEND_BASE_URL ?? "").replace(/\/+$/, "");
const REFRESH_PATH = "/auth/refresh";

let refreshPromise = null;

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

export const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const response = await axios.post(joinUrl(BASE, REFRESH_PATH), {}, {
                withCredentials: true,
                timeout: 10000,
            });

            const accessToken = parseAccessToken(response?.data);
            if (!accessToken) {
                throw new Error("refresh 응답에 accessToken이 없습니다.");
            }

            setAccessToken(accessToken);
            return accessToken;
        } catch (error) {
            console.error("access 토큰 갱신에 실패했습니다:", getErrorSummary(error));
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};
