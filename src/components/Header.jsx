import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // 네 axios 인스턴스 경로에 맞춰줘

export default function Header() {
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

  return (
    <header className="header">
      <div className="container header-inner">
        <div
          className="brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-box" aria-hidden />
          <span className="brand-name">지식정원</span>
        </div>

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
      </div>
    </header>
  );
}
