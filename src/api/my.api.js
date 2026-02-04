import api from "./axios";

export const getMyProfile = () => api.get("/me");
export const getUserInfo = () => api.get("/user/info");
export const updateMyProfile = (data) => api.patch("/me/profile", data);
