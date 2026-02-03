import "../../styles/Dashboard/HeaderDashboard.css";
import "../../styles/global.css";

import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

const HeaderDashboard = () => {
    const { user } = useAuth();

    return (
        <header className="HeaderDashboard">
            <div className="dashboard-container header-inner">
                <div className="brand" style={{ cursor: "pointer" }}>
                    <div className="logo-box" aria-hidden />
                    <span className="brand-name">지식정원</span>
                </div>

                <nav className="header-actions">
                    <span className="user-name">{user?.nickname ?? "회원"}님</span>
                    <button className="link-btn">마이페이지</button>
                    <button className="logout-btn">
                        <LogOut size={24} />
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default HeaderDashboard;
