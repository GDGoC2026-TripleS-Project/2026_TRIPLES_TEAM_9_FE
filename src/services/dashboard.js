import { getDashboard as getDashboardApi } from "../api/dashboard.api";

export const getDashboard = (config = {}) => getDashboardApi(config);
