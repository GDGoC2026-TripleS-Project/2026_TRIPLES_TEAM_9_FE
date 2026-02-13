import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import AuthBootstrapper from "./auth/AuthBootstrapper";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <AuthBootstrapper>
            <App />
        </AuthBootstrapper>
    </AuthProvider>,
);
