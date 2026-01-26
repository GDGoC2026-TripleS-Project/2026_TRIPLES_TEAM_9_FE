import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Onboarding.css";

const BACK = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Onboarding() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const trimmed = nickname.trim();
    if (!trimmed) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const authToken = sessionStorage.getItem("onboardingAuthToken");
    if (!authToken) {
      alert("온보딩 토큰이 없습니다. 다시 로그인 해주세요.");
      nav("/login", { replace: true });
      return;
    }

    try {
      const res = await fetch(`${BACK}/auth/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          authToken,
          nickname: trimmed,
        }),
      });

      if (res.status === 409) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
        return;
      }

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "온보딩 실패");
      }

      const json = await res.json();
      const payload = json.data ?? json;

      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: payload.userId,
          email: payload.email,
          nickname: payload.nickname,
          role: payload.role,
        })
      );

      sessionStorage.removeItem("onboardingAuthToken");
      nav("/signup/welcome", { replace: true });
    } catch (e) {
      const m = e?.message || "";

      if (m.includes("duplicate") || m.includes("중복") || m.includes("이미")) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
        return;
      }

      alert(m || "요청에 실패했습니다.");
    }
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <h2 className="onboard-title">회원가입</h2>
        <p className="onboard-desc">지식정원에서 사용할 닉네임을 정해주세요.</p>

        <form className="onboard-form" onSubmit={submit}>
          <input
            className="onboard-input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
          />

          <button className="onboard-submit" type="submit">
            완료
          </button>
        </form>
      </div>
    </div>
  );
}
