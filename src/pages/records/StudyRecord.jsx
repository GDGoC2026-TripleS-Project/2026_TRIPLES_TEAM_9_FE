import Header from "../../components/common/Header";
import CategoryTabs from "../../components/common/CategoryTabs";
import StudyRecordList from "../../components/records/StudyRecordList";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import "../../styles/records/StudyRecord.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const mindMapCollectSeqRef = useRef(0);
    const [mindMapCollectedRecords, setMindMapCollectedRecords] = useState([]);
    const [isMindMapCollecting, setIsMindMapCollecting] = useState(false);

    const category = searchParams.get("category") ?? "";
    const source = searchParams.get("from") ?? "";
    const isMindMapSearch = source === "mindmap";
    const searchKeyword = (searchParams.get("search") ?? "").trim();
    const shouldOpenCreate = searchParams.get("create") === "1";
    const normalizedKeyword = searchKeyword.toLowerCase();
    const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchKeyword));
    const [searchInput, setSearchInput] = useState(searchKeyword);
    const apiCategory = category ? category.toUpperCase() : undefined;
    const uiPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const apiPage = isMindMapSearch && normalizedKeyword ? 1 : uiPage;
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

    const matchesKeyword = useCallback((item) => {
        if (!normalizedKeyword) return true;
        const titleText = String(item?.title ?? "").toLowerCase();
        const tagText = String(item?.tag ?? "").toLowerCase();
        const keywordList = Array.isArray(item?.keywords)
            ? item.keywords.map((keyword) =>
                  String(keyword ?? "")
                      .trim()
                      .toLowerCase(),
              )
            : [];

        if (isMindMapSearch) {
            return tagText === normalizedKeyword || keywordList.includes(normalizedKeyword);
        }

        const keywordText = keywordList.join(" ");

        return (
            titleText.includes(normalizedKeyword) ||
            tagText.includes(normalizedKeyword) ||
            keywordText.includes(normalizedKeyword)
        );
    }, [normalizedKeyword, isMindMapSearch]);

    const records = useMemo(() => {
        const mapped = recordItems.map((item) => toRecordListItem(item));
        if (!normalizedKeyword) return mapped;
        return mapped.filter(matchesKeyword);
    }, [recordItems, normalizedKeyword, isMindMapSearch]);

    useEffect(() => {
        if (!isMindMapSearch || !normalizedKeyword) {
            setMindMapCollectedRecords([]);
            setIsMindMapCollecting(false);
            return;
        }

        let cancelled = false;
        const requestSeq = ++mindMapCollectSeqRef.current;

        const getItems = (pageData) => {
            if (Array.isArray(pageData?.items)) return pageData.items;
            if (Array.isArray(pageData?.content)) return pageData.content;
            return [];
        };

        const collect = async () => {
            setIsMindMapCollecting(true);
            try {
                const firstPage = await getRecordList({
                    page: 1,
                    size,
                    category: apiCategory,
                    keyword: searchKeyword,
                });
                if (cancelled || mindMapCollectSeqRef.current !== requestSeq) return;

                const totalPages = Math.max(1, Number(firstPage?.totalPages ?? 1) || 1);
                const allItems = [...getItems(firstPage)];

                for (let nextPage = 2; nextPage <= totalPages; nextPage += 1) {
                    const nextPageData = await getRecordList({
                        page: nextPage,
                        size,
                        category: apiCategory,
                        keyword: searchKeyword,
                    });
                    if (cancelled || mindMapCollectSeqRef.current !== requestSeq) return;
                    allItems.push(...getItems(nextPageData));
                }

                const filtered = allItems
                    .map((item) => toRecordListItem(item))
                    .filter(matchesKeyword);

                if (cancelled || mindMapCollectSeqRef.current !== requestSeq) return;
                setMindMapCollectedRecords(filtered);
            } catch {
                if (cancelled || mindMapCollectSeqRef.current !== requestSeq) return;
                setMindMapCollectedRecords([]);
            } finally {
                if (cancelled || mindMapCollectSeqRef.current !== requestSeq) return;
                setIsMindMapCollecting(false);
            }
        };

        collect();
        return () => {
            cancelled = true;
        };
    }, [isMindMapSearch, normalizedKeyword, apiCategory, size, searchKeyword, matchesKeyword]);

    const effectiveTotalPages = useMemo(() => {
        if (isMindMapSearch && normalizedKeyword) {
            return Math.max(1, Math.ceil(mindMapCollectedRecords.length / size));
        }
        return Math.max(1, Number(recordListData.totalPages) || 1);
    }, [isMindMapSearch, normalizedKeyword, mindMapCollectedRecords.length, size, recordListData.totalPages]);

    const effectivePage = Math.min(Math.max(1, uiPage), effectiveTotalPages);

    const displayedRecords = useMemo(() => {
        if (!(isMindMapSearch && normalizedKeyword)) return records;
        const start = (effectivePage - 1) * size;
        return mindMapCollectedRecords.slice(start, start + size);
    }, [isMindMapSearch, normalizedKeyword, records, effectivePage, size, mindMapCollectedRecords]);

    useEffect(() => {
        if (!(isMindMapSearch && normalizedKeyword)) return;
        if (uiPage === effectivePage) return;
        const next = new URLSearchParams(searchParams);
        next.set("page", String(effectivePage));
        setSearchParams(next, { replace: true });
    }, [isMindMapSearch, normalizedKeyword, uiPage, effectivePage, searchParams, setSearchParams]);

    useEffect(() => {
        if (isMindMapSearch) return;
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
        isMindMapSearch,
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
        const clampedUiPage = Math.min(Math.max(1, nextPage), effectiveTotalPages);
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
        } else {
            next.delete("search");
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
                            records={displayedRecords}
                            page={effectivePage}
                            totalPages={effectiveTotalPages}
                            onPageChange={onPageChange}
                            isLoading={
                                isMindMapSearch && normalizedKeyword
                                    ? isMindMapCollecting
                                    : isRecordListLoading
                            }
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
