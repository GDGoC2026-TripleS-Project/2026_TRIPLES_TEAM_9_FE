import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    createRecord,
    deleteRecord,
    getRecordDetails,
    getRecordList,
    updateRecord,
} from "../api/record.api";
import { normalizeApiError } from "../api/api-response";

const toFiniteNumber = (value, fallback) => {
    if (value === undefined || value === null || value === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeListParams = (params) => ({
    page: Math.max(1, toFiniteNumber(params?.page, 1)),
    size: Math.max(1, toFiniteNumber(params?.size, 4)),
    ...(params?.from ? { from: params.from } : {}),
    ...(params?.to ? { to: params.to } : {}),
    ...(params?.category ? { category: params.category } : {}),
    ...(params?.keyword ? { keyword: params.keyword } : {}),
    ...(params?.sort ? { sort: params.sort } : {}),
});

export const useRecordListQuery = (initialParams = { page: 1, size: 4 }) => {
    const [params, setParams] = useState(() => normalizeListParams(initialParams));
    const [data, setData] = useState({
        items: [],
        page: 1,
        size: 4,
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
        hasPrev: false,
        raw: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestSeqRef = useRef(0);

    const refetch = useCallback(
        async (nextParams) => {
            const resolvedParams = normalizeListParams(nextParams ?? params);
            const requestSeq = requestSeqRef.current + 1;
            requestSeqRef.current = requestSeq;
            setLoading(true);
            setError(null);
            try {
                const response = await getRecordList(resolvedParams);
                if (requestSeqRef.current !== requestSeq) return null;
                setData(response);
                return response;
            } catch (err) {
                const normalized = normalizeApiError(err, "기록 목록 조회에 실패했습니다.");
                if (requestSeqRef.current !== requestSeq) return null;
                setError(normalized);
                throw normalized;
            } finally {
                if (requestSeqRef.current !== requestSeq) return;
                setLoading(false);
            }
        },
        [params],
    );

    useEffect(() => {
        refetch().catch(() => undefined);
    }, [refetch]);

    const updateParams = useCallback((updater) => {
        setParams((prev) => {
            const next =
                typeof updater === "function" ? normalizeListParams(updater(prev)) : normalizeListParams(updater);
            return next;
        });
    }, []);

    return useMemo(
        () => ({
            data,
            items: data.items,
            loading,
            error,
            params,
            setParams: updateParams,
            refetch,
        }),
        [data, error, loading, params, refetch, updateParams],
    );
};

export const useRecordDetailsQuery = (recordId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(recordId));
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        if (!recordId) return null;
        setLoading(true);
        setError(null);
        try {
            const response = await getRecordDetails(recordId);
            setData(response);
            return response;
        } catch (err) {
            const normalized = normalizeApiError(err, "기록 상세 조회에 실패했습니다.");
            setError(normalized);
            throw normalized;
        } finally {
            setLoading(false);
        }
    }, [recordId]);

    useEffect(() => {
        if (!recordId) return;
        refetch().catch(() => undefined);
    }, [recordId, refetch]);

    return { data, loading, error, refetch };
};

const useRecordMutation = (executor, options = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutateAsync = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await executor(...args);
                await options.onSuccess?.(response, ...args);
                return response;
            } catch (err) {
                const normalized = normalizeApiError(err, "요청 처리 중 오류가 발생했습니다.");
                setError(normalized);
                await options.onError?.(normalized, ...args);
                throw normalized;
            } finally {
                setLoading(false);
            }
        },
        [executor, options],
    );

    return { mutateAsync, loading, error };
};

export const useCreateRecordMutation = (options) => useRecordMutation(createRecord, options);

export const useUpdateRecordMutation = (options) =>
    useRecordMutation((recordId, payload) => updateRecord(recordId, payload), options);

export const useDeleteRecordMutation = (options) =>
    useRecordMutation((recordId) => deleteRecord(recordId), options);
