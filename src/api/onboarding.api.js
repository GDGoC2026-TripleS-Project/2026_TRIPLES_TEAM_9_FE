const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

const firstLine = (value = "") => String(value).split("\n")[0].trim();

export async function submitOnboarding({ authToken, payload }) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(`${BASE}/auth/onboarding`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ authToken, ...payload }),
  });

  if (!res.ok) {
    let message = "온보딩 실패";
    try {
      const json = await res.json();
      if (typeof json?.message === "string" && json.message.trim()) {
        message = firstLine(json.message);
      } else if (typeof json === "string" && json.trim()) {
        message = firstLine(json);
      }
    } catch {
      const text = await res.text();
      if (text?.trim()) message = firstLine(text);
    }

    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  return json.data ?? json;
}
