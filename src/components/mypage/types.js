/**
 * @typedef {Object} Goal
 * @property {number} id
 * @property {string} title
 * @property {number} done
 * @property {number} total
 */

/**
 * @param {Goal} goal
 */
export const getGoalPercent = (goal) => {
  const total = Number(goal?.total ?? 0);
  const done = Number(goal?.done ?? 0);
  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(done) || done <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
};

/** @type {Goal[]} */
export const MOCK_GOALS = [
  { id: 1, title: "트리플에스 목표", done: 1, total: 4 },
  { id: 2, title: "프론트엔드 심화 학습", done: 3, total: 6 },
  { id: 3, title: "리액트 프로젝트 완주", done: 2, total: 5 },
];

