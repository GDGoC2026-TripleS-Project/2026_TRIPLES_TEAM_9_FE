import api from "./axios";

const unwrap = (res) => {
  const body = res?.data;
  if (!body?.success) {
    throw new Error(body?.message || "요청 실패");
  }
  return body.data;
};

export async function fetchGoals(page = 0) {
  const res = await api.get("/goals/lists", { params: { page } });
  return unwrap(res);
}

export async function createGoal({ title }) {
  const res = await api.post("/goals/create", { title });
  return unwrap(res);
}

export async function deleteGoal(goalId) {
  const res = await api.delete(`/goals/delete/${goalId}`);
  return unwrap(res);
}

export async function fetchTasks(goalId) {
  const res = await api.get(`/goals/lists/${goalId}/task`);
  return unwrap(res);
}

export async function createTask(goalId, { content }) {
  const res = await api.post(`/goals/create/${goalId}/task`, { content });
  return unwrap(res);
}

export async function toggleTask(goalId, taskId) {
  const res = await api.patch(`/goals/${goalId}/task/${taskId}/checkbox`);
  return unwrap(res);
}

export async function deleteTask(goalId, taskId) {
  const res = await api.delete(`/goals/delete/${goalId}/task/${taskId}`);
  return unwrap(res);
}

