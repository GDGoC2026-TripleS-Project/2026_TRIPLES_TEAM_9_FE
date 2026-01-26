import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/SignupAgreement.css";

export default function SignupAgreement() {
  const nav = useNavigate();
  const [all, setAll] = useState(false);

  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("onboardingAuthToken");
    if (!t) nav("/login", { replace: true });
  }, [nav]);

  useEffect(() => {
    setAll(terms && privacy && marketing);
  }, [terms, privacy, marketing]);

  const toggleAll = (checked) => {
    setAll(checked);
    setTerms(checked);
    setPrivacy(checked);
    setMarketing(checked);
  };

  const canNext = terms && privacy;

  const next = () => {
    if (!canNext) return;

    sessionStorage.setItem(
      "onboardingAgreements",
      JSON.stringify({ terms, privacy, marketing })
    );

    nav("/signup/onboarding", { replace: true });
  };

  return (
    <div className="signup-wrap">
      <div className="signup-card">
        <div className="signup-head">
          <h2>약관 동의</h2>
          <p>서비스 이용을 위해 약관에 동의해주세요.</p>
        </div>

        <div className="agree-box">
          <label className="agree-row">
            <input
              type="checkbox"
              checked={all}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            <b>전체 동의</b>
            <span className="tag">선택 포함</span>
          </label>

          <div className="divider" />

          <label className="agree-row">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span>(필수) 이용약관 동의</span>
            <span className="tag required">필수</span>
          </label>

          <label className="agree-row">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
            />
            <span>(필수) 개인정보 처리방침 동의</span>
            <span className="tag required">필수</span>
          </label>

          <label className="agree-row">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span>(선택) 마케팅 수신 동의</span>
            <span className="tag">선택</span>
          </label>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => nav(-1)}>
            뒤로
          </button>

          <button className="btn btn-primary" onClick={next} disabled={!canNext}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
