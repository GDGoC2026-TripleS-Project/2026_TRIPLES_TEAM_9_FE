import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMyGoal, getMyGoals } from "../../api/mypage.api";
import GoalCard from "./GoalCard";
import { MOCK_GOALS } from "./types";

const USE_MOCK_GOALS = String(import.meta.env.VITE_USE_MOCK_GOALS ?? "false") === "true";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeGoal = (goal) => {
  if (!goal || typeof goal !== "object") return null;

  const id = toNumber(goal.id ?? goal.goalId, NaN);
  if (!Number.isFinite(id)) return null;

  const title =
    goal.title ??
    goal.goalTitle ??
    goal.name ??
    `목표 ${id}`;

  const done = toNumber(
    goal.done ??
      goal.doneCount ??
      goal.completedTaskCount ??
      goal.checkedTaskCount,
    0,
  );

  const total = toNumber(
    goal.total ??
      goal.totalCount ??
      goal.totalTaskCount ??
      goal.taskCount,
    0,
  );

  return {
    id,
    title: String(title),
    done: Math.max(0, done),
    total: Math.max(0, total),
  };
};

const parseGoalList = (response) => {
  const payload = response?.data?.data ?? response?.data ?? response;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
      ? payload.content
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.goals)
          ? payload.goals
          : [];

  return list.map(normalizeGoal).filter(Boolean);
};

export default function GoalList() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);

  const isDeleting = useMemo(() => new Set(deletingIds), [deletingIds]);

  const loadGoals = async () => {
    setLoading(true);
    setError("");
    try {
      if (USE_MOCK_GOALS) {
        setGoals(MOCK_GOALS);
        return;
      }

      const response = await getMyGoals(0);
      setGoals(parseGoalList(response));
    } catch {
      setError("목표 목록을 불러오지 못했습니다.");
      if (USE_MOCK_GOALS) setGoals(MOCK_GOALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleDelete = async (id) => {
    const snapshot = goals;
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setDeletingIds((prev) => [...prev, id]);

    try {
      if (!USE_MOCK_GOALS) {
        await deleteMyGoal(id);
      }
    } catch {
      setGoals(snapshot);
      setError("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeletingIds((prev) => prev.filter((goalId) => goalId !== id));
    }
  };

  if (loading) return <div className="goal-state">목표를 불러오는 중...</div>;

  return (
    <section className="goal-list-wrap">
      {error && <p className="my-error">{error}</p>}

      {goals.length === 0 ? (
        <div className="goal-empty-card">
          <div className="goal-empty-icon" aria-hidden="true">🎯</div>
          <h3 className="goal-empty-title">등록된 목표가 없습니다</h3>
          <p className="goal-empty-desc">
            목표를 설정하면 진행률과 달성 현황을 한눈에 확인할 수 있어요.
          </p>
          <button
            type="button"
            className="my-btn goal-empty-btn"
            onClick={() => navigate("/goals")}
          >
            목표 설정하기
          </button>
        </div>
      ) : (
        <div className="goal-list">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              deleting={isDeleting.has(goal.id)}
              onDelete={handleDelete}
              onOpen={() => navigate("/goals")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
