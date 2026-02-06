import api from "./axios";

export const getDashboardSummary = () => api.get("/dashboard");
export const getDashboardMonthly = () => api.get("/dashboard/monthly");
