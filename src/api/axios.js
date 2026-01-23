import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../lib/token";

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

const api = axios.create({
    baseURL: BASE,
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshing = false;
let queue = [];

const flushQueue = (err, newToken) => {
    queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(newToken)));
    queue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        // 네트워크 에러
        if (!err.response) {
            window.location.href = "/network-error";
            return Promise.reject(err);
        }

        const { status } = err.response;
        const original = err.config;

        if (status === 401 && !original._retry) {
            original._retry = true;

            // accessToken 자체가 없으면 로그인 유도
            if (!getAccessToken()) {
                clearAccessToken();
                window.location.href = "/auth";
                return Promise.reject(err);
            }

            if (refreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (newToken) => {
                            original.headers.Authorization = `Bearer ${newToken}`;
                            resolve(api(original));
                        },
                        reject,
                    });
                });
            }

            refreshing = true;
            try {
                // refreshToken은 쿠키로 자동 전송됨
                const r = await axios.post(`${BASE}/api/auth/refresh`, {}, { withCredentials: true });
                const newToken = r.data?.accessToken;
                if (!newToken) throw new Error("refresh response에 accessToken 없음");

                setAccessToken(newToken);
                flushQueue(null, newToken);

                original.headers.Authorization = `Bearer ${newToken}`;
                return api(original);
            } catch (e) {
                flushQueue(e, null);
                clearAccessToken();
                window.location.href = "/auth";
                return Promise.reject(e);
            } finally {
                refreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default api;
