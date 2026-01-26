import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import OAuthCallback from "./pages/auth/OauthCallback";
import SignupAgreement from "./pages/auth/signup/SignupAgreement";
import Onboarding from "./pages/auth/signup/Onboarding";
import Welcome from "./pages/auth/signup/Welecome";

import Home from "./pages/home/Home";
import HealthCheck from "./pages/HealthCheck";
import NetworkError from "./pages/NetworkError";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 약관 */}
        <Route path="/signup/agreement" element={<SignupAgreement />} />

        {/* 회원가입(닉네임) */}
        <Route path="/signup/onboarding" element={<Onboarding />} />

        {/* 환영 화면 */}
        <Route path="/signup/welcome" element={<Welcome />} />

        {/* OAuth 콜백 */}
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />

        {/* 헬스체크 */}
        <Route path="/check" element={<HealthCheck />} />

        {/* 네트워크 장애 */}
        <Route path="/network-error" element={<NetworkError />} />

        {/* 없는 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
