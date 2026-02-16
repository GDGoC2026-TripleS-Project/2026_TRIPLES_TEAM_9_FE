import { getGoalPercent } from "./types";

export default function GoalCard({ goal, onDelete, deleting = false }) {
  const percent = getGoalPercent(goal);

  return (
    <article className="goal-card">
      <button
        className="goal-delete-btn"
        type="button"
        onClick={() => onDelete?.(goal.id)}
        disabled={deleting}
        aria-label={`${goal.title} 삭제`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM6 9h2v8H6V9Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <h3 className="goal-title">{goal.title}</h3>
      <p className="goal-count">
        {goal.done} / {goal.total} 완료
      </p>

      <div className="goal-progress-area">
        <div className="goal-progress-head">
          <span className="goal-progress-label">진행률</span>
          <span className="goal-percent">{percent}%</span>
        </div>
        <div className="goal-progress-track">
          <div className="goal-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </article>
  );
}
