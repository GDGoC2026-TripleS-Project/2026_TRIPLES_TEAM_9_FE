import SocialLogin from "../../components/auth/SocialLogin/SocialLogin";
import { buildAuthUrl } from "../../lib/oauth";
import "../../styles/login.css";

export default function Login() {
  const onSocial = (provider) => {
    window.location.href = buildAuthUrl(provider);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">회원가입하기</h1>
        <p className="login-subtitle">소셜로그인 및 이메일로 가입할 수 있습니다.</p>

        <div className="divider" />

        <SocialLogin onSocial={onSocial} />

        <div className="or-row">
          <span className="line" />
          <span className="or-text">또는</span>
          <span className="line" />
        </div>
      </div>
    </div>
  );
}
