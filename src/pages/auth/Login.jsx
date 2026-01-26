import AuthOverlay from "../../components/auth/AuthOverlay";
import SocialLogin from "../../components/auth/SocialLogin/SocialLogin";
import { buildAuthUrl } from "../../lib/oauth";
import "../../styles/login.css";

export default function Login() {
  const onSocial = (provider) => {
    window.location.href = buildAuthUrl(provider);
  };

  return (
    <AuthOverlay closeTo="/" variant="lg">
      <div className="auth-page">
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">소셜로그인 및 이메일로 가입할 수 있습니다.</p>

        <div className="divider" />

        <SocialLogin onSocial={onSocial} />
      </div>
    </AuthOverlay>
  );
}
