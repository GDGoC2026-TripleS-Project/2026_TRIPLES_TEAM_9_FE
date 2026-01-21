import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const BACK = import.meta.env.VITE_BACKEND_BASE_URL;

export default function OAuthCallback() {
  const { provider } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [msg, setMsg] = useState("로그인 처리 중...");

  useEffect(() => {
    const code = sp.get("code");
    const state = sp.get("state");
    const error = sp.get("error");

    if (error) {
      setMsg(`로그인 실패: ${error}`);
      return;
    }
    if (!code) {
      setMsg("code가 없습니다. (redirect_uri 설정 확인)");
      return;
    }

    if (provider === "naver") {
      const saved = sessionStorage.getItem("naver_oauth_state");
      if (saved && state !== saved) {
        setMsg("state 불일치 (CSRF 의심)");
        return;
      }
    }

    (async () => {
      try {
        const res = await fetch(`${BACK}/api/auth/oauth/${provider}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `HTTP ${res.status}`);
        }

        const data = await res.json();

        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

        setMsg("로그인 성공! 이동 중...");
        nav("/", { replace: true });
      } catch (e) {
        setMsg(`로그인 처리 실패: ${e.message}`);
      }
    })();
  }, [provider, sp, nav]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef3fb" }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}>
        {msg}
      </div>
    </div>
  );
}
