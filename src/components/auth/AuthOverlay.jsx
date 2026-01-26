import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthOverlay.css";

export default function AuthOverlay({ children, closeTo = "/", variant = "lg" }) {
  const navigate = useNavigate();

  const close = useCallback(() => {
    navigate(closeTo, { replace: true });
  }, [navigate, closeTo]);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [close]);

  return (
    <div
      className={`auth-overlay auth-overlay--${variant}`}
      onClick={close}
      role="presentation"
    >
      <div
        className={`auth-modal auth-modal--${variant}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="auth-close" onClick={close} type="button" aria-label="닫기">
          ✕
        </button>
        <div className="auth-body">{children}</div>
      </div>
    </div>
  );
}
