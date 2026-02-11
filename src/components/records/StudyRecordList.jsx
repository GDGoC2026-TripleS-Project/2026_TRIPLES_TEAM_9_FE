import { ChevronLeft, ChevronRight } from "lucide-react";
import StudyRecordCard from "./StudyRecordCard";
import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import usePagination from "../../hooks/usePagination";

const PAGE_SIZE = 4;

const StudyRecordList = ({ records = [] }) => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "all";

    const filteredRecords = useMemo(() => {
        if (category === "all") return records;
        return records.filter((r) => r.categoryValue === category);
    }, [category, records]);

    const { page, setPage, totalPages, currentItems, canPrev, canNext, onPrev, onNext, goToPage } =
        usePagination(filteredRecords, PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [category, setPage]);

    return (
        <div className="record-list-wrapper">
            <div className="record-list">
                {currentItems.map((record) => (
                    <StudyRecordCard key={record.id} record={record} />
                ))}
            </div>

            <div className="record-pagination">
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
        </div>
    );
};

export default StudyRecordList;
