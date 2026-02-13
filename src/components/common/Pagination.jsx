import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/common/Pagination.css";

const Pagination = ({ page, totalPages, canPrev, canNext, onPrev, onNext, goToPage }) => {
    return (
        <div className="pagination">
            <button type="button" className="page-btn" onClick={onPrev} disabled={!canPrev}>
                <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`page-number ${p === page ? "active" : ""}`}
                    onClick={() => goToPage(p)}
                >
                    {p}
                </button>
            ))}

            <button type="button" className="page-btn" onClick={onNext} disabled={!canNext}>
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
