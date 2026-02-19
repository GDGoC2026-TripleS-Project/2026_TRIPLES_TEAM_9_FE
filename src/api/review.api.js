import api from "./axios";

export const getTodayReview = async () => {
  const res = await api.get("/review/today");
  return res.data;
};

export const postViewedBatch = async (recordIds = []) => {
  const res = await api.post("/review/viewed/batch", { recordIds });
  return res.data;
};

