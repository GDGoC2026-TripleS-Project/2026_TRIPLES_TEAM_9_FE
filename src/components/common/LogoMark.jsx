import { useId } from "react";

const LogoMark = ({ className = "", size = 32, color = "#111" }) => {
  const maskId = useId();

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 30 33"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="33">
          <rect x="0.833" y="0.833" width="28.334" height="31.667" rx="4.167" fill="white" />
          <rect x="10.417" y="10.417" width="13.333" height="3.333" rx="1.667" fill="black" />
          <rect x="3.333" y="24.167" width="25.833" height="3.333" rx="1.667" fill="black" />
        </mask>
      </defs>
      <rect
        x="0.833"
        y="0.833"
        width="28.334"
        height="31.667"
        rx="4.167"
        fill={color}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
};

export default LogoMark;
