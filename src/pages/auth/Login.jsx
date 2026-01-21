import "../../styles/auth.css";
import { buildAuthUrl } from "../../lib/oauth";

export default function Login() {
  const onClickSocial = (provider) => {
    const url = buildAuthUrl(provider);
    window.location.href = url;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입하기</h1>
        <p className="auth-subtitle">소셜로그인 및 이메일로 가입할 수 있습니다.</p>

        <div className="divider" />

        <button className="btn btn-kakao" onClick={() => onClickSocial("kakao")}>
          <span className="icon kakao" aria-hidden />
          카카오로 시작하기
        </button>

        <button className="btn btn-google" onClick={() => onClickSocial("google")}>
          <span className="icon google" aria-hidden>G</span>
          구글로 시작하기
        </button>

        <button className="btn btn-naver" onClick={() => onClickSocial("naver")}>
          <span className="icon naver" aria-hidden>N</span>
          네이버로 시작하기
        </button>

        <div className="or-row">
          <span className="line" />
          <span className="or-text">또는</span>
          <span className="line" />
        </div>
{/* 
        <button className="btn btn-email" onClick={() => alert("이메일 회원가입 화면으로 이동")}>
          ID/PW 회원가입
        </button> */}
      </div>
    </div>
  );
}
