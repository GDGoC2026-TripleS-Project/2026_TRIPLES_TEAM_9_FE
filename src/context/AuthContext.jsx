import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
    AUTH_SESSION_CLEARED_EVENT,
    clearAuthSession,
    getAccessToken,
    getStoredUser,
    setAccessToken,
    setStoredUser,
} from "../lib/token";
import { refreshAccessToken } from "../lib/auth/refresh";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const [authReady, setAuthReady] = useState(false);

    const login = useCallback((accessToken, userObj) => {
        setAccessToken(accessToken);
        setStoredUser(userObj);
        setUser(userObj);
    }, []);

    const logout = useCallback(() => {
        clearAuthSession();
        setUser(null);
    }, []);

    const refreshAuth = useCallback(async () => {
        const currentToken = getAccessToken();
        if (!user && !currentToken) return null;

        const nextToken = await refreshAccessToken();
        if (!nextToken) {
            clearAuthSession();
            setUser(null);
            return null;
        }

        return nextToken;
    }, [user]);

    useEffect(() => {
        const onSessionCleared = () => setUser(null);
        window.addEventListener(AUTH_SESSION_CLEARED_EVENT, onSessionCleared);
        return () => {
            window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, onSessionCleared);
        };
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthed: !!user,
            authReady,
            setAuthReady,
            login,
            logout,
            refreshAuth,
        }),
        [authReady, login, logout, refreshAuth, user],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
