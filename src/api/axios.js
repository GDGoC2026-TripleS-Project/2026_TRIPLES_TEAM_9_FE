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
    if (!err.response) {
      window.location.href = "/network-error";
      return Promise.reject(err);
    }

    const { status } = err.response;
    const original = err.config;

    // refresh 요청이 401일 때는 무한루프 방지
    if (original?.url?.includes("/api/auth/refresh") && status === 401) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(err);
    }

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (!getAccessToken()) {
        clearAccessToken();
        window.location.href = "/login";
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
        const r = await api.post("/api/auth/refresh");

        const payload = r.data?.data ?? r.data;
        const newToken = payload?.tokens?.accessToken ?? payload?.accessToken;

        if (!newToken) throw new Error("refresh response에 accessToken 없음");

        setAccessToken(newToken);
        flushQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        flushQueue(e, null);
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
