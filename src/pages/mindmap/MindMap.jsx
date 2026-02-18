import Header from "../../components/common/Header";
import CategoryTabs from "../../components/common/CategoryTabs";
import MindMapView from "../../components/mindmap/MindMapView";
import MindMapCard from "../../components/mindmap/MindMapCard";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecordListQuery } from "../../hooks/useRecordApi";
import { toRecordListItem, getCategoryMeta } from "../../utils/recordView";
import { useCreateRecordMutation } from "../../hooks/useRecordApi";
import { buildRecordCreatePayload } from "../../utils/recordView";
import { getApiErrorMessage } from "../../api/api-response";

import "../../styles/mindmap/MindMap.css";
import search from "../../assets/mindmap/search.svg";

const MindMap = () => {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "";
    const apiCategory = category ? category.toUpperCase() : undefined;
    const uiPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const apiPage = uiPage;
    const size = Math.max(1, Number(searchParams.get("size") ?? 4) || 4);
    const categoryLabel = getCategoryMeta(category).label;

    const recordListQuery = useRecordListQuery({
        page: apiPage,
        size,
        category: apiCategory,
    });

    const {
        items: recordItems = [],
        loading: isRecordListLoading,
        error: recordListError,
        setParams: setRecordListParams,
    } = recordListQuery;

    const items = useMemo(() => recordItems.map((item) => toRecordListItem(item)), [recordItems]);

    const createRecordMutation = useCreateRecordMutation({
        onSuccess: async () => {
            await recordListQuery.refetch();
            setIsCreateOpen(false);
        },
    });

    const onCreateSave = async (payload) => {
        try {
            await createRecordMutation.mutateAsync(buildRecordCreatePayload(payload));
        } catch (error) {
            alert(getApiErrorMessage(error, "기록 생성에 실패했습니다."));
        }
    };

    const onSearch = (e) => {
        e.preventDefault();
        setSearchKeyword(keyword);
    };

    const filteredItems = useMemo(() => {
        const q = searchKeyword.trim().toLowerCase();
        if (!q) return items;

        return items.filter((item) =>
            String(item.title ?? "")
                .toLowerCase()
                .includes(q),
        );
    }, [items, searchKeyword]);

    const hasNoData = !isRecordListLoading && !recordListError && recordItems.length === 0;

    const hasNoSearchResult =
        !isRecordListLoading &&
        !recordListError &&
        recordItems.length > 0 &&
        searchKeyword.trim() &&
        filteredItems.length === 0;

    const hasList = !isRecordListLoading && !recordListError && filteredItems.length > 0;

    useEffect(() => {
        if (!searchParams.get("category")) {
            const next = new URLSearchParams(searchParams);
            next.set("category", "lecture");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        setRecordListParams((prev) => ({
            ...prev,
            page: apiPage,
            size,
            category: apiCategory,
        }));
    }, [apiCategory, apiPage, setRecordListParams, size]);

    useEffect(() => {
        setKeyword("");
        setSearchKeyword("");
    }, [category]);

    return (
        <div className="mindmap-page">
            <Header variant="mindmap" title="마인드맵" showBack onBack={() => navigate(-1)} />
            <main className="mindmap-main">
                <div className="mindmap-content">
                    <section className="mindmap-categorybar">
                        <CategoryTabs showAll={false} />
                    </section>
                    <div className="mindmap-panels">
                        <section className="mindmap-view">
                            <MindMapView
                                items={items}
                                isLoading={isRecordListLoading}
                                error={recordListError}
                                category={category}
                            />
                        </section>
                        <section className="mindmap-detail">
                            <header className="mindmap-detail-header">
                                <div className="mindmap-category-group">
                                    <div
                                        className={`mindmap-category-circle mindmap-category-circle--${category}`}
                                    ></div>
                                    <h1 className="mindmap-detail-title">
                                        카테고리 - {categoryLabel}
                                    </h1>
                                    <h2 className={"mindmap-category-count"}>
                                        {filteredItems.length}개의 학습 기록
                                    </h2>
                                </div>

                                <form className="mindmap-search" onSubmit={onSearch}>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="키워드 검색"
                                    />
                                    <button type="submit">
                                        <img src={search} width="24" height="24" alt="search" />
                                    </button>
                                </form>
                            </header>

                            <button
                                type="button"
                                className="mindmap-add-btn"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                + 기록 추가
                            </button>

                            {recordListError && (
                                <p>
                                    {recordListError.message || "기록 목록을 불러오지 못했습니다."}
                                </p>
                            )}

                            {/* 학습 기록이 없는 경우 */}
                            {hasNoData && (
                                <div className="mindmap-empty-state">
                                    <div className="mindmap-empty-icon">🌱</div>
                                    <h3 className="mindmap-empty-title">
                                        등록된 학습 기록이 없습니다
                                    </h3>
                                    <p className="mindmap-empty-desc">
                                        첫 기록을 남기면 학습 이력이 쌓이고, 키워드를 통해 복습이
                                        쉬워집니다.
                                    </p>
                                </div>
                            )}

                            {/* 검색 결과가 없는 경우 */}
                            {hasNoSearchResult && (
                                <div className="mindmap-empty-state">
                                    <div className="mindmap-empty-icon">🌱</div>
                                    <h3 className="mindmap-empty-title">검색 결과가 없습니다</h3>
                                    <p className="mindmap-empty-desc">
                                        다른 키워드로 검색해 보세요.
                                    </p>
                                </div>
                            )}

                            {hasList && (
                                <ul className="mindmap-detail-list">
                                    {filteredItems.map((item) => (
                                        <li key={item.id} className="mindmap-detail-item">
                                            <MindMapCard title={item.title} date={item.date} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            {isCreateOpen && (
                <StudyRecordCreateModal
                    onClose={() => setIsCreateOpen(false)}
                    onSave={onCreateSave}
                    initialForm={{ category }}
                />
            )}
        </div>
    );
};

export default MindMap;
