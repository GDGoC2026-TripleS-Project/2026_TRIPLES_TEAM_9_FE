import { useNavigate } from "react-router-dom";
import "../styles/NetworkError.css";

export default function NetworkError() {
  const nav = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 32px",
          borderRadius: 12,
          width: 360,
          textAlign: "center",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>네트워크 오류</h2>

        <p style={{ color: "#555", lineHeight: 1.6 }}>
          서버와 연결할 수 없습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            새로고침
          </button>

          <button
            onClick={() => nav("/", { replace: true })}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#4f6cff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
