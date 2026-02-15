import StudyRecordCard from "./StudyRecordCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
 

const StudyRecordList = ({
    records = [],
    page = 1,
    totalPages = 1,
    onPageChange,
    isLoading = false,
}) => {
    const canPrev = page > 1;
    const canNext = page < totalPages;
    const clampPage = (nextPage) => Math.min(Math.max(1, nextPage), visibleTotalPages);

    const onPrev = () => {
        if (!canPrev || !onPageChange) return;
        onPageChange(clampPage(page - 1));
    };

    const onNext = () => {
        if (!canNext || !onPageChange) return;
        onPageChange(clampPage(page + 1));
    };

    const goToPage = (nextPage) => {
        if (!onPageChange) return;
        onPageChange(clampPage(nextPage));
    };

    const visibleTotalPages = Math.max(1, Number(totalPages) || 1);
    const hasRecords = records.length > 0;

    return (
        <div className="record-list-wrapper">
            <div className="record-list">
                {isLoading && (
                    <div className="record-empty-state">
                        <div className="record-empty-icon">⏳</div>
                        <h3 className="record-empty-title">학습 기록을 불러오는 중입니다</h3>
                    </div>
                )}
                {!isLoading && !hasRecords && (
                    <div className="record-empty-state">
                        <div className="record-empty-icon">🌱</div>
                        <h3 className="record-empty-title">등록된 학습 기록이 없습니다</h3>
                        <p className="record-empty-desc">
                            첫 기록을 남기면 학습 이력이 쌓이고, 키워드를 통해 복습이 쉬워집니다.
                        </p>
                    </div>
                )}
                {records.map((record) => (
                    <StudyRecordCard key={record.id} record={record} />
                ))}
            </div>

            {hasRecords && (
                <div className="record-pagination">
                    <button type="button" className="page-btn" onClick={onPrev} disabled={!canPrev}>
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: visibleTotalPages }, (_, i) => i + 1).map((p) => (
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
            )}
        </div>
    );
};

export default StudyRecordList;
