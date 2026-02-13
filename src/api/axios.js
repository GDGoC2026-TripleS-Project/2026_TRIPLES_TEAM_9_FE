import axios from "axios";
import { getAccessToken, clearAuthSession } from "../lib/token";
import { refreshAccessToken } from "../lib/auth/refresh";

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 10000,
});

const isRefreshRequest = (url = "") => url.includes("/refresh");
let onAuthFail = null;

export const setOnAuthFail = (callback) => {
  onAuthFail = typeof callback === "function" ? callback : null;
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const handleAuthFail = (reason) => {
  clearAuthSession();

  if (onAuthFail) {
    onAuthFail(reason);
    return;
  }

  redirectToLogin();
};

api.interceptors.request.use((config) => {
  if (isRefreshRequest(config?.url)) return config;
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!err.response) {
      window.location.href = "/network-error";
      return Promise.reject(err);
    }

    const { status } = err.response;
    const original = err.config;

    // refresh 요청 자체가 실패하면 인증 상태를 비웁니다.
    if (isRefreshRequest(original?.url) && status === 401) {
      handleAuthFail({ type: "refresh_unauthorized", error: err });
      return Promise.reject(err);
    }

    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          handleAuthFail({ type: "refresh_failed", error: err });
          return Promise.reject(err);
        }

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        handleAuthFail({ type: "refresh_exception", error: refreshError });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
