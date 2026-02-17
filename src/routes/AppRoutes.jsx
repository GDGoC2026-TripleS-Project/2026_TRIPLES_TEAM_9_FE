import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import SignupAgreement from "../pages/auth/signup/SignupAgreement";
import Onboarding from "../pages/auth/signup/Onboarding";
import Welcome from "../pages/auth/signup/Welcome";
import OAuthCallback from "../pages/auth/OauthCallback";
import HealthCheck from "../pages/HealthCheck";
import NetworkError from "../pages/NetworkError";
import Dashboard from "../pages/dashboard/Dashboard";
import StudyRecord from "../pages/records/StudyRecord";
import StudyRecordDetail from "../pages/records/StudyRecordDetail";
import GoalManage from "../pages/goals/GoalManage";
import MindMap from "../pages/mindmap/MindMap";
import MyPage from "../pages/mypage/MyPage";
import RecentActivityPage from "../pages/mypage/RecentActivityPage";
import AchievementsPage from "../pages/mypage/AchievementsPage";
import WithdrawPage from "../pages/mypage/WithdrawPage";
import GoalManagePage from "../pages/mypage/GoalManagePage";
import NotFoundPage from "../pages/NotFoundPage";
import { AUTH_OVERLAY_ROUTES, AUTH_PATHS, BASE_ROUTES } from "./routeMap";

const ROUTE_ELEMENTS = {
    home: <Home />,
    login: <Login />,
    signupAgreement: <SignupAgreement />,
    signupOnboarding: <Onboarding />,
    signupWelcome: <Welcome />,
    oauthCallback: <OAuthCallback />,
    healthCheck: <HealthCheck />,
    networkError: <NetworkError />,
    dashboard: <Dashboard />,
    records: <StudyRecord />,
    recordDetail: <StudyRecordDetail />,
    goals: <GoalManage />,
    mindmap: <MindMap />,
    mypage: <MyPage />,
    mypageRecent: <RecentActivityPage />,
    mypageAchievements: <AchievementsPage />,
    mypageGoals: <GoalManagePage />,
    mypageWithdraw: <WithdrawPage />,
    authPlaceholder: null,
};

function renderRoutes(routeList) {
    return routeList.map((route) => (
        <Route key={route.path} path={route.path} element={ROUTE_ELEMENTS[route.key]} />
    ));
}

export default function AppRoutes() {
    const location = useLocation();
    const isAuthOverlay = AUTH_PATHS.has(location.pathname);

    return (
        <>
            <Routes>
                {renderRoutes(BASE_ROUTES)}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {isAuthOverlay && <Routes>{renderRoutes(AUTH_OVERLAY_ROUTES)}</Routes>}
        </>
    );
}
