import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const goMypage = () => {
    navigate("/mypage");
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="logo-box" aria-hidden />
          <span className="brand-name">지식정원</span>
        </div>

        <nav className="header-actions">
          {!user ? (
            <>
              <button className="link-btn" onClick={goLogin}>
                로그인
              </button>
              <button className="primary-btn" onClick={goLogin}>
                회원가입
              </button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 600 }}>
                {user.nickname}
              </span>
              <button className="link-btn" onClick={goMypage}>
                마이페이지
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
