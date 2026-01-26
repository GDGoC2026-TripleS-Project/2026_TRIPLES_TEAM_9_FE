import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // 새로고침/재접속 시 복구
    useEffect(() => {
        try {
            const token = localStorage.getItem("accessToken");
            const u = localStorage.getItem("user");
            if (token && u) setUser(JSON.parse(u));
            else setUser(null);
        } catch {
            setUser(null);
        }
    }, []);

    const login = useCallback((accessToken, userObj) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj); 
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthed: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
