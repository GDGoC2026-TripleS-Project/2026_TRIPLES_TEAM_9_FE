import { ChevronLeft, ChevronRight } from "lucide-react";
import StudyRecordCard from "./StudyRecordCard";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 4;

const StudyRecordList = ({ records = [] }) => {
    const [page, setPage] = useState(1);

    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "all";

    useEffect(() => {
        setPage(1);
    }, [category]);

    const filteredRecords = useMemo(() => {
        if (category === "all") return records;
        return records.filter((r) => r.categoryValue === category);
    }, [category, records]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE)),
        [filteredRecords],
    );

    const currentRecords = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = page * PAGE_SIZE;
        return filteredRecords.slice(start, end);
    }, [filteredRecords, page]);

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

    return (
        <div className="record-list-wrapper">
            <div className="record-list">
                {currentRecords.map((record) => (
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
