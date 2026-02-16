import axios from "axios";
import { getAccessToken, clearAuthSession } from "../lib/token";
import { refreshAccessToken } from "../lib/auth/refresh";

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
const AUTH_DEBUG = import.meta.env.DEV || import.meta.env.VITE_AUTH_DEBUG === "true";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 10000,
});

const isRefreshRequest = (url = "") => url.includes("/refresh");
let onAuthFail = null;
let isRedirectingToLogin = false;

const debugLog = (...args) => {
  if (!AUTH_DEBUG) return;
  console.debug("[auth:axios]", ...args);
};

export const setOnAuthFail = (callback) => {
  onAuthFail = typeof callback === "function" ? callback : null;
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login" || isRedirectingToLogin) return;

  isRedirectingToLogin = true;
  window.alert("로그인이 필요합니다.");
  window.location.href = "/login";
};

const handleAuthFail = (reason) => {
  debugLog("handleAuthFail", {
    type: reason?.type ?? "unknown",
    status: reason?.error?.response?.status ?? null,
    message: reason?.error?.message ?? null,
  });
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
      debugLog("network error", { url: err?.config?.url ?? null });
      window.location.href = "/network-error";
      return Promise.reject(err);
    }

    const { status } = err.response;
    const original = err.config;
    debugLog("response error", {
      status,
      url: original?.url ?? null,
      isRefreshRequest: isRefreshRequest(original?.url),
      retried: Boolean(original?._retry),
    });

    if (isRefreshRequest(original?.url) && status === 401) {
      handleAuthFail({ type: "refresh_unauthorized", error: err });
      return Promise.reject(err);
    }

    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        debugLog("try refresh before retry", { url: original?.url ?? null });
        const newToken = await refreshAccessToken();
        if (!newToken) {
          handleAuthFail({ type: "refresh_failed", error: err });
          return Promise.reject(err);
        }

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        debugLog("retry original request with new token", { url: original?.url ?? null });
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
