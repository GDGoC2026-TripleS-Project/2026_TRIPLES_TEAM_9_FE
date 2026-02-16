import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: "0 16px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 920,
          display: "flex",
          gap: 40,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            border: "5px solid #ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <div
            style={{
              width: 52,
              height: 7,
              background: "#ef4444",
              transform: "rotate(45deg)",
              borderRadius: 999,
            }}
          />
        </div>

        <div style={{ flex: "0 1 560px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            원하시는 페이지를 찾을 수 없습니다.
          </h1>

          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              color: "#4b5563",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            입력한 주소가 잘못되었거나 현재 페이지를 사용하실 수 없습니다.
            <br />
            주소가 정확한지 다시 한번 확인해주세요.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 22px",
                background: "#2563eb",
                color: "#fff",
                border: 0,
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              이전으로
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "12px 22px",
                background: "#2563eb",
                color: "#fff",
                border: 0,
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              홈으로
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
