import Header from "../../components/common/Header";
import CategoryTabs from "../../components/common/CategoryTabs";
import StudyRecordList from "../../components/records/StudyRecordList";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import "../../styles/records/StudyRecord.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateRecordMutation, useRecordListQuery } from "../../hooks/useRecordApi";
import { buildRecordCreatePayload, toRecordListItem } from "../../utils/recordView";
import { getApiErrorMessage } from "../../api/api-response";
import { getRecordList } from "../../api/record.api";

const StudyRecord = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const autoLocateKeyRef = useRef("");

    const category = searchParams.get("category") ?? "";
    const searchKeyword = (searchParams.get("search") ?? searchParams.get("keyword") ?? "").trim();
    const shouldOpenCreate = searchParams.get("create") === "1";
    const normalizedKeyword = searchKeyword.toLowerCase();
    const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchKeyword));
    const [searchInput, setSearchInput] = useState(searchKeyword);
    const apiCategory = category ? category.toUpperCase() : undefined;
    const uiPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    // UI와 API 요청 page 모두 1-based를 사용합니다.
    const apiPage = uiPage;
    const size = Math.max(1, Number(searchParams.get("size") ?? 4) || 4);

    const recordListQuery = useRecordListQuery({
        page: apiPage,
        size,
        category: apiCategory,
        keyword: searchKeyword,
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
            keyword: searchKeyword,
        }));
    }, [apiCategory, apiPage, searchKeyword, setRecordListParams, size]);

    const createRecordMutation = useCreateRecordMutation({
        onSuccess: async () => {
            await refetchRecordList();
            setIsCreateOpen(false);
        },
    });

    useEffect(() => {
        if (!shouldOpenCreate) return;

        setIsCreateOpen(true);
        const next = new URLSearchParams(searchParams);
        next.delete("create");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams, shouldOpenCreate]);

    const matchesKeyword = (item) => {
        if (!normalizedKeyword) return true;
        const titleText = String(item?.title ?? "").toLowerCase();
        return titleText.includes(normalizedKeyword);
    };

    const records = useMemo(() => {
        const mapped = recordItems.map((item) => toRecordListItem(item));
        if (!normalizedKeyword) return mapped;
        return mapped.filter(matchesKeyword);
    }, [recordItems, normalizedKeyword]);

    useEffect(() => {
        const autoLocateKey = `${apiCategory ?? "all"}|${normalizedKeyword}`;
        if (!normalizedKeyword || searchParams.has("page")) {
            autoLocateKeyRef.current = "";
            return;
        }
        if (isRecordListLoading || recordListError) return;
        if (records.length > 0) {
            autoLocateKeyRef.current = autoLocateKey;
            return;
        }
        if (autoLocateKeyRef.current === autoLocateKey) return;

        autoLocateKeyRef.current = autoLocateKey;
        const totalPages = Math.max(1, Number(recordListData.totalPages) || 1);
        if (totalPages <= 1) return;

        let cancelled = false;
        const locate = async () => {
            for (let nextPage = 2; nextPage <= totalPages; nextPage += 1) {
                try {
                    const pageData = await getRecordList({
                        page: nextPage,
                        size,
                        category: apiCategory,
                        keyword: searchKeyword,
                    });
                    const pageItems = (pageData?.items ?? []).map((item) => toRecordListItem(item));
                    if (pageItems.some(matchesKeyword)) {
                        if (cancelled) return;
                        const next = new URLSearchParams(searchParams);
                        next.set("page", String(nextPage));
                        setSearchParams(next, { replace: true });
                        return;
                    }
                } catch {
                    return;
                }
            }
        };

        locate();
        return () => {
            cancelled = true;
        };
    }, [
        apiCategory,
        isRecordListLoading,
        searchKeyword,
        normalizedKeyword,
        recordListData.totalPages,
        recordListError,
        records,
        searchParams,
        setSearchParams,
        size,
    ]);

    useEffect(() => {
        setSearchInput(searchKeyword);
        if (searchKeyword) {
            setIsSearchOpen(true);
        }
    }, [searchKeyword]);

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

    const onSearchSubmit = (event) => {
        event.preventDefault();
        const normalized = searchInput.trim();
        const next = new URLSearchParams(searchParams);
        if (normalized) {
            next.set("search", normalized);
            next.delete("keyword");
        } else {
            next.delete("search");
            next.delete("keyword");
        }
        next.delete("page");
        setSearchParams(next);
    };

    return (
        <div className="study-record-page">
            <Header
                variant="records"
                title="학습 기록"
                showBack
                onBack={() => navigate("/dashboard")}
                onAdd={() => setIsCreateOpen(true)}
            />
            <main className="study-record-main">
                <div className="record-layout">
                    <section className="record-content">
                        <div className="record-toolbar">
                            <CategoryTabs showAll />
                            <div className="record-search-box">
                                {isSearchOpen && (
                                    <form className="record-search-form" onSubmit={onSearchSubmit}>
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(event) => setSearchInput(event.target.value)}
                                            placeholder="제목 검색"
                                            aria-label="제목 검색"
                                        />
                                        <button type="submit">검색</button>
                                    </form>
                                )}
                                <button
                                    type="button"
                                    className="record-search-toggle"
                                    aria-label="검색창 열기"
                                    onClick={() => setIsSearchOpen((prev) => !prev)}
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>
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
