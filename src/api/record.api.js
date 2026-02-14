import api from "./axios";
import { normalizeApiError, unwrapApiResponse } from "./api-response";

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} [success]
 * @property {string|number} [code]
 * @property {string} [message]
 * @property {T} [data]
 */

/**
 * @typedef {Object} RecordCreateRequest
 * @property {string} [title]
 * @property {string} [contentMd]
 * @property {string} [content]
 * @property {string} [category]
 * @property {string[]} [keywords]
 * @property {string} [learningDate]
 */

/**
 * @typedef {Object} RecordUpdateRequest
 * @property {string} [title]
 * @property {string} [contentMd]
 * @property {string} [content]
 * @property {string} [category]
 * @property {string[]} [keywords]
 * @property {string} [learningDate]
 */

/**
 * @typedef {Object} RecordListParams
 * @property {number} [page]
 * @property {number} [size]
 * @property {string} [from]
 * @property {string} [to]
 * @property {string} [category]
 * @property {string} [keyword]
 * @property {string} [sort]
 */

/**
 * @typedef {Object} RecordSummary
 * @property {number|string} [recordId]
 * @property {number|string} [id]
 * @property {string} [title]
 * @property {string} [contentMd]
 * @property {string} [preview]
 * @property {string} [content]
 * @property {string} [category]
 * @property {string} [learningDate]
 * @property {string[]} [keywords]
 */

/**
 * @typedef {Object} RecordDetail
 * @property {number|string} [recordId]
 * @property {number|string} [id]
 * @property {string} [title]
 * @property {string} [contentMd]
 * @property {string} [content]
 * @property {string} [category]
 * @property {string[]} [keywords]
 * @property {string} [learningDate]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} RecordListResponse
 * @property {RecordSummary[]} items
 * @property {number} page
 * @property {number} size
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {boolean} hasNext
 * @property {boolean} hasPrev
 * @property {any} raw
 */

const readListArray = (value) => {
    if (!value) return null;
    if (Array.isArray(value)) return value;
    if (typeof value !== "object") return null;

    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.records)) return value.records;
    if (Array.isArray(value.list)) return value.list;
    if (Array.isArray(value.content)) return value.content;
    return null;
};

const resolveListPayload = (payload) => {
    const candidates = [
        payload,
        payload?.data,
        payload?.result,
        payload?.records,
        payload?.list,
        payload?.page,
        payload?.payload,
    ];

    for (const candidate of candidates) {
        const items = readListArray(candidate);
        if (items) {
            const meta =
                candidate && typeof candidate === "object" && !Array.isArray(candidate)
                    ? candidate
                    : payload;
            return { items, meta };
        }
    }

    return { items: [], meta: payload };
};

const coerceNumber = (value, fallback) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeRecordListResponse = (payload, params = {}) => {
    const { items, meta } = resolveListPayload(payload);
    const springPageNumber = coerceNumber(meta?.number ?? payload?.number, NaN);
    const pageFromRequest = coerceNumber(params.page, 1);
    const pageFromMeta = coerceNumber(meta?.page ?? meta?.pageNumber ?? payload?.page, NaN);
    // UI/요청은 1-based, Spring Page.number는 0-based이므로 +1 변환
    const page = Number.isFinite(springPageNumber)
        ? Math.max(1, springPageNumber + 1)
        : Number.isFinite(pageFromMeta)
          ? Math.max(1, pageFromMeta)
          : Math.max(1, pageFromRequest);
    const size = coerceNumber(meta?.size ?? payload?.size ?? params.size ?? (items.length || 4), 4);
    const totalPages = coerceNumber(meta?.totalPages ?? meta?.pages ?? payload?.totalPages, 1);
    const totalElements = coerceNumber(
        meta?.totalElements ?? meta?.totalCount ?? meta?.count ?? meta?.total ?? payload?.totalElements,
        items.length,
    );
    const safeTotalPages = Math.max(1, totalPages);
    const hasNext = Boolean(meta?.hasNext ?? payload?.hasNext ?? page < safeTotalPages);
    const hasPrev = Boolean(meta?.hasPrev ?? payload?.hasPrev ?? page > 1);

    return {
        items,
        page,
        size,
        totalPages: safeTotalPages,
        totalElements: Math.max(items.length, totalElements),
        hasNext,
        hasPrev,
        raw: payload,
    };
};

/**
 * POST /record/create
 * @param {RecordCreateRequest} payload
 * @returns {Promise<RecordDetail|RecordSummary|any>}
 */
export const createRecord = async (payload) => {
    try {
        const response = await api.post("/record/create", payload);
        return unwrapApiResponse(response.data, "기록 생성에 실패했습니다.");
    } catch (error) {
        throw normalizeApiError(error, "기록 생성에 실패했습니다.");
    }
};

/**
 * PATCH /record/update/{recordId}
 * @param {number|string} recordId
 * @param {RecordUpdateRequest} payload
 * @returns {Promise<RecordDetail|RecordSummary|any>}
 */
export const updateRecord = async (recordId, payload) => {
    try {
        const response = await api.patch(`/record/update/${recordId}`, payload);
        return unwrapApiResponse(response.data, "기록 수정에 실패했습니다.");
    } catch (error) {
        throw normalizeApiError(error, "기록 수정에 실패했습니다.");
    }
};

/**
 * GET /record/lists
 * @param {RecordListParams} params
 * @returns {Promise<RecordListResponse>}
 */
export const getRecordList = async (params = {}) => {
    try {
        const response = await api.get("/record/lists", { params });
        const data = unwrapApiResponse(response.data, "기록 목록 조회에 실패했습니다.");
        return normalizeRecordListResponse(data, params);
    } catch (error) {
        throw normalizeApiError(error, "기록 목록 조회에 실패했습니다.");
    }
};

/**
 * GET /record/details/{recordId}
 * @param {number|string} recordId
 * @returns {Promise<RecordDetail|any>}
 */
export const getRecordDetails = async (recordId) => {
    try {
        const response = await api.get(`/record/details/${recordId}`);
        return unwrapApiResponse(response.data, "기록 상세 조회에 실패했습니다.");
    } catch (error) {
        throw normalizeApiError(error, "기록 상세 조회에 실패했습니다.");
    }
};

/**
 * DELETE /record/delete/{recordId}
 * @param {number|string} recordId
 * @returns {Promise<any>}
 */
export const deleteRecord = async (recordId) => {
    try {
        const response = await api.delete(`/record/delete/${recordId}`);
        return unwrapApiResponse(response.data, "기록 삭제에 실패했습니다.");
    } catch (error) {
        throw normalizeApiError(error, "기록 삭제에 실패했습니다.");
    }
};
