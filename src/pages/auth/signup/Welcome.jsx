import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthOverlay from "../../../components/auth/AuthOverlay";
import "../../../styles/Welcome.css";

export default function Welcome() {
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      nav("/", { replace: true });
    }, 5000);
    return () => clearTimeout(t);
  }, [nav]);

  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  return (
    <AuthOverlay closeTo="/" variant="wc">
      <div className="auth-page">
        <div className="welcome-badge" aria-hidden>🌿</div>

        <h2 className="welcome-title">
          {user?.nickname ? `${user.nickname}님, 환영합니다!` : "환영합니다!"}
        </h2>

        <p className="welcome-desc">
          지식정원에서 당신만의 지식을 차곡차곡 쌓아보세요.
        </p>

        <div className="welcome-actions">
          <button className="welcome-btn" onClick={() => nav("/", { replace: true })}>
            바로 시작하기
          </button>
        </div>
      </div>
    </AuthOverlay>
  );
}
