import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/OauthCallback.css";

export default function OauthCallback() {
  const nav = useNavigate();
  const { provider } = useParams();
  const [sp] = useSearchParams();
  const executedRef = useRef(false);
  const [msg, setMsg] = useState("로그인 처리 중...");

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    const token = sp.get("token");
    const error = sp.get("error");

    if (error) {
      setMsg(`로그인 실패: ${error}`);
      nav("/login", { replace: true });
      return;
    }

    if (!token) {
      setMsg("token이 없습니다. 백엔드 redirect 설정 확인");
      nav("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        setMsg("서버 로그인 처리 중...");

        //백엔드에 로그인 요청
        const res = await api.post("/auth/login", { authToken: token });

        const payload = res.data?.data ?? res.data;

        const accessToken = payload?.tokens?.accessToken ?? payload?.accessToken;
        if (!accessToken) throw new Error("accessToken이 없습니다.");

        localStorage.setItem("accessToken", accessToken);

        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: payload.userId,
            email: payload.email,
            nickname: payload.nickname,
            role: payload.role,
          })
        );

        if (payload.newUser === true) {
          sessionStorage.setItem("onboardingAuthToken", token);
          setMsg("신규 회원입니다. 회원가입으로 이동 중...");
          nav("/signup/agreement", { replace: true });
          return;
        }

        setMsg("로그인 성공! 이동 중...");
        nav("/", { replace: true });
      } catch (e) {
        console.error(e);
        setMsg("로그인 처리 실패. 다시 로그인 해주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("onboardingAuthToken");
        nav("/login", { replace: true });
      }
    })();
  }, [nav, sp, provider]);

  return (
    <div className="oauth-callback">
    <div className="oauth-card">
      <div className="oauth-spinner" />
      <h2 className="oauth-title">로그인 처리 중</h2>
      <p className="oauth-sub">{msg}</p>
    </div>
  </div>
  );
}
