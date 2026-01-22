import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <div className="logo-box" aria-hidden />
          <span className="brand-name">지식정원</span>
        </div>

        <nav className="header-actions">
          <button className="link-btn"onClick={() => navigate("/auth")}>로그인</button>
          <button className="primary-btn">회원가입</button>
        </nav>
      </div>
    </header>
  );
}
