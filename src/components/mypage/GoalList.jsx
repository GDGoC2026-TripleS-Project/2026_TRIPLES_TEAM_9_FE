import { useEffect, useMemo, useState } from "react";
import { deleteMyGoal, getMyGoals } from "../../api/mypage.api";
import GoalCard from "./GoalCard";
import { MOCK_GOALS } from "./types";

const USE_MOCK_GOALS = String(import.meta.env.VITE_USE_MOCK_GOALS ?? "true") === "true";

const parseGoalList = (response) => {
  const payload = response?.data?.data ?? response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.goals)) return payload.goals;
  return [];
};

export default function GoalList() {
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

      const response = await getMyGoals();
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
        <div className="goal-state">등록된 목표가 없습니다.</div>
      ) : (
        <div className="goal-list">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              deleting={isDeleting.has(goal.id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

