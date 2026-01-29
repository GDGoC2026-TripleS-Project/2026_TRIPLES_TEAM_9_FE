import "../../styles/Dashboard/HeaderDashboard.css";

import { LogOut } from "lucide-react";

const HeaderDashboard = () => {
    return (
        <header className="HeaderDashboard">
            <div className="container header-inner">
                <div className="brand" style={{ cursor: "pointer" }}>
                    <div className="logo-box" aria-hidden />
                    <span className="brand-name">지식정원</span>
                </div>

                <nav className="header-actions">
                    <span className="user-name">김규빈님</span>
                    <button className="link-btn">마이페이지</button>
                    <span>
                        <LogOut size={24} />
                    </span>
                </nav>
            </div>
        </header>
    );
};

export default HeaderDashboard;
