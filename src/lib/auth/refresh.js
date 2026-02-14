import axios from "axios";
import { setAccessToken } from "../token";

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
const REFRESH_PATHS = Array.from(
    new Set([
        import.meta.env.VITE_AUTH_REFRESH_PATH,
        "/auth/refresh",
    ].filter(Boolean)),
);

let refreshPromise = null;

const parseAccessToken = (payload) => {
    const body = payload?.data ?? payload;
    return body?.tokens?.accessToken ?? body?.accessToken ?? null;
};

export const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        let lastError = null;
        try {
            for (const path of REFRESH_PATHS) {
                try {
                    const response = await axios.post(`${BASE}${path}`, null, {
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
                    lastError = error;
                }
            }

            throw lastError ?? new Error("refresh 호출에 실패했습니다.");
        } catch (error) {
            console.error("액세스 토큰 갱신에 실패했습니다:", error);
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};
