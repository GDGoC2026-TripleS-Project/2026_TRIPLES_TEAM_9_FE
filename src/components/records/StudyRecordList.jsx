import StudyRecordCard from "./StudyRecordCard";
import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import Pagination from "../common/Pagination";

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
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={onPrev}
                    onNext={onNext}
                    goToPage={goToPage}
                />
            </div>
        </div>
    );
};

export default StudyRecordList;
