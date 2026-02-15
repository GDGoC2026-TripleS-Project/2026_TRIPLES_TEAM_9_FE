import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import TaskRow from "./TaskRow";
import "../../styles/goals/GoalCard.css";

const GoalCard = ({
    goal,
    tasks = [],
    isOpen = false,
    loadingTasks = false,
    pendingTaskIds,
    onDeleteGoal,
    onOpenTasks,
    onCloseTasks,
    onAddTask,
    onDeleteTask,
    onToggleTask,
}) => {
    const percent = useMemo(() => {
        if (!goal.totalTaskCount) return 0;
        return Math.round((goal.completedTaskCount / goal.totalTaskCount) * 100);
    }, [goal.completedTaskCount, goal.totalTaskCount]);

    const [newTask, setNewTask] = useState("");

    const handleAddTask = async (event) => {
        event.preventDefault();
        const content = newTask.trim();
        if (!content) return;
        await onAddTask(goal.goalId, content);
        setNewTask("");
    };

    return (
        <article className="goal-card">
            <div className="goal-header">
                <div className="goal-header-text">
                    <h3 className="goal-title">{goal.title}</h3>
                    <p className="goal-progress-text">
                        {goal.completedTaskCount} / {goal.totalTaskCount} 완료
                    </p>
                </div>
                <button
                    type="button"
                    className="goal-delete-btn"
                    onClick={() => {
                        if (!window.confirm("목표를 삭제할까요?")) return;
                        onDeleteGoal(goal.goalId);
                    }}
                    aria-label="목표 삭제"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="goal-progress">
                <p className="goal-progress-label">진행률</p>
                <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
                </div>
                <p className="goal-percent">{percent}%</p>
            </div>

            {!isOpen ? (
                <button type="button" className="goal-toggle-btn" onClick={() => onOpenTasks(goal.goalId)}>
                    세부 과제 보기
                </button>
            ) : (
                <>
                    {loadingTasks ? (
                        <p className="goal-subtle">과제를 불러오는 중...</p>
                    ) : tasks.length > 0 ? (
                        <ul className="goal-tasklist">
                            {tasks.map((task) => (
                                <TaskRow
                                    key={task.taskId}
                                    task={task}
                                    pendingTaskIds={pendingTaskIds}
                                    onToggle={(taskId) => onToggleTask(goal.goalId, taskId)}
                                    onDelete={(taskId) => onDeleteTask(goal.goalId, taskId)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="goal-subtle">등록된 과제가 없습니다.</p>
                    )}

                    <form className="goal-addtask" onSubmit={handleAddTask}>
                        <input
                            type="text"
                            value={newTask}
                            onChange={(event) => setNewTask(event.target.value)}
                            placeholder="새 과제 추가"
                        />
                        <button type="submit" aria-label="과제 추가">
                            <Plus size={20} strokeWidth={2.4} color="white" />
                        </button>
                    </form>
                    <button type="button" className="goal-toggle-btn" onClick={() => onCloseTasks(goal.goalId)}>
                        세부 과제 닫기
                    </button>
                </>
            )}
        </article>
    );
};

export default GoalCard;
