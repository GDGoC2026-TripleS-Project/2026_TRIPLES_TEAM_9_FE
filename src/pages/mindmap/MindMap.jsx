import Header from "../../components/common/Header";
import CategoryTabs from "../../components/common/CategoryTabs";
import MindMapView from "../../components/mindmap/MindMapView";
import MindMapCard from "../../components/mindmap/MindMapCard";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORY_MAP } from "../../api/mindmap.api";
import { useMindMapQuery } from "../../hooks/useMindMapApi";
import { getCategoryMeta, buildRecordCreatePayload } from "../../utils/recordView";
import { useCreateRecordMutation } from "../../hooks/useRecordApi";
import { getApiErrorMessage } from "../../api/api-response";

import "../../styles/mindmap/MindMap.css";
import search from "../../assets/mindmap/search.svg";

const MindMap = () => {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchKeywordFromUrl = (searchParams.get("search") ?? searchParams.get("keyword") ?? "").trim();
    const [keyword, setKeyword] = useState(searchKeywordFromUrl);
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    const category = searchParams.get("category") ?? "";
    const resolvedCategory = category || "lecture";
    const apiCategory = CATEGORY_MAP[resolvedCategory] ?? undefined;
    const categoryLabel = getCategoryMeta(resolvedCategory).label;

    const mindMapQuery = useMindMapQuery({
        category: apiCategory,
        topKeywords: 30,
        minEdgeWeight: 2,
    });

    const {
        nodes = [],
        edges = [],
        loading: isMindMapLoading,
        error: mindMapError,
        setParams: setMindMapParams,
        refetch: refetchMindMap,
    } = mindMapQuery;

    const createRecordMutation = useCreateRecordMutation({
        onSuccess: async () => {
            await refetchMindMap();
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

    const onSearch = (event) => {
        event.preventDefault();
        const normalizedKeyword = keyword.trim();
        const next = new URLSearchParams(searchParams);
        if (normalizedKeyword) {
            next.set("search", normalizedKeyword);
            next.delete("keyword");
        } else {
            next.delete("search");
            next.delete("keyword");
        }
        setSearchParams(next);
    };

    const onKeywordSelect = (value) => {
        const keywordText = String(value ?? "").trim();
        if (!keywordText) return;
        const params = new URLSearchParams();
        params.set("search", keywordText);
        if (resolvedCategory) {
            params.set("category", resolvedCategory);
        }
        navigate(`/records?${params.toString()}`);
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedKeyword(keyword.trim().toLowerCase());
        }, 300);

        return () => window.clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        setKeyword(searchKeywordFromUrl);
    }, [searchKeywordFromUrl]);

    const filteredNodes = useMemo(() => {
        if (!debouncedKeyword) return nodes;

        return nodes.filter((node) =>
            String(node.label ?? "")
                .toLowerCase()
                .includes(debouncedKeyword),
        );
    }, [nodes, debouncedKeyword]);

    const filteredNodeIds = useMemo(
        () => new Set(filteredNodes.map((node) => String(node.id))),
        [filteredNodes],
    );

    const filteredEdges = useMemo(
        () =>
            edges.filter(
                (edge) =>
                    filteredNodeIds.has(String(edge.source)) && filteredNodeIds.has(String(edge.target)),
            ),
        [edges, filteredNodeIds],
    );

    const detailItems = useMemo(
        () =>
            filteredNodes.map((node) => ({
                id: node.id,
                title: node.label,
                date: `연결 ${node.weight}회`,
            })),
        [filteredNodes],
    );

    const hasNoData = !isMindMapLoading && !mindMapError && nodes.length === 0;

    const hasNoSearchResult =
        !isMindMapLoading &&
        !mindMapError &&
        nodes.length > 0 &&
        debouncedKeyword &&
        filteredNodes.length === 0;

    const hasList = !isMindMapLoading && !mindMapError && detailItems.length > 0;

    useEffect(() => {
        if (!searchParams.get("category")) {
            const next = new URLSearchParams(searchParams);
            next.set("category", "lecture");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        setMindMapParams((prev) => ({
            ...prev,
            category: apiCategory,
            topKeywords: 30,
            minEdgeWeight: 2,
        }));
    }, [apiCategory, setMindMapParams]);
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
                                nodes={filteredNodes}
                                isLoading={isMindMapLoading}
                                error={mindMapError}
                                onNodeClick={(node) => onKeywordSelect(node?.label)}
                            />
                        </section>
                        <section className="mindmap-detail">
                            <header className="mindmap-detail-header">
                                <div className="mindmap-category-group">
                                    <div
                                        className={`mindmap-category-circle mindmap-category-circle--${resolvedCategory}`}
                                    ></div>
                                    <h1 className="mindmap-detail-title">카테고리 - {categoryLabel}</h1>
                                    <h2 className={"mindmap-category-count"}>
                                        키워드 {filteredNodes.length}개 · 연결선 {filteredEdges.length}개
                                    </h2>
                                </div>

                                <form className="mindmap-search" onSubmit={onSearch}>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(event) => setKeyword(event.target.value)}
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

                            {mindMapError && (
                                <p>{mindMapError.message || "마인드맵을 불러오지 못했습니다."}</p>
                            )}

                            {hasNoData && (
                                <div className="mindmap-empty-state">
                                    <div className="mindmap-empty-icon">🌱</div>
                                    <h3 className="mindmap-empty-title">등록된 학습 기록이 없습니다</h3>
                                    <p className="mindmap-empty-desc">
                                        첫 기록을 남기면 카테고리별 키워드 마인드맵이 생성됩니다.
                                    </p>
                                </div>
                            )}

                            {hasNoSearchResult && (
                                <div className="mindmap-empty-state">
                                    <div className="mindmap-empty-icon">🌱</div>
                                    <h3 className="mindmap-empty-title">검색 결과가 없습니다</h3>
                                    <p className="mindmap-empty-desc">다른 키워드로 검색해 보세요.</p>
                                </div>
                            )}

                            {hasList && (
                                <ul className="mindmap-detail-list">
                                    {detailItems.map((item) => (
                                        <li key={item.id} className="mindmap-detail-item">
                                            <MindMapCard
                                                title={item.title}
                                                date={item.date}
                                                onClick={() => onKeywordSelect(item.title)}
                                            />
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
                    initialForm={{ category: resolvedCategory }}
                />
            )}
        </div>
    );
};

export default MindMap;
