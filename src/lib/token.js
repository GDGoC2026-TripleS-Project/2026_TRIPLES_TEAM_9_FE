const ACCESS_KEY = "accessToken";
const USER_KEY = "user";

export const AUTH_SESSION_CLEARED_EVENT = "auth:session-cleared";

const safeGet = (key) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSet = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        console.warn("로컬 스토리지에 데이터를 저장하지 못했습니다.");
    }
};

const safeRemove = (key) => {
    try {
        localStorage.removeItem(key);
    } catch {
        console.warn("로컬 스토리지에서 데이터를 제거하지 못했습니다.");
    }
};

const emitSessionCleared = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_CLEARED_EVENT));
};

export const getAccessToken = () => safeGet(ACCESS_KEY);

export const setAccessToken = (token) => {
    if (!token) return;
    safeSet(ACCESS_KEY, token);
};

export const clearAccessToken = () => safeRemove(ACCESS_KEY);

export const getStoredUser = () => {
    const raw = safeGet(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const setStoredUser = (user) => {
    if (!user) return;
    safeSet(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => safeRemove(USER_KEY);

export const clearAuthSession = ({ emitEvent = true } = {}) => {
    clearAccessToken();
    clearStoredUser();
    if (emitEvent) emitSessionCleared();
};
