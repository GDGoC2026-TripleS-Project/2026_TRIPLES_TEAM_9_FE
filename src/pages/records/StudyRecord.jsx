import Header from "../../components/common/Header";
import CategoryTabs from "../../components/common/CategoryTabs";
import StudyRecordList from "../../components/records/StudyRecordList";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import "../../styles/records/StudyRecord.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateRecordMutation, useRecordListQuery } from "../../hooks/useRecordApi";
import { buildRecordCreatePayload, toRecordListItem } from "../../utils/recordView";
import { getApiErrorMessage } from "../../api/api-response";

const StudyRecord = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const category = searchParams.get("category") ?? "";
    const apiCategory = category ? category.toUpperCase() : undefined;
    const uiPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    // UI와 API 요청 page 모두 1-based를 사용합니다.
    const apiPage = uiPage;
    const size = Math.max(1, Number(searchParams.get("size") ?? 4) || 4);

    const recordListQuery = useRecordListQuery({
        page: apiPage,
        size,
        category: apiCategory,
    });
    const {
        data: recordListData,
        items: recordItems,
        loading: isRecordListLoading,
        error: recordListError,
        setParams: setRecordListParams,
        refetch: refetchRecordList,
    } = recordListQuery;

    useEffect(() => {
        setRecordListParams((prev) => ({
            ...prev,
            page: apiPage,
            size,
            category: apiCategory,
        }));
    }, [apiCategory, apiPage, setRecordListParams, size]);

    const createRecordMutation = useCreateRecordMutation({
        onSuccess: async () => {
            await refetchRecordList();
            setIsCreateOpen(false);
        },
    });

    const records = useMemo(() => recordItems.map((item) => toRecordListItem(item)), [recordItems]);

    const onCreateSave = async (payload) => {
        try {
            await createRecordMutation.mutateAsync(buildRecordCreatePayload(payload));
        } catch (error) {
            alert(getApiErrorMessage(error, "기록 생성에 실패했습니다."));
        }
    };

    const onPageChange = (nextPage) => {
        const totalPages = Math.max(1, Number(recordListData.totalPages) || 1);
        const clampedUiPage = Math.min(Math.max(1, nextPage), totalPages);
        const next = new URLSearchParams(searchParams);
        next.set("page", String(clampedUiPage));
        setSearchParams(next);
    };

    return (
        <div className="study-record-page">
            <Header
                variant="records"
                title="학습 기록"
                showBack
                onBack={() => navigate(-1)}
                onAdd={() => setIsCreateOpen(true)}
            />
            <main className="study-record-main">
                <div className="record-layout">
                    <section className="record-content">
                        <CategoryTabs showAll />
                        {recordListError && (
                            <p>{recordListError.message || "기록 목록을 불러오지 못했습니다."}</p>
                        )}
                        <StudyRecordList
                            records={records}
                            page={Math.max(1, Number(recordListData.page) || 1)}
                            totalPages={recordListData.totalPages}
                            onPageChange={onPageChange}
                            isLoading={isRecordListLoading}
                        />
                    </section>
                </div>
            </main>
            {isCreateOpen && (
                <StudyRecordCreateModal
                    onClose={() => setIsCreateOpen(false)}
                    onSave={onCreateSave}
                />
            )}
        </div>
    );
};

export default StudyRecord;
