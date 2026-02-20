import StudyRecordCard from "./StudyRecordCard";
import LoadingState from "../common/LoadingState";
import Pagination from "../common/Pagination";

const StudyRecordList = ({
    records = [],
    page = 1,
    totalPages = 1,
    onPageChange,
    isLoading = false,
}) => {
    const visibleTotalPages = Math.max(1, Number(totalPages) || 1);
    const hasRecords = records.length > 0;

    return (
        <div className="record-list-wrapper">
            <div className="record-list">
                {isLoading && (
                    <LoadingState
                        title="학습 기록을 불러오는 중입니다"
                        description="최근에 작성한 기록을 정리하고 있어요."
                        className="record-loading-state"
                    />
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
                {!isLoading &&
                    records.map((record) => (
                        <StudyRecordCard key={record.id} record={record} />
                    ))}
            </div>

            {!isLoading && (
                <Pagination
                    page={page}
                    totalPages={visibleTotalPages}
                    onPageChange={onPageChange}
                    className="record-pagination"
                />
            )}
        </div>
    );
};

export default StudyRecordList;
