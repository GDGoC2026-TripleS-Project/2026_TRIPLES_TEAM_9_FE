import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import OAuthCallback from "./pages/auth/OauthCallback";
import HealthCheck from "./pages/HealthCheck";

import Home from "./pages/home/home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<HealthCheck />} />
      </Routes>
    </BrowserRouter>
  );
}