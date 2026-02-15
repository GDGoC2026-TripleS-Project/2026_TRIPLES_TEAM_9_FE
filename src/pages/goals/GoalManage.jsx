import Header from "../../components/common/Header";
import GoalCard from "../../components/goals/GoalCard";
import GoalCreateModal from "../../components/goals/GoalCreateModal";
import useGoals from "../../hooks/useGoals";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/goals/GoalManage.css";

const GoalManage = () => {
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const {
        goals,
        page,
        totalPages,
        loadingGoals,
        tasksByGoalId,
        tasksOpenByGoalId,
        tasksLoadingByGoalId,
        pendingTaskIds,
        errorMessage,
        loadGoals,
        openTasks,
        closeTasks,
        createNewGoal,
        removeGoal,
        addTask,
        removeTask,
        toggleTaskCompleted,
    } = useGoals();

    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    return (
        <div className="goal-manage-page">
            <Header
                variant="goals"
                showBack
                onBack={() => navigate(-1)}
                addLabel="새 목표 추가"
                title="목표 관리"
                subtitle="목표를 설정하고 세부 과제를 추가하여 진행 상황을 추적하세요."
                onAdd={() => setCreateOpen(true)}
            />
            <main className="goals-list">
                {loadingGoals ? (
                    <div className="goal-empty">목표를 불러오는 중...</div>
                ) : goals.length === 0 ? (
                    <section className="goal-empty-card">
                        <div className="goal-header">
                            <div className="goal-header-text">
                                <h3 className="goal-title">아직 목표가 없습니다</h3>
                                <p className="goal-progress-text">0 / 0 완료</p>
                            </div>
                            <button
                                type="button"
                                className="goal-delete-btn"
                                disabled
                                aria-label="목표 삭제 비활성"
                            >
                                -
                            </button>
                        </div>
                        <div className="goal-progress">
                            <p className="goal-progress-label">진행률</p>
                            <div className="progress-bar">
                                <div className="progress-bar__fill" style={{ width: "0%" }} />
                            </div>
                        </div>
                        <button
                            type="button"
                            className="goal-toggle-btn"
                            onClick={() => setCreateOpen(true)}
                        >
                            + 새 목표 추가
                        </button>
                    </section>
                ) : (
                    goals.map((goal) => (
                        <GoalCard
                            key={goal.goalId}
                            goal={goal}
                            tasks={tasksByGoalId[goal.goalId] ?? []}
                            isOpen={Boolean(tasksOpenByGoalId[goal.goalId])}
                            loadingTasks={Boolean(tasksLoadingByGoalId[goal.goalId])}
                            pendingTaskIds={pendingTaskIds}
                            onDeleteGoal={removeGoal}
                            onOpenTasks={openTasks}
                            onCloseTasks={closeTasks}
                            onAddTask={addTask}
                            onDeleteTask={removeTask}
                            onToggleTask={toggleTaskCompleted}
                        />
                    ))
                )}

                <div className="goals-pagination">
                    <button type="button" onClick={() => loadGoals(page - 1)} disabled={!canPrev}>
                        이전
                    </button>
                    <span>
                        {page + 1} / {Math.max(1, totalPages)}
                    </span>
                    <button type="button" onClick={() => loadGoals(page + 1)} disabled={!canNext}>
                        다음
                    </button>
                </div>

                {errorMessage && <div className="goals-error-bar">{errorMessage}</div>}
            </main>

            <GoalCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={createNewGoal}
            />
        </div>
    );
};

export default GoalManage;
