import { Plus, X } from "lucide-react";
import trash from "../../assets/records/detail/trash.svg";
import check from "../../assets/goals/check.svg";
import addCheck from "../../assets/goals/addcheck.svg";
import { useState, useMemo } from "react";
import "../../styles/goals/GoalCard.css";

const GoalCard = ({
    goal,
    showAddedNotice,
    onDeleteGoal,
    onAddTask,
    onDeleteTask,
    onToggleTask,
    onToggleCollapsed,
}) => {
    const { totalTaskCount, doneTaskCount, percent } = useMemo(() => {
        const total = goal.tasks.length;
        const done = goal.tasks.filter((task) => task.done).length;
        const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
        return { totalTaskCount: total, doneTaskCount: done, percent: pct };
    }, [goal.tasks]);

    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        onAddTask(newTask);
        setNewTask("");
    };

    return (
        <div className="goal-card">
            <div className="goal-header">
                <div className="goal-header-text">
                    <h3 className="goal-title">{goal.title}</h3>
                    <p className="goal-progress-text">
                        {doneTaskCount} / {totalTaskCount} 완료
                    </p>
                </div>
                <button type="button" className="goal-delete-btn" onClick={onDeleteGoal}>
                    <img src={trash} width={12} height={15} alt="삭제" />
                </button>
            </div>
            <div className="goal-progress">
                <p className="goal-progress-label">진행률</p>
                <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
                </div>
            </div>

            {!goal.collapsed ? (
                <>
                    {goal.tasks.length > 0 && (
                        <ul className="goal-tasklist">
                            {goal.tasks.map((task) => (
                                <li key={task.id} className="goal-taskitem">
                                    <div className="task-left">
                                        <input
                                            id={`task-${task.id}`}
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => onToggleTask(task.id)}
                                        />
                                        <label htmlFor={`task-${task.id}`} className="checkbox">
                                            {task.done && (
                                                <img src={check} alt="checked" size={10} />
                                            )}
                                        </label>
                                        <span className={task.done ? "is-done" : ""}>
                                            {task.text}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="task-delete-btn"
                                        onClick={() => onDeleteTask(task.id)}
                                    >
                                        <X
                                            className="icon-x"
                                            size={16}
                                            strokeWidth={4}
                                            color="red"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <form className="goal-addtask" onSubmit={handleAddTask}>
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="새 과제 추가"
                        />
                        <button type="submit">
                            <Plus size={20} strokeWidth={2} color="white" />
                        </button>
                    </form>
                    <button type="button" className="goal-toggle-btn" onClick={onToggleCollapsed}>
                        세부 과제 닫기
                    </button>
                </>
            ) : (
                <button type="button" className="goal-toggle-btn" onClick={onToggleCollapsed}>
                    세부 과제 보기
                </button>
            )}

            {showAddedNotice && (
                <div className="card-toast">
                    <img src={addCheck} alt="" className="toast-icon" />
                    <span>목표가 추가되었습니다.</span>
                </div>
            )}
        </div>
    );
};

export default GoalCard;
