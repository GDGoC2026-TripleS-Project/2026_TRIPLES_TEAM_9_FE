import { markdownSummary } from "./markdown";

const CATEGORY_META = {
    lecture: { label: "강의", badge: "badge--blue" },
    reading: { label: "독서", badge: "badge--blue" },
    project: { label: "프로젝트", badge: "badge--blue" },
    seminar: { label: "세미나", badge: "badge--blue" },
    personal: { label: "개인학습", badge: "badge--green" },
    other: { label: "기타", badge: "badge--blue" },
};

export const formatRecordDate = (value) => {
    if (!value) return "";
    const raw = String(value).trim();

    if (raw.includes(".")) return raw;

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
};

export const normalizeCategoryValue = (value) => {
    if (!value) return "other";
    return String(value).toLowerCase();
};

export const getCategoryMeta = (value) => {
    const category = normalizeCategoryValue(value);
    return CATEGORY_META[category] ?? CATEGORY_META.other;
};

const normalizeKeywordValue = (keyword) => {
    if (typeof keyword === "string") return keyword.trim();
    if (!keyword || typeof keyword !== "object") return "";

    if (typeof keyword.name === "string") return keyword.name.trim();
    if (typeof keyword.keyword === "string") return keyword.keyword.trim();
    if (typeof keyword.word === "string") return keyword.word.trim();
    if (typeof keyword.value === "string") return keyword.value.trim();
    if (typeof keyword.label === "string") return keyword.label.trim();
    return "";
};

const unique = (items) => Array.from(new Set(items.filter(Boolean)));

export const extractKeywords = (record) => {
    const candidates = [
        record?.keywords,
        record?.keywordList,
        record?.keywordNames,
        record?.tags,
        record?.tagList,
    ];

    const listCandidate = candidates.find((value) => Array.isArray(value));
    if (Array.isArray(listCandidate)) {
        return unique(listCandidate.map(normalizeKeywordValue));
    }

    const textCandidate =
        typeof record?.keywords === "string"
            ? record.keywords
            : typeof record?.keyword === "string"
              ? record.keyword
              : typeof record?.tags === "string"
                ? record.tags
                : typeof record?.tag === "string"
                  ? record.tag
                  : "";

    if (textCandidate) {
        return unique(
            textCandidate
                .split(",")
                .map((word) => word.trim())
                .filter(Boolean),
        );
    }

    return [];
};

export const toRecordListItem = (record) => {
    const categoryValue = normalizeCategoryValue(record?.category ?? record?.categoryValue);
    const meta = getCategoryMeta(categoryValue);
    const keywords = extractKeywords(record);
    const markdownContent =
        record?.contentMd ?? record?.content_markdown ?? record?.content ?? record?.description ?? "";

    return {
        id: record?.recordId ?? record?.id ?? Date.now(),
        title: record?.title ?? "제목 없음",
        categoryLabel: meta.label,
        categoryValue,
        date: formatRecordDate(record?.learningDate ?? record?.date ?? record?.createdAt),
        description: record?.preview ?? markdownSummary(markdownContent),
        tag: keywords[0] ?? record?.tag ?? "-",
        categoryBadge: meta.badge,
        tagBadge: "badge--blue",
        keywords,
        contentMd: markdownContent,
        raw: record,
    };
};

export const toRecordDetailItem = (record) => {
    const mapped = toRecordListItem(record);
    return {
        ...mapped,
        content: record?.content ?? record?.contentMd ?? mapped.contentMd ?? mapped.description,
        contentMd:
            record?.contentMd ??
            record?.content_markdown ??
            record?.content ??
            mapped.contentMd ??
            mapped.description,
    };
};

export const buildRecordCreatePayload = (form) => {
    const keywords = Array.isArray(form?.keywords)
        ? form.keywords.filter((word) => typeof word === "string" && word.trim())
        : [];

    return {
        title: form?.title?.trim() || "",
        contentMd: form?.content?.trim() || "",
        content: form?.content?.trim() || "",
        category: normalizeCategoryValue(form?.category).toUpperCase(),
        keywords,
        learningDate: form?.date || undefined,
    };
};
