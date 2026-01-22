export default function NaverIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#03C75A" />
            <path
                d="M8.2 17V7h2l3.6 5.2V7h2V17h-2l-3.6-5.2V17h-2z"
                fill="#FFFFFF"
            />
        </svg>
    );
}