import checkIcon from "../../assets/goals/check.svg";

export default function TaskRow({ task, onToggle, onDelete, pendingTaskIds }) {
    const pending = pendingTaskIds.has(task.taskId);

    return (
        <li className="goal-taskitem">
            <label className="task-left">
                <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={pending}
                    onChange={() => onToggle(task.taskId)}
                />
                <span className="checkbox" aria-hidden="true">
                    <img src={checkIcon} alt="" className="checkbox-icon" />
                </span>
                <span className={task.completed ? "is-done" : ""}>{task.content}</span>
            </label>

            <button
                type="button"
                className="task-delete-btn"
                onClick={() => {
                    if (!window.confirm("과제를 삭제할까요?")) return;
                    onDelete(task.taskId);
                }}
            >
                ❌
            </button>
        </li>
    );
}
