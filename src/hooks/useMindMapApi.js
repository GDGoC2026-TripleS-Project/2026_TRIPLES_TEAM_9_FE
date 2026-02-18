import { useCallback, useEffect, useMemo, useState } from "react";
import { getMindMap, normalizeMindMapParams } from "../api/mindmap.api";

export const useMindMapQuery = (initialParams = {}) => {
    const [params, setParams] = useState(() => normalizeMindMapParams(initialParams));
    const [data, setData] = useState({
        nodes: [],
        edges: [],
        raw: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(
        async (nextParams) => {
            const resolved = normalizeMindMapParams(nextParams ?? params);
            setLoading(true);
            setError(null);

            try {
                const response = await getMindMap(resolved);
                setData(response);
                return response;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
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
                typeof updater === "function"
                    ? normalizeMindMapParams(updater(prev))
                    : normalizeMindMapParams(updater);
            return next;
        });
    }, []);

    return useMemo(
        () => ({
            data,
            nodes: data.nodes,
            edges: data.edges,
            loading,
            error,
            params,
            setParams: updateParams,
            refetch,
        }),
        [data, loading, error, params, updateParams, refetch],
    );
};
