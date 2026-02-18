export const AUTH_OVERLAY_ROUTES = [
    { path: "/login", key: "login" },
    { path: "/signup/agreement", key: "signupAgreement" },
    { path: "/signup/onboarding", key: "signupOnboarding" },
    { path: "/signup/welcome", key: "signupWelcome" },
];

export const APP_ROUTES = [
    { path: "/", key: "home" },
    { path: "/oauth/callback/:provider", key: "oauthCallback" },
    { path: "/check", key: "healthCheck" },
    { path: "/network-error", key: "networkError" },
    { path: "/dashboard", key: "dashboard" },
    { path: "/records", key: "records" },
    { path: "/records/:id", key: "recordDetail" },
    { path: "/goals", key: "goals" },
    { path: "/mindmap", key: "mindmap" },
    { path: "/mypage", key: "mypage" },
    { path: "/mypage/recent", key: "mypageRecent" },
    { path: "/mypage/achievements", key: "mypageAchievements" },
    { path: "/mypage/goals", key: "mypageGoals" },
    { path: "/mypage/withdraw", key: "mypageWithdraw" },
];

const AUTH_PLACEHOLDER_ROUTES = AUTH_OVERLAY_ROUTES.map((route) => ({
    path: route.path,
    key: "authPlaceholder",
}));

export const BASE_ROUTES = [...APP_ROUTES, ...AUTH_PLACEHOLDER_ROUTES];
export const AUTH_PATHS = new Set(AUTH_OVERLAY_ROUTES.map((route) => route.path));
