import "./social.css";
import GoogleIcon from "./icons/GoogleIcon";
import KakaoIcon from "./icons/KakaoIcon";
import NaverIcon from "./icons/NaverIcon";

const ICON_MAP = {
  google: GoogleIcon,
  kakao: KakaoIcon,
  naver: NaverIcon,
};

export default function SocialButton({
  provider,
  label,
  onClick,
  disabled = false,
}) {
  const Icon = ICON_MAP[provider];

  if (!Icon) return null;

  return (
    <button
      type="button"
      className={`social-btn ${provider}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className="social-icon" aria-hidden="true">
        <Icon />
      </span>

      <span className="social-text">{label}</span>
    </button>
  );
}
