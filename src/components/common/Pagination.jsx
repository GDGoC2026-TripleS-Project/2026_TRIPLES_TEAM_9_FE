import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/common/Pagination.css";

export default function Pagination({
    page = 1,
    totalPages = 1,
    onPageChange,
    className = "",
}) {
    const GROUP_SIZE = 5;
    const visibleTotalPages = Math.max(1, Number(totalPages) || 1);
    const currentPage = Math.min(Math.max(1, Number(page) || 1), visibleTotalPages);
    const groupStart = Math.floor((currentPage - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
    const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, visibleTotalPages);
    const canPrev = groupStart > 1;
    const canNext = groupEnd < visibleTotalPages;

    const clampPage = (nextPage) => Math.min(Math.max(1, nextPage), visibleTotalPages);

    const goPrev = () => {
        if (!canPrev || !onPageChange) return;
        onPageChange(clampPage(groupStart - GROUP_SIZE));
    };

    const goNext = () => {
        if (!canNext || !onPageChange) return;
        onPageChange(clampPage(groupEnd + 1));
    };

    const goToPage = (nextPage) => {
        if (!onPageChange) return;
        onPageChange(clampPage(nextPage));
    };

    if (visibleTotalPages <= 1) return null;

    return (
        <div className={`pagination ${className}`.trim()}>
            <button type="button" className="page-btn" onClick={goPrev} disabled={!canPrev}>
                <ChevronLeft size={16} />
            </button>

            {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`page-number ${p === currentPage ? "active" : ""}`}
                    onClick={() => goToPage(p)}
                >
                    {p}
                </button>
            ))}

            <button type="button" className="page-btn" onClick={goNext} disabled={!canNext}>
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
