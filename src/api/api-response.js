export class ApiRequestError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = "ApiRequestError";
        this.status = options.status ?? null;
        this.code = options.code ?? null;
        this.details = options.details ?? null;
        this.isNetworkError = Boolean(options.isNetworkError);
        this.isAuthError = this.status === 401;
        this.isForbidden = this.status === 403;
        this.isValidationError = this.status === 400 || this.status === 422;
    }
}

const DEFAULT_MESSAGE = "요청 처리 중 오류가 발생했습니다.";
const NETWORK_MESSAGE = "네트워크 연결을 확인해주세요.";
const AUTH_MESSAGE = "로그인이 필요합니다.";
const FORBIDDEN_MESSAGE = "접근 권한이 없습니다.";
const INVALID_REQUEST_MESSAGE = "요청 값이 올바르지 않습니다.";
const FIELD_LABELS = {
    learningDate: "학습날짜",
    date: "학습날짜",
    category: "카테고리",
    title: "제목",
    contentMd: "내용",
    content: "내용",
    keywords: "키워드",
    keyword: "키워드",
};
const FIELD_PRIORITY = [
    "learningDate",
    "date",
    "category",
    "title",
    "contentMd",
    "content",
    "keywords",
    "keyword",
];

const readWrappedPayload = (payload) => {
    if (!payload || typeof payload !== "object") return null;
    if ("success" in payload || "data" in payload || "message" in payload || "code" in payload) {
        return payload;
    }
    return null;
};

const firstLine = (value) => {
    if (typeof value !== "string") return "";
    return value.split("\n")[0].trim();
};

const toUserMessage = (rawMessage) => {
    const oneLine = firstLine(rawMessage);
    if (!oneLine) return "";

    // Spring 기본 검증 예외 문구는 사용자에게 그대로 노출하지 않음
    if (oneLine.includes("Validation failed for argument")) {
        return INVALID_REQUEST_MESSAGE;
    }
    return oneLine;
};

export const getApiErrorMessage = (error, fallbackMessage = DEFAULT_MESSAGE) => {
    const responseData = error?.response?.data;
    const messageFromResponse = (() => {
        if (responseData && typeof responseData === "object") {
            if (typeof responseData.message === "string") {
                return responseData.message.trim();
            }
        }
        if (typeof responseData === "string") {
            return firstLine(responseData);
        }
        return "";
    })();

    if (messageFromResponse) return messageFromResponse;

    if (typeof error?.message === "string") {
        const messageFromError = firstLine(error.message);
        if (messageFromError) return messageFromError;
    }

    return fallbackMessage;
};

const getFieldErrorMessage = (payload) => {
    const errors = payload?.errors;
    if (!Array.isArray(errors) || errors.length === 0) return "";

    const first =
        FIELD_PRIORITY.map((field) =>
            errors.find((item) => item && typeof item === "object" && item.field === field),
        ).find(Boolean) ?? errors[0];
    if (!first || typeof first !== "object") return "";

    const field = typeof first.field === "string" ? first.field.trim() : "";
    const message =
        typeof first.defaultMessage === "string"
            ? first.defaultMessage.trim()
            : typeof first.message === "string"
              ? first.message.trim()
              : "";

    if (!message) return "";
    return field ? `${field}: ${message}` : message;
};

const toFriendlyValidationMessage = (message) => {
    const safe = toUserMessage(message);
    if (!safe) return "";

    let field = "";
    let detail = "";

    const separatorIndex = safe.indexOf(":");
    if (separatorIndex >= 0) {
        field = safe.slice(0, separatorIndex).trim();
        detail = safe.slice(separatorIndex + 1).trim();
    } else {
        const matchedField = Object.keys(FIELD_LABELS).find(
            (key) => safe === key || safe.startsWith(`${key} `),
        );
        if (!matchedField) return safe;
        field = matchedField;
        detail = safe.slice(matchedField.length).trim();
    }

    const label = FIELD_LABELS[field] ?? field;

    if (detail.includes("필수")) return `${label}를 입력해주세요.`;
    if (detail.includes("올바르지 않")) return `${label}이(가) 올바르지 않습니다.`;
    return `${label}: ${detail}`;
};

export const normalizeApiError = (error, fallbackMessage = DEFAULT_MESSAGE) => {
    if (error instanceof ApiRequestError) return error;

    const status = error?.response?.status ?? null;
    const rawResponseData = error?.response?.data;
    const responsePayload = readWrappedPayload(rawResponseData) ?? rawResponseData ?? {};

    const fieldErrorMessage = getFieldErrorMessage(responsePayload);
    const messageFromPayload = toUserMessage(
        fieldErrorMessage ||
            responsePayload?.message ||
            responsePayload?.error ||
            responsePayload?.detail ||
            (typeof rawResponseData === "string" ? rawResponseData : ""),
    );
    const code = responsePayload.code ?? error?.code ?? null;
    const details = responsePayload.errors ?? responsePayload.details ?? null;

    let message = messageFromPayload || fallbackMessage;
    if (!error?.response) message = NETWORK_MESSAGE;
    if (status === 401) message = AUTH_MESSAGE;
    if (status === 403) message = FORBIDDEN_MESSAGE;
    if (status === 400 || status === 422) {
        if (!messageFromPayload) {
            message = INVALID_REQUEST_MESSAGE;
        } else {
            message = toFriendlyValidationMessage(messageFromPayload);
        }
    }

    return new ApiRequestError(message, {
        status,
        code,
        details,
        isNetworkError: !error?.response,
    });
};

export const unwrapApiResponse = (payload, fallbackMessage = DEFAULT_MESSAGE) => {
    const wrappedPayload = readWrappedPayload(payload);
    if (!wrappedPayload) return payload;

    if (wrappedPayload.success === false) {
        throw new ApiRequestError(wrappedPayload.message || fallbackMessage, {
            status: null,
            code: wrappedPayload.code ?? null,
            details: wrappedPayload.errors ?? null,
        });
    }

    return "data" in wrappedPayload ? wrappedPayload.data : wrappedPayload;
};
