import "../../styles/common/Header.css";
import { ArrowLeft, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import logo from "../../assets/header/logo.svg";

const VARIANT_HOME = "home";
const VARIANT_DASHBOARD = "dashboard";
const VARIANT_RECORDS = "records";
const VARIANT_DETAIL = "detail";
const VARIANT_GOALS = "goals";
const VARIANT_MINDMAP = "mindmap";
const VARIANT_MYPAGE = "mypage";

export default function Header({
    variant = VARIANT_HOME,
    title,
    subtitle,
    showBack = false,
    onBack,
    onAdd,
    addLabel = "+ 새 기록",
    right,
}) {
    const navigate = useNavigate();
    const { user, isAuthed, logout } = useAuth();

    const goMypage = () => navigate("/mypage");
    const goLogin = () => navigate("/login");

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

    const renderLeft = () => {
        if (
            variant === VARIANT_RECORDS ||
            variant === VARIANT_DETAIL ||
            variant === VARIANT_MINDMAP
        ) {
            return (
                <div className="header-left">
                    {showBack && (
                        <button
                            className={`header-back-btn${variant === VARIANT_DETAIL ? " header-back-btn--detail" : ""}`}
                            type="button"
                            onClick={onBack}
                        >
                            {(variant === VARIANT_RECORDS || variant === VARIANT_MINDMAP) && (
                                <ArrowLeft size={20} />
                            )}
                            {variant === VARIANT_DETAIL && (
                                <span className="header-back-label">
                                    <ArrowLeft size={20} />
                                    돌아가기
                                </span>
                            )}
                        </button>
                    )}
                    {title && <h1 className="header-title">{title}</h1>}
                </div>
            );
        }

        if (variant === VARIANT_GOALS) {
            return (
                <div className="header-left">
                    <div className="header-goals-mainline">
                        {showBack && (
                            <button className="header-back-btn" type="button" onClick={onBack}>
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h1 className="header-title">{title}</h1>
                    </div>
                    <p className="header-subtitle">{subtitle}</p>
                </div>
            );
        }

        return (
            <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <div className="logo-box" aria-hidden>
                    <img src={logo} alt="로고" className="logo" />
                </div>
            </div>
        );
    };

    const renderRight = () => {
        if (right) return right;

        if (variant === VARIANT_DETAIL || variant === VARIANT_MINDMAP) {
            return null;
        }

        if (variant === VARIANT_DASHBOARD || variant === VARIANT_MYPAGE) {
            return (
                <nav className="header-actions--dashboard">
                    <span className="header-user">{user?.nickname ?? "회원"}님</span>
                    <button className="link-btn" onClick={goMypage}>
                        마이페이지
                    </button>
                    <button className="logout-btn" onClick={onLogout}>
                        <LogOut size={24} />
                    </button>
                </nav>
            );
        }

        if (variant === VARIANT_RECORDS) {
            if (!onAdd) return null;
            return (
                <button className="header-add-btn" type="button" onClick={onAdd}>
                    {addLabel}
                </button>
            );
        }

        if (variant === VARIANT_GOALS) {
            if (!onAdd) return null;
            return (
                <button className="header-add-btn" type="button" onClick={onAdd}>
                    {addLabel}
                </button>
            );
        }

        return (
            <nav className="header-actions">
                {!isAuthed ? (
                    <button className="link-btn" onClick={goLogin}>
                        로그인/회원가입
                    </button>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontWeight: 600 }}>{user?.nickname}</span>

                        <button className="link-btn" onClick={goMypage}>
                            마이페이지
                        </button>

                        <button className="link-btn" onClick={onLogout}>
                            로그아웃
                        </button>
                    </div>
                )}
            </nav>
        );
    };

    return (
        <header className={`header header--${variant}`}>
            <div className="header-container header-inner">
                {renderLeft()}
                {renderRight()}
            </div>
        </header>
    );
}
