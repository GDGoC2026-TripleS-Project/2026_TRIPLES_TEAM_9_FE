const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

export async function submitOnboarding({ authToken, payload }) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(`${BASE}/auth/onboarding`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ authToken, ...payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text || "온보딩 실패");
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  return json.data ?? json;
}
