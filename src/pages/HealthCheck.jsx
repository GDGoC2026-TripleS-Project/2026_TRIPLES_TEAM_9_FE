import { use, useEffect, useState } from "react";
import api from "../api/axios";

export default function HealthCheck() {
    const [backend, setBackend] = useState("Checking...");

    useEffect(() => {
        api.get("/api/health")
            .then(() => setBackend("UP"))
            .catch(() => setBackend("DOWN"));
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <h2>Health Check</h2>
            <p>✅ Frontend: UP</p>
            <p>
                {backend === "CHECKING" && "⏳ Backend API: CHECKING"}
                {backend === "UP" && "✅ Backend API: UP"}
                {backend === "DOWN" && "❌ Backend API: DOWN"}
            </p>
        </div>
    );
}