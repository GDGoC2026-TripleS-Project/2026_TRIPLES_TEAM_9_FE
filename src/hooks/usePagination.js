import { useState, useMemo } from "react";

const usePagination = (items, PAGE_SIZE) => {
    const [page, setPage] = useState(1);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
        [items, PAGE_SIZE],
    );

    const currentItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = page * PAGE_SIZE;
        return items.slice(start, end);
    }, [items, page, PAGE_SIZE]);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const onPrev = () => {
        if (!canPrev) return;
        setPage((p) => p - 1);
    };

    const onNext = () => {
        if (!canNext) return;
        setPage((p) => p + 1);
    };

    const goToPage = (p) => setPage(p);

    return { page, setPage, totalPages, currentItems, canPrev, canNext, onPrev, onNext, goToPage };
};

export default usePagination;
