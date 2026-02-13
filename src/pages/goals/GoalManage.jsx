import Header from "../../components/common/Header";
import GoalCard from "../../components/goals/GoalCard";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import { useState, useEffect } from "react";
import "../../styles/goals/GoalManage.css";

const PAGE_SIZE = 4;

const initialGoals = [
    {
        id: crypto.randomUUID(),
        title: "파이썬 기초 완주",
        tasks: [
            { id: crypto.randomUUID(), text: "파이썬 기초 코딩하기", done: true },
            { id: crypto.randomUUID(), text: "파이썬 기초 코딩하기", done: false },
            { id: crypto.randomUUID(), text: "파이썬 기초 코딩하기", done: false },
            { id: crypto.randomUUID(), text: "파이썬 기초 코딩하기", done: false },
        ],
        collapsed: false,
    },
    {
        id: crypto.randomUUID(),
        title: "트리플에스 목표",
        tasks: [],
        collapsed: true,
    },
];

const GoalManage = () => {
    const [goals, setGoals] = useState(initialGoals);
    const { page, setPage, totalPages, currentItems, canPrev, canNext, onPrev, onNext, goToPage } =
        usePagination(goals, PAGE_SIZE);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages, setPage]);

    const onAddGoal = () => {
        const newGoal = {
            id: crypto.randomUUID(),
            title: "목표 제목",
            tasks: [],
            collapsed: false,
        };
        setGoals((prev) => [...prev, newGoal]);
    };

    const onDeleteGoal = (goalId) => {
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    };

    const onAddTask = (goalId, text) => {
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id !== goalId) return goal;

                return {
                    ...goal,
                    tasks: [...goal.tasks, { id: crypto.randomUUID(), text, done: false }],
                };
            }),
        );
    };

    const onDeleteTask = (goalId, taskId) => {
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id !== goalId) return goal;
                return {
                    ...goal,
                    tasks: goal.tasks.filter((task) => task.id !== taskId),
                };
            }),
        );
    };

    const onToggleTask = (goalId, taskId) => {
        setGoals((prev) =>
            prev.map((goal) =>
                goal.id === goalId
                    ? {
                          ...goal,
                          tasks: goal.tasks.map((task) =>
                              task.id === taskId ? { ...task, done: !task.done } : task,
                          ),
                      }
                    : goal,
            ),
        );
    };

    const onToggleCollapsed = (goalId) => {
        setGoals((prev) =>
            prev.map((goal) =>
                goal.id === goalId ? { ...goal, collapsed: !goal.collapsed } : goal,
            ),
        );
    };
    return (
        <div className="goal-manage-page">
            <Header
                variant="goals"
                addLabel="새 목표 추가"
                title="목표 관리"
                subtitle="목표를 설정하고 세부 과제를 추가하여 진행 상황을 추적하세요."
                onAdd={onAddGoal}
            />
            <main className="goals-list">
                {currentItems.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onDeleteGoal={() => onDeleteGoal(goal.id)}
                        onAddTask={(text) => onAddTask(goal.id, text)}
                        onDeleteTask={(taskId) => onDeleteTask(goal.id, taskId)}
                        onToggleTask={(taskId) => onToggleTask(goal.id, taskId)}
                        onToggleCollapsed={() => onToggleCollapsed(goal.id)}
                    />
                ))}
            </main>

            <div className="goals-pagination">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={onPrev}
                    onNext={onNext}
                    goToPage={goToPage}
                />
            </div>
        </div>
    );
};

export default GoalManage;
