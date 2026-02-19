import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createGoal,
  createTask,
  deleteGoal,
  deleteTask,
  fetchGoals,
  fetchTasks,
  toggleTask,
} from "../api/goals.api";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeGoal = (goal) => {
  if (!goal || typeof goal !== "object") return null;
  const goalId = toNumber(goal.goalId ?? goal.id, NaN);
  if (!Number.isFinite(goalId)) return null;

  return {
    goalId,
    title: String(goal.title ?? goal.goalTitle ?? `목표 ${goalId}`),
    completedTaskCount: Math.max(
      0,
      toNumber(goal.completedTaskCount ?? goal.doneCount ?? goal.done, 0),
    ),
    totalTaskCount: Math.max(
      0,
      toNumber(goal.totalTaskCount ?? goal.totalCount ?? goal.total, 0),
    ),
  };
};

const normalizeTask = (task) => {
  if (!task || typeof task !== "object") return null;
  const taskId = toNumber(task.taskId ?? task.id, NaN);
  if (!Number.isFinite(taskId)) return null;

  return {
    taskId,
    content: String(task.content ?? task.text ?? ""),
    completed: Boolean(task.completed),
  };
};

export default function useGoals(initialPage = 0, initialSearch = "") {
  const [goals, setGoals] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingGoals, setLoadingGoals] = useState(false);

  const [tasksByGoalId, setTasksByGoalId] = useState({});
  const [tasksOpenByGoalId, setTasksOpenByGoalId] = useState({});
  const [tasksLoadingByGoalId, setTasksLoadingByGoalId] = useState({});
  const [pendingTaskIdsRaw, setPendingTaskIdsRaw] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const pendingTaskIds = useMemo(() => new Set(pendingTaskIdsRaw), [pendingTaskIdsRaw]);

  const setUiError = useCallback((message) => {
    setErrorMessage(message || "요청 처리 중 오류가 발생했습니다.");
  }, []);

  useEffect(() => {
    if (!errorMessage) return undefined;
    const timer = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const normalizedSearch = String(initialSearch ?? "").trim();

  const loadGoals = useCallback(async (nextPage = 0) => {
    setLoadingGoals(true);
    try {
      const pageData = await fetchGoals(nextPage, normalizedSearch);
      const content = Array.isArray(pageData?.content) ? pageData.content : [];
      setGoals(content.map(normalizeGoal).filter(Boolean));
      setPage(Math.max(0, toNumber(pageData?.number ?? nextPage, nextPage)));
      setTotalPages(Math.max(1, toNumber(pageData?.totalPages ?? 1, 1)));
    } catch (error) {
      setUiError(error?.message || "목표 목록을 불러오지 못했습니다.");
    } finally {
      setLoadingGoals(false);
    }
  }, [normalizedSearch, setUiError]);

  const refreshTasks = useCallback(async (goalId) => {
    setTasksLoadingByGoalId((prev) => ({ ...prev, [goalId]: true }));
    try {
      const data = await fetchTasks(goalId);
      const tasks = (Array.isArray(data) ? data : []).map(normalizeTask).filter(Boolean);
      setTasksByGoalId((prev) => ({ ...prev, [goalId]: tasks }));
      return tasks;
    } catch (error) {
      setUiError(error?.message || "과제 목록을 불러오지 못했습니다.");
      return [];
    } finally {
      setTasksLoadingByGoalId((prev) => ({ ...prev, [goalId]: false }));
    }
  }, [setUiError]);

  const openTasks = useCallback(async (goalId) => {
    setTasksOpenByGoalId((prev) => ({ ...prev, [goalId]: true }));
    if (tasksByGoalId[goalId]) return;
    await refreshTasks(goalId);
  }, [refreshTasks, tasksByGoalId]);

  const closeTasks = useCallback((goalId) => {
    setTasksOpenByGoalId((prev) => ({ ...prev, [goalId]: false }));
  }, []);

  const createNewGoal = useCallback(async (title) => {
    try {
      await createGoal({ title });
      await loadGoals(page);
      return true;
    } catch (error) {
      setUiError(error?.message || "목표 생성에 실패했습니다.");
      return false;
    }
  }, [loadGoals, page, setUiError]);

  const removeGoal = useCallback(async (goalId) => {
    const targetPage = goals.length === 1 && page > 0 ? page - 1 : page;
    try {
      await deleteGoal(goalId);
      await loadGoals(targetPage);
      return true;
    } catch (error) {
      setUiError(error?.message || "목표 삭제에 실패했습니다.");
      return false;
    }
  }, [goals.length, loadGoals, page, setUiError]);

  const addTask = useCallback(async (goalId, content) => {
    try {
      await createTask(goalId, { content });
      await refreshTasks(goalId);
      await loadGoals(page);
      return true;
    } catch (error) {
      setUiError(error?.message || "과제 생성에 실패했습니다.");
      return false;
    }
  }, [loadGoals, page, refreshTasks, setUiError]);

  const removeTask = useCallback(async (goalId, taskId) => {
    try {
      await deleteTask(goalId, taskId);
      await refreshTasks(goalId);
      await loadGoals(page);
      return true;
    } catch (error) {
      setUiError(error?.message || "과제 삭제에 실패했습니다.");
      return false;
    }
  }, [loadGoals, page, refreshTasks, setUiError]);

  const toggleTaskCompleted = useCallback(async (goalId, taskId) => {
    if (pendingTaskIds.has(taskId)) return;

    const before = tasksByGoalId[goalId] ?? [];
    const optimistic = before.map((task) =>
      task.taskId === taskId ? { ...task, completed: !task.completed } : task,
    );

    setPendingTaskIdsRaw((prev) => [...prev, taskId]);
    setTasksByGoalId((prev) => ({ ...prev, [goalId]: optimistic }));

    try {
      await toggleTask(goalId, taskId);
      await refreshTasks(goalId);
      await loadGoals(page);
    } catch (error) {
      setTasksByGoalId((prev) => ({ ...prev, [goalId]: before }));
      setUiError(error?.message || "과제 상태 변경에 실패했습니다.");
    } finally {
      setPendingTaskIdsRaw((prev) => prev.filter((id) => id !== taskId));
    }
  }, [loadGoals, page, pendingTaskIds, refreshTasks, setUiError, tasksByGoalId]);

  useEffect(() => {
    loadGoals(Math.max(0, toNumber(initialPage, 0)));
  }, [initialPage, loadGoals, normalizedSearch]);

  return {
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
  };
}
