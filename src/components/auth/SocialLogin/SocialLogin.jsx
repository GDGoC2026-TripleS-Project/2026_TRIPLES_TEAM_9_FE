import SocialButton from "./SocialButton";
import "./social.css";

const PROVIDERS = [
  { id: "kakao", label: "카카오로 시작하기" },
  { id: "google", label: "구글로 시작하기" },
  { id: "naver", label: "네이버로 시작하기" },
];

export default function SocialLogin({ onSocial }) {
  return (
    <div className="social-wrap">
      {PROVIDERS.map(({ id, label }) => (
        <SocialButton
          key={id}
          provider={id}
          label={label}
          onClick={() => onSocial(id)}
        />
      ))}
    </div>
  );
}
