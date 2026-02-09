import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import MySidebar from "../../components/mypage/MySidebar";
import "../../styles/MyPage.css";
import "../../styles/global.css";
import { getMyProfile, getUserInfo, updateMyProfile } from "../../api/mypage.api";
import { getDashboardMonthly, getDashboardSummary } from "../../api/dashboard.api";

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

const EMPTY_FORM = {
    nickname: "",
    learningGoal: "",
    learningFields: [],
    learningGoalText: "",
    resolution: "",
};

const BAR_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"];

const ROUTE_MAP = {
    "회원 정보": "/mypage",
    "최근 학습 활동": "/mypage/recent",
    "마인드맵 요약": "/mypage/mindmap",
    목표관리: "/mypage/goals",
    "회원 탈퇴": "/mypage/withdraw",
};
const MyPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("-");
    const [form, setForm] = useState(EMPTY_FORM);
    const [initialForm, setInitialForm] = useState(EMPTY_FORM);
    const [summary, setSummary] = useState({
        totalRecords: 0,
        totalKeywords: 0,
        totalCategories: 0,
    });
    const [monthly, setMonthly] = useState([]);
    const [loadingError, setLoadingError] = useState("");
    const [monthlyError, setMonthlyError] = useState("");
    const [fieldWarning, setFieldWarning] = useState("");
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const goalOptions = useMemo(() => Object.entries(LEARNING_GOAL_LABELS), []);
    const fieldOptions = useMemo(() => Object.entries(LEARNING_FIELD_LABELS), []);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            setLoadingError("");
            setMonthlyError("");
            try {
                const [meRes, infoRes, summaryRes, monthlyRes] = await Promise.allSettled([
                    getMyProfile(),
                    getUserInfo(),
                    getDashboardSummary(),
                    getDashboardMonthly(),
                ]);

                let meData = null;
                let infoData = null;

                if (meRes.status === "fulfilled") {
                    meData = meRes.value.data?.data ?? meRes.value.data;
                    console.log("[my] profile data loaded", meData);
                } else {
                    setLoadingError("프로필 정보를 불러올 수 없습니다.");
                }

                if (infoRes.status === "fulfilled") {
                    infoData = infoRes.value.data?.data ?? infoRes.value.data;
                } else {
                    setEmail("-");
                    alert("이메일 정보를 불러오지 못했습니다.");
                }

                if (!alive) return;

                const nicknameFromMe = meData?.nickname?.trim();
                const nicknameFromInfo = infoData?.nickname?.trim();
                const resolvedNickname = nicknameFromMe || nicknameFromInfo || "";

                const nextForm = {
                    nickname: resolvedNickname,
                    learningGoal: meData?.learningGoal ?? "",
                    learningFields: Array.isArray(meData?.learningFields)
                        ? meData.learningFields
                        : [],
                    learningGoalText: meData?.learningGoalText ?? "",
                    resolution: meData?.resolution ?? "",
                };

                setForm(nextForm);
                setInitialForm(nextForm);

                setEmail(infoData?.email ?? "-");

                if (summaryRes.status === "fulfilled") {
                    const s = summaryRes.value.data?.data ?? summaryRes.value.data;
                    setSummary({
                        totalRecords: s?.summary?.totalRecords ?? s?.totalRecords ?? 0,
                        totalKeywords: s?.summary?.totalKeywords ?? s?.totalKeywords ?? 0,
                        totalCategories: s?.summary?.totalCategories ?? s?.totalCategories ?? 0,
                    });
                } else {
                    setSummary({ totalRecords: 0, totalKeywords: 0, totalCategories: 0 });
                }

                if (monthlyRes.status === "fulfilled") {
                    const m = monthlyRes.value.data?.data ?? monthlyRes.value.data;
                    setMonthly(Array.isArray(m) ? m : []);
                } else {
                    setMonthly([]);
                    setMonthlyError("데이터 로딩 실패");
                }
            } catch (e) {
                if (!alive) return;
                setLoadingError("프로필 정보를 불러올 수 없습니다.");
            }
        };

        load();
        return () => {
            alive = false;
        };
    }, []);

    const setFieldValue = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleField = (value) => {
        if (!isEditing) return;
        setForm((prev) => {
            const exists = prev.learningFields.includes(value);
            if (exists) {
                setFieldWarning("");
                return {
                    ...prev,
                    learningFields: prev.learningFields.filter((item) => item !== value),
                };
            }
            if (prev.learningFields.length >= 3) {
                setFieldWarning("최대 3개까지 선택할 수 있어요.");
                return prev;
            }
            setFieldWarning("");
            return { ...prev, learningFields: [...prev.learningFields, value] };
        });
    };

    const maxFieldSelected = form.learningFields.length >= 3;

    const isDirty = () => {
        if (form.nickname.trim() !== initialForm.nickname.trim()) return true;
        if (form.learningGoal !== initialForm.learningGoal) return true;
        if (form.learningGoalText !== initialForm.learningGoalText) return true;
        if (form.resolution !== initialForm.resolution) return true;
        if (form.learningFields.length !== initialForm.learningFields.length) return true;
        for (let i = 0; i < form.learningFields.length; i += 1) {
            if (form.learningFields[i] !== initialForm.learningFields[i]) return true;
        }
        return false;
    };

    const onSave = async () => {
        if (!isEditing) return;
        try {
            setSaving(true);
            await updateMyProfile({
                nickname: form.nickname.trim(),
                learningGoal: form.learningGoal || null,
                learningFields: form.learningFields,
                learningGoalText: form.learningGoalText.trim() || null,
                resolution: form.resolution.trim() || null,
            });

            const meRes = await getMyProfile();
            const meData = meRes.data?.data ?? meRes.data;
            const refreshed = {
                nickname: meData?.nickname ?? form.nickname,
                learningGoal: meData?.learningGoal ?? form.learningGoal,
                learningFields: Array.isArray(meData?.learningFields)
                    ? meData.learningFields
                    : form.learningFields,
                learningGoalText: meData?.learningGoalText ?? form.learningGoalText,
                resolution: meData?.resolution ?? form.resolution,
            };
            setForm(refreshed);
            setInitialForm(refreshed);
            setIsEditing(false);

            try {
                const infoRes = await getUserInfo();
                const infoData = infoRes.data?.data ?? infoRes.data;
                setEmail(infoData?.email ?? "-");
            } catch (e) {
                setEmail("-");
            }
        } catch (e) {
            alert("저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        setForm(initialForm);
        setFieldWarning("");
        setIsEditing(false);
    };

    return (
        <>
            <Header variant="dashboard" />
            <main className="my-page">
                <div className="my-container">
                    <MySidebar
                        activeLabel="회원 정보"
                        onSelect={(label) => {
                            const target = ROUTE_MAP[label];
                            if (target) navigate(target);
                        }}
                    />

                    <section className="my-content">
                        <div className="my-content-header">
                            <div>
                                <h2 className="my-title">회원 정보</h2>
                                <p className="my-desc">
                                    계정과 학습 정보를 확인하고 수정할 수 있어요.
                                </p>
                            </div>
                            <button
                                className="my-link-btn"
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                대시보드로 돌아가기
                            </button>
                        </div>

                        {loadingError && <p className="my-error">{loadingError}</p>}

                        <div className="my-form">
                            <div className="my-form-header">
                                <span className="my-form-title">기본 정보</span>
                                <div className="my-actions">
                                    {!isEditing ? (
                                        <button
                                            className="my-btn"
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            수정
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="my-btn ghost"
                                                type="button"
                                                onClick={onCancel}
                                            >
                                                취소
                                            </button>
                                            <button
                                                className="my-btn"
                                                type="button"
                                                onClick={onSave}
                                                disabled={!isDirty() || saving}
                                            >
                                                {saving ? "저장 중..." : "저장"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="my-grid">
                                <div className="my-field">
                                    <label>닉네임</label>
                                    <input
                                        className="my-input"
                                        value={form.nickname}
                                        onChange={(e) => setFieldValue("nickname", e.target.value)}
                                        placeholder="닉네임"
                                        readOnly={!isEditing}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="my-field">
                                    <label>이메일</label>
                                    <input className="my-input" value={email} readOnly disabled />
                                </div>
                                <div className="my-field">
                                    <label>학습 목적</label>
                                    <div className="my-chip-grid">
                                        {goalOptions.map(([value, label]) => {
                                            const selected = form.learningGoal === value;
                                            const disabled = !isEditing;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className={`my-chip ${selected ? "is-selected" : ""}`}
                                                    onClick={() => {
                                                        console.log("[my] learningGoal click", {
                                                            value,
                                                            selected,
                                                            isEditing,
                                                        });
                                                        setFieldValue(
                                                            "learningGoal",
                                                            selected ? "" : value,
                                                        );
                                                    }}
                                                    disabled={disabled}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="my-field">
                                    <label>학습 분야 (최대 3개)</label>
                                    <div className="my-chip-grid">
                                        {fieldOptions.map(([value, label]) => {
                                            const selected = form.learningFields.includes(value);
                                            const disabled =
                                                (!selected && maxFieldSelected) || !isEditing;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className={`my-chip ${selected ? "is-selected" : ""}`}
                                                    onClick={() => toggleField(value)}
                                                    disabled={disabled}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {fieldWarning && <p className="my-hint">{fieldWarning}</p>}
                                </div>
                            </div>

                            <div className="my-field">
                                <label>학습 목적 텍스트</label>
                                <input
                                    className="my-input"
                                    value={form.learningGoalText}
                                    onChange={(e) =>
                                        setFieldValue("learningGoalText", e.target.value)
                                    }
                                    placeholder="추가 설명을 입력해주세요"
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="my-field">
                                <label>나의 다짐</label>
                                <textarea
                                    className="my-textarea"
                                    value={form.resolution}
                                    onChange={(e) => setFieldValue("resolution", e.target.value)}
                                    placeholder="나의 다짐을 적어주세요"
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="my-summary">
                            <div className="my-summary-item">
                                <strong>{summary.totalRecords}</strong>
                                <span>총 학습 기록</span>
                            </div>
                            <div className="my-summary-item">
                                <strong>{summary.totalKeywords}</strong>
                                <span>키워드</span>
                            </div>
                            <div className="my-summary-item">
                                <strong>{summary.totalCategories}</strong>
                                <span>카테고리</span>
                            </div>
                        </div>

                        <div className="my-chart">
                            <div className="my-chart-header">
                                <h3>월별 학습 기록</h3>
                            </div>
                            {monthlyError ? (
                                <p className="my-error">{monthlyError}</p>
                            ) : monthly.length === 0 ? (
                                <p className="my-empty">월별 학습 기록이 없습니다</p>
                            ) : (
                                <div className="my-bars">
                                    {monthly.map((item, index) => {
                                        const height = Math.min(item.count * 4 + 24, 180);
                                        const color = BAR_COLORS[index % BAR_COLORS.length];
                                        return (
                                            <div key={item.month} className="my-bar-item">
                                                <div className="my-bar-count">{item.count}</div>
                                                <div
                                                    className="my-bar"
                                                    style={{
                                                        height: `${height}px`,
                                                        background: color,
                                                    }}
                                                />
                                                <div className="my-bar-label">{item.month}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default MyPage;
