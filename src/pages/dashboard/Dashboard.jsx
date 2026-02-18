import Header from "../../components/common/Header";
import DashboardSummaryCards from "../../components/dashboard/DashboardSummaryCards";
import RecentActivities from "../../components/dashboard/RecentActivities";
import CategoryStatsBar from "../../components/dashboard/CategoryStatsBar";
import DashboardActions from "../../components/dashboard/DashboardActions";

import "../../styles/Dashboard/Dashboard.css";
import "../../styles/global.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/dashboard";
import { getAchievements } from "../../api/achievement.api";
import { getTodayReview, postViewedBatch } from "../../api/review.api";

const DEFAULT_DASHBOARD = {
    summary: {
        totalRecords: 0,
        totalKeywords: 0,
        totalCategories: 0,
        unlocked: 0,
    },
    recentActivities: [],
    categoryStats: [],
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(DEFAULT_DASHBOARD);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewItems, setReviewItems] = useState([]);
    const hasFetchedRef = useRef(false);
    const hasFetchedReviewRef = useRef(false);
    const abortRef = useRef(null);

    const fetchDashboard = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError("");

        try {
            const [dashboardData, achievementsData] = await Promise.all([
                getDashboard({ signal: controller.signal }),
                getAchievements({ signal: controller.signal }),
            ]);

            setDashboard({
                summary: {
                    ...(dashboardData?.summary ?? DEFAULT_DASHBOARD.summary),
                    unlocked: achievementsData?.summary?.unlocked ?? 0,
                },
                recentActivities: dashboardData?.recentActivities ?? [],
                categoryStats: dashboardData?.categoryStats ?? [],
            });
        } catch (e) {
            if (controller.signal.aborted) return;
            setError(e?.message || "대시보드 데이터를 불러오지 못했습니다");
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchDashboard();

        return () => {
            abortRef.current?.abort();
        };
    }, [fetchDashboard]);

    useEffect(() => {
        if (hasFetchedReviewRef.current) return;
        hasFetchedReviewRef.current = true;
        let alive = true;

        const loadTodayReview = async () => {
            try {
                const response = await getTodayReview();
                if (!alive) return;

                const data = response?.data ?? response;
                const items = Array.isArray(data?.items) ? data.items : [];
                const shouldShow = Boolean(data?.shouldShow);

                if (shouldShow && items.length > 0) {
                    setReviewItems(items.slice(0, 3));
                    setIsReviewOpen(true);
                }
            } catch {
                if (!alive) return;
                setReviewItems([]);
                setIsReviewOpen(false);
            }
        };

        loadTodayReview();
        return () => {
            alive = false;
        };
    }, []);

    const handleReviewClose = async (list = []) => {
        const recordIds = (list || [])
            .map((item) => item?.recordId)
            .filter((recordId) => recordId !== undefined && recordId !== null);

        try {
            if (recordIds.length > 0) {
                await postViewedBatch(recordIds);
            }
        } finally {
            setIsReviewOpen(false);
        }
    };

    const handleReviewOpenRecord = async (recordId) => {
        try {
            if (recordId !== undefined && recordId !== null) {
                await postViewedBatch([recordId]);
            }
        } finally {
            setIsReviewOpen(false);
            if (recordId !== undefined && recordId !== null) {
                navigate(`/records/${recordId}`);
            }
        }
    };

    const isEmptyRecords = (dashboard.summary?.totalRecords ?? 0) === 0;

    return (
        <div>
            <Header variant="dashboard" />
            <main className="dashboard">
                <div className="dashboard-container">
                    {isReviewOpen && (
                        <section className="review-inline" aria-label="오늘의 복습">
                            <button
                                type="button"
                                className="review-inline-close"
                                aria-label="복습 알림 닫기"
                                onClick={() => handleReviewClose(reviewItems)}
                            >
                                ✕
                            </button>
                            <div className="review-inline-head">
                                <div className="review-inline-title">복습시간입니다!</div>
                                <p>이전에 학습한 내용을 다시 확인해보세요.</p>
                            </div>
                            <div className="review-inline-grid">
                                {reviewItems.slice(0, 3).map((item) => (
                                    <article key={item.recordId} className="review-inline-card">
                                        <h3>{item.title}</h3>
                                        <div className="review-inline-meta">
                                            <span className="review-inline-pill">{item.categoryLabel ?? "-"}</span>
                                            <span>{item.learningDate ?? "-"}</span>
                                        </div>
                                        <p>{item.preview ?? "미리보기가 없습니다."}</p>
                                        <button
                                            type="button"
                                            className="review-inline-btn"
                                            onClick={() => handleReviewOpenRecord(item.recordId)}
                                        >
                                            상세보기
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                    <h2>{user?.nickname ?? "회원"}님의 지식정원에 오신 것을 환영합니다!</h2>
                    <p>새로운 학습을 기록하고 당신의 성장을 시각화해보세요.</p>

                    <button className="add-study-record-btn" onClick={() => window.location.href = "/records"}>+ 새 학습 기록 작성</button>

                    {loading ? (
                        <p>로딩중...</p>
                    ) : error ? (
                        <div className="dashboard-status">
                            <p>대시보드 데이터를 불러오지 못했습니다</p>
                            <button
                                type="button"
                                className="dashboard-retry-btn"
                                onClick={fetchDashboard}
                            >
                                재시도
                            </button>
                        </div>
                    ) : (
                        <>
                            <DashboardSummaryCards summary={dashboard.summary} />

                            <section className="recent-study-list">
                                <RecentActivities
                                    items={dashboard.recentActivities}
                                    isEmpty={isEmptyRecords}
                                />
                                <aside className="dashboard-right">
                                    <CategoryStatsBar items={dashboard.categoryStats} />
                                    <DashboardActions />
                                </aside>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
