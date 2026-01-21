export default function KakaoIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <path
                d="M12 4C6.9 4 3 7.05 3 10.9c0 2.46 1.68 4.64 4.24 5.86l-.7 2.57c-.08.29.24.53.5.38l3.02-1.78c.63.09 1.28.14 1.94.14 5.1 0 9-3.05 9-6.9S17.1 4 12 4z"
                fill="#000000"
            />

            <path
                d="M10.2 8.4h1.4v2.3l1.9-2.3h1.7l-2.2 2.6 2.3 3h-1.7l-1.5-2-.5.6v1.4h-1.4V8.4z"
                fill="#FEE500"
            />
        </svg>
    );
}