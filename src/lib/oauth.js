const BACK = import.meta.env.VITE_BACKEND_BASE_URL;

export function buildAuthUrl(provider) {
  if (provider === "kakao") return `${BACK}/api/auth/kakao`;

  if (provider === "naver") return `${BACK}/api/auth/naver`;
  
  if (provider === "google") return `${BACK}/api/auth/google`;

  throw new Error(`Unknown provider: ${provider}`);
}
