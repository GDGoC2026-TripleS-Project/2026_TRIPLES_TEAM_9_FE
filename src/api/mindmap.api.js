import api from "./axios";
import { normalizeApiError, unwrapApiResponse } from "./api-response";

export const CATEGORY_MAP = {
    lecture: "LECTURE",
    reading: "READING",
    project: "PROJECT",
    seminar: "SEMINAR",
    personal: "PERSONAL",
    other: "OTHER",
};

const parseInteger = (value, fallback) => {
    if (value === undefined || value === null || value === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
};

const toDateString = (value) => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return undefined;
};

export const normalizeMindMapParams = (params = {}) => {
    const categoryRaw = params.category ?? params.categoryKey;
    const category =
        !categoryRaw || categoryRaw === "all"
            ? undefined
            : CATEGORY_MAP[String(categoryRaw).toLowerCase()] ?? String(categoryRaw).toUpperCase();

    const normalized = {
        ...(toDateString(params.from) ? { from: toDateString(params.from) } : {}),
        ...(toDateString(params.to) ? { to: toDateString(params.to) } : {}),
        ...(category ? { category } : {}),
        topKeywords: Math.max(1, parseInteger(params.topKeywords, 30)),
        minEdgeWeight: Math.max(1, parseInteger(params.minEdgeWeight, 2)),
    };

    return normalized;
};

const normalizeNodes = (nodes) => {
    if (!Array.isArray(nodes)) return [];
    return nodes
        .map((node, index) => {
            const id = node?.id ?? node?.keywordId ?? index;
            const label = node?.label ?? node?.name ?? node?.keyword ?? "";
            const weight = parseInteger(node?.weight ?? node?.count, 1);

            if (!label) return null;

            return {
                id,
                label: String(label),
                weight: Math.max(1, weight),
                raw: node,
            };
        })
        .filter(Boolean);
};

const normalizeEdges = (edges) => {
    if (!Array.isArray(edges)) return [];
    return edges
        .map((edge) => {
            const source = edge?.source ?? edge?.from;
            const target = edge?.target ?? edge?.to;
            if (source === undefined || target === undefined) return null;

            return {
                source,
                target,
                weight: Math.max(1, parseInteger(edge?.weight ?? edge?.count, 1)),
                raw: edge,
            };
        })
        .filter(Boolean);
};

export const getMindMap = async (params = {}) => {
    const query = normalizeMindMapParams(params);

    try {
        if (import.meta.env.DEV) {
            console.debug("[mindmap] GET /mindmap", query);
        }

        const response = await api.get("/mindmap", { params: query });
        const payload = unwrapApiResponse(response.data, "마인드맵 조회에 실패했습니다.");

        const nodes = normalizeNodes(payload?.nodes);
        const edges = normalizeEdges(payload?.edges);

        return {
            nodes,
            edges,
            raw: payload,
        };
    } catch (error) {
        throw normalizeApiError(error, "마인드맵 조회에 실패했습니다.");
    }
};
