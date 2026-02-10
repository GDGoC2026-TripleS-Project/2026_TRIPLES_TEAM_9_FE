import api from "./axios";

export const getDashboard = async (config = {}) => {
  const response = await api.get("/dashboard", config);
  const payload = response?.data;

  if (!payload || typeof payload !== "object") {
    throw new Error("대시보드 응답 형식이 올바르지 않습니다");
  }

  if (payload.success === false) {
    throw new Error(payload.message || "대시보드 데이터를 불러오지 못했습니다");
  }

  return payload.data;
};

export const getDashboardSummary = () => api.get("/dashboard");
export const getDashboardMonthly = () => api.get("/dashboard/monthly");
