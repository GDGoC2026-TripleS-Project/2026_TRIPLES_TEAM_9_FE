import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthOverlay from "../../../components/auth/AuthOverlay";
import "../../../styles/Onboarding.css";
import { useAuth } from "../../../context/AuthContext";
import { submitOnboarding } from "../../../api/onboarding.api";

const LEARNING_GOAL_LABELS = {
  JOB: "취업",
  CERTIFICATE: "자격증",
  PROJECT: "프로젝트",
  WORK: "업무",
  SELF_GROWTH: "자기계발",
  OTHER: "기타",
};

const LEARNING_FIELD_LABELS = {
  DEVELOPMENT: "개발",
  DATA_AI: "데이터/AI",
  HUMANITIES: "인문",
  SOCIAL_SCIENCE: "사회과학",
  BUSINESS: "경영",
  ECONOMICS: "경제",
  MARKETING: "마케팅",
  DESIGN: "디자인",
  LANGUAGE: "언어",
  EDUCATION: "교육",
  ART_CONTENT: "예술/콘텐츠",
  HEALTH: "헬스/건강",
  OTHER: "기타",
};

export default function Onboarding() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [nickname, setNickname] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [learningGoalText, setLearningGoalText] = useState("");
  const [learningFields, setLearningFields] = useState([]);
  const [resolution, setResolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldWarning, setFieldWarning] = useState("");

  useEffect(() => {
    const authToken = sessionStorage.getItem("onboardingAuthToken");
    if (!authToken) {
      nav("/login", { replace: true });
    }
  }, [nav]);

  useEffect(() => {
    if (learningGoal !== "OTHER") {
      setLearningGoalText("");
    }
  }, [learningGoal]);

  const nicknameTrimmed = nickname.trim();
  const nicknameValid = nicknameTrimmed.length >= 2 && nicknameTrimmed.length <= 20;
  const resolutionCount = resolution.length;
  const learningGoalTextCount = learningGoalText.length;

  const learningGoalOptions = useMemo(
    () => Object.entries(LEARNING_GOAL_LABELS),
    []
  );
  const learningFieldOptions = useMemo(
    () => Object.entries(LEARNING_FIELD_LABELS),
    []
  );

  const submit = async (e) => {
    e.preventDefault();

    if (!nicknameValid) {
      alert("닉네임은 2~20자 이내로 입력해주세요.");
      return;
    }

    const authToken = sessionStorage.getItem("onboardingAuthToken");
    if (!authToken) {
      nav("/login", { replace: true });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await submitOnboarding({
        authToken,
        payload: {
          nickname: nicknameTrimmed,
          learningGoal: learningGoal || null,
          learningGoalText:
            learningGoal === "OTHER"
              ? learningGoalText.trim().slice(0, 100) || null
              : null,
          learningFields,
          resolution: resolution.trim().slice(0, 200) || null,
        },
      });

      if (!payload?.accessToken) {
        throw new Error("accessToken이 없습니다.");
      }

      login(payload.accessToken, {
        userId: payload.userId,
        email: payload.email,
        nickname: payload.nickname,
        role: payload.role,
      });

      sessionStorage.removeItem("onboardingAuthToken");
      nav("/signup/welcome", { replace: true });
    } catch (e) {
      const status = e?.status;
      if (status === 400) {
        alert("입력값을 확인해주세요.");
        return;
      }
      if (status === 401 || status === 403) {
        nav("/login", { replace: true });
        return;
      }
      if (status === 409) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
        return;
      }
      const m = e?.message || "";
      alert(m || "요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleField = (value) => {
    setLearningFields((prev) => {
      if (prev.includes(value)) {
        setFieldWarning("");
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= 3) {
        setFieldWarning("최대 3개까지 선택할 수 있어요.");
        return prev;
      }
      setFieldWarning("");
      return [...prev, value];
    });
  };

  const maxFieldSelected = learningFields.length >= 3;

  return (
    <AuthOverlay closeTo="/signup/agreement" variant="ob">
      <div className="auth-page">
        <h2 className="onboard-title">회원가입</h2>
        <p className="onboard-desc">
          지식정원에서 사용할 정보를 입력해주세요.
        </p>

        <form className="onboard-form" onSubmit={submit}>
          <div className="onboard-section">
            <label className="onboard-label">
              닉네임 <span className="onboard-required">*</span>
            </label>
            <input
              className="onboard-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (2~20자)"
              maxLength={20}
            />
            {!nicknameValid && nicknameTrimmed && (
              <p className="onboard-hint">닉네임은 2~20자 이내로 입력해주세요.</p>
            )}
          </div>

          <div className="onboard-section">
            <label className="onboard-label">학습 목적</label>
            <div className="onboard-chip-grid">
              {learningGoalOptions.map(([value, label]) => {
                const selected = learningGoal === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`onboard-chip ${selected ? "is-selected" : ""}`}
                    onClick={() => setLearningGoal(selected ? "" : value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {learningGoal === "OTHER" && (
              <div className="onboard-subfield">
                <input
                  className="onboard-input"
                  value={learningGoalText}
                  onChange={(e) => setLearningGoalText(e.target.value)}
                  placeholder="기타 학습 목적을 입력해주세요 (최대 100자)"
                  maxLength={100}
                />
                <div className="onboard-count">
                  {learningGoalTextCount}/100
                </div>
              </div>
            )}
          </div>

          <div className="onboard-section">
            <label className="onboard-label">학습 분야 (최대 3개)</label>
            <div className="onboard-chip-grid">
              {learningFieldOptions.map(([value, label]) => {
                const selected = learningFields.includes(value);
                const disabled = !selected && maxFieldSelected;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`onboard-chip ${selected ? "is-selected" : ""}`}
                    onClick={() => toggleField(value)}
                    disabled={disabled}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {fieldWarning && <p className="onboard-hint">{fieldWarning}</p>}
          </div>

          <div className="onboard-section">
            <label className="onboard-label">나의 다짐</label>
            <textarea
              className="onboard-textarea"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="나의 다짐을 적어주세요 (선택)"
              maxLength={200}
            />
            <div className="onboard-count">{resolutionCount}/200</div>
          </div>

          <button
            className="onboard-submit"
            type="submit"
            disabled={!nicknameValid || isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "완료"}
          </button>
        </form>
      </div>
    </AuthOverlay>
  );
}
