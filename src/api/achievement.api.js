import api from "./axios";

const unwrap = (res) => {
  const body = res?.data;

  if (body && typeof body.success === "boolean" && !body.success) {
    throw new Error(body.message || "업적 조회에 실패했습니다.");
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "data")) {
    return body.data;
  }

  return body;
};

export const getAchievements = async (config = {}) => {
  const res = await api.get("/achievements", config);
  return unwrap(res);
};
