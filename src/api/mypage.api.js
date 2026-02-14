import api from "./axios";

export const getMyProfile = () => api.get("/mypage");
export const getUserInfo = () => api.get("/mypage/info");
export const updateMyProfile = (data) => api.patch("/mypage/profile", data);
export const deleteMyAccount = () => api.delete("/mypage/delete");
export const getMyPageRecent = (size = 5) =>
  api.get("/mypage/activities/recent", { params: { size } });
export const getMyGoals = () => api.get("/mypage/goals");
export const deleteMyGoal = (id) => api.delete(`/mypage/goals/${id}`);
