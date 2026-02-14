import axios from "axios";
import { clearAuthSession, setAccessToken } from "../token";

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
const REFRESH_PATH = "/auth/refresh";

let refreshPromise = null;

const parseAccessToken = (payload) => {
    const body = payload?.data ?? payload;
    return body?.tokens?.accessToken ?? body?.accessToken ?? null;
};

export const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const response = await axios.post(`${BASE}${REFRESH_PATH}`, null, {
                withCredentials: true,
                timeout: 10000,
            });

            const accessToken = parseAccessToken(response?.data);
            if (!accessToken) throw new Error("refresh 응답에 accessToken이 없습니다.");

            setAccessToken(accessToken);
            return accessToken;
        } catch {
            clearAuthSession();
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};
