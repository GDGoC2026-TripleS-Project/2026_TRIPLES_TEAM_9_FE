import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignupAgreement from "./pages/auth/signup/SignupAgreement";
import Onboarding from "./pages/auth/signup/Onboarding";
import Welcome from "./pages/auth/signup/Welcome";
import OAuthCallback from "./pages/auth/OauthCallback";
import HealthCheck from "./pages/HealthCheck";
import NetworkError from "./pages/NetworkError";

import Dashboard from "./pages/dashboard/Dashboard";

const AUTH_PATHS = new Set([
  "/login",
  "/signup/agreement",
  "/signup/onboarding",
  "/signup/welcome",
]);

function AppRoutes() {
  const location = useLocation();
  const isAuthOverlay = AUTH_PATHS.has(location.pathname);

  return (
    <>
      {/* <Home />   */}
      {/* 다른 페이지 상단에 Home 페이지가 함께 렌더링되어 주석처리 */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/check" element={<HealthCheck />} />
        <Route path="/network-error" element={<NetworkError />} />

        <Route path="/login" element={null} />
        <Route path="/signup/agreement" element={null} />
        <Route path="/signup/onboarding" element={null} />
        <Route path="/signup/welcome" element={null} />

        {/* // 회원가입 후 dashboard가 보이도록 해야 됨 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isAuthOverlay && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup/agreement" element={<SignupAgreement />} />
          <Route path="/signup/onboarding" element={<Onboarding />} />
          <Route path="/signup/welcome" element={<Welcome />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
