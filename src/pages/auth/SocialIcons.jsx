export function KakaoIcon({ size = 18 }) {
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
            {/* K */}
            <path
                d="M10.2 8.4h1.4v2.3l1.9-2.3h1.7l-2.2 2.6 2.3 3h-1.7l-1.5-2-.5.6v1.4h-1.4V8.4z"
                fill="#FEE500"
            />
        </svg>
    );
}

export function NaverIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            {/* 네이버 그린 */}
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#03C75A" />
            {/* N */}
            <path
                d="M8.2 17V7h2l3.6 5.2V7h2V17h-2l-3.6-5.2V17h-2z"
                fill="#FFFFFF"
            />
        </svg>
    );
}

export function GoogleIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ display: "block" }}
        >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}
