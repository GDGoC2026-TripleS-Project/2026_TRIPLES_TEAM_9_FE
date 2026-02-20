import Header from "../../components/common/Header";
import LoadingState from "../../components/common/LoadingState";
import GoalCard from "../../components/goals/GoalCard";
import GoalCreateModal from "../../components/goals/GoalCreateModal";
import useGoals from "../../hooks/useGoals";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../../styles/goals/GoalManage.css";

const GoalManage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const from = location.state?.from;
        if (from === "mypage-goals") {
            navigate("/mypage/goals");
            return;
        }
        navigate("/dashboard");
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const [createOpen, setCreateOpen] = useState(false);
    const skipInitialUrlSyncRef = useRef(searchParams.has("page"));
    const keywordFromUrl = (searchParams.get("search") ?? searchParams.get("keyword") ?? "").trim();
    const [keywordInput, setKeywordInput] = useState(keywordFromUrl);
    const [isSearchOpen, setIsSearchOpen] = useState(Boolean(keywordFromUrl));
    const requestedUiPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
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
        openTasks,
        closeTasks,
        createNewGoal,
        removeGoal,
        addTask,
        removeTask,
        toggleTaskCompleted,
    } = useGoals(requestedUiPage - 1, keywordFromUrl);

    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    const setPageParam = (nextUiPage, replace = false) => {
        const clampedUiPage = Math.min(Math.max(1, nextUiPage), Math.max(1, totalPages));
        const next = new URLSearchParams(searchParams);
        next.set("page", String(clampedUiPage));
        setSearchParams(next, { replace });
    };

    const onSearchSubmit = (event) => {
        event.preventDefault();
        const normalizedKeyword = keywordInput.trim().toLowerCase();
        const next = new URLSearchParams(searchParams);
        if (normalizedKeyword) {
            next.set("search", normalizedKeyword);
            next.delete("keyword");
        } else {
            next.delete("search");
            next.delete("keyword");
        }
        next.set("page", "1");
        setSearchParams(next);
    };

    useEffect(() => {
        if (skipInitialUrlSyncRef.current) {
            skipInitialUrlSyncRef.current = false;
            return;
        }
        const resolvedUiPage = page + 1;
        if (Number(searchParams.get("page")) === resolvedUiPage) return;
        setPageParam(resolvedUiPage, true);
    }, [page, searchParams, setSearchParams, totalPages]);

    useEffect(() => {
        setKeywordInput(keywordFromUrl);
        if (keywordFromUrl) {
            setIsSearchOpen(true);
        }
    }, [keywordFromUrl]);

    return (
        <div className="goal-manage-page">
            <Header
                variant="goals"
                showBack
                onBack={handleBack}
                addLabel="새 목표 추가"
                title="목표 관리"
                subtitle="목표를 설정하고 세부 과제를 추가하여 진행 상황을 추적하세요."
                onAdd={() => setCreateOpen(true)}
            />
            <main className="goals-list">
                <div className="goals-toolbar">
                    {isSearchOpen && (
                        <form className="goals-search-form" onSubmit={onSearchSubmit}>
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(event) => setKeywordInput(event.target.value)}
                                placeholder="목표 검색"
                                aria-label="목표 검색어"
                            />
                            <button type="submit">검색</button>
                        </form>
                    )}
                    <button
                        type="button"
                        className="goals-search-toggle"
                        aria-label="검색창 열기"
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                    >
                        <Search size={18} />
                    </button>
                </div>

                {loadingGoals ? (
                    <LoadingState
                        title="목표를 불러오는 중입니다"
                        description="세부 과제 정보도 함께 준비하고 있어요."
                        className="goal-empty goal-loading"
                    />
                ) : goals.length === 0 ? (
                    <section className="goal-empty-card">
                        {keywordFromUrl ? (
                            <>
                                <h3 className="goal-title">검색 결과가 없습니다</h3>
                                <p className="goal-progress-text">
                                    다른 검색어로 다시 시도해보세요.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="goal-title">아직 목표가 없습니다</h3>
                                <p className="goal-progress-text">등록된 목표가 없습니다.</p>
                                <button
                                    type="button"
                                    className="goal-toggle-btn"
                                    onClick={() => setCreateOpen(true)}
                                >
                                    + 새 목표 추가
                                </button>
                            </>
                        )}
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
                    <button type="button" onClick={() => setPageParam(page)} disabled={!canPrev}>
                        이전
                    </button>
                    <span>
                        {page + 1} / {Math.max(1, totalPages)}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPageParam(page + 2)}
                        disabled={!canNext}
                    >
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
