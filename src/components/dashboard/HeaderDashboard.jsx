import "../../styles/Dashboard/HeaderDashboard.css";
import "../../styles/global.css";

import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";


const HeaderDashboard = () => {

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const onLogout = async () => {
        try {
            await api.delete("/auth/logout");
        } catch (e) {
            console.warn("서버 로그아웃 실패", e);
        } finally {
            logout();
            sessionStorage.removeItem("onboardingAgreements");
            navigate("/", { replace: true });
        }
    };

    return (
        <header className="HeaderDashboard">
            <div className="dashboard-container header-inner">
                <div className="brand" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
                    <div className="logo-box" aria-hidden />
                    <span className="brand-name">지식정원</span>
                </div>

                <nav className="header-actions">
                    <span className="user-name">{user?.nickname ?? "회원"}님</span>
                    <button className="link-btn" onClick={() => navigate("/mypage")}>
                        마이페이지
                    </button>
                    <button className="logout-btn" onClick={onLogout} aria-label="로그아웃">
                        <LogOut size={24} />
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default HeaderDashboard;
