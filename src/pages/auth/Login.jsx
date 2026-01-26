import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SocialLogin from "../../components/auth/SocialLogin/SocialLogin";
import { buildAuthUrl } from "../../lib/oauth";
import "../../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const close = () => navigate("/", { replace: true });

  const onSocial = (provider) => {
    window.location.href = buildAuthUrl(provider);
  };

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="login-overlay" onMouseDown={close}>
      <div className="login-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={close} aria-label="닫기">
          ✕
        </button>

        <div className="login-card">
          <h1 className="login-title">로그인/회원가입</h1>
          <p className="login-subtitle">소셜로그인 및 이메일로 가입할 수 있습니다.</p>

          <div className="divider" />

          <SocialLogin onSocial={onSocial} />

          <div className="or-row">
            <span className="line" />
          </div>
        </div>
      </div>
    </div>
  );
}
