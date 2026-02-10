import Header from "../../components/common/Header";
import DashboardSummaryCards from "../../components/dashboard/DashboardSummaryCards";
import RecentActivities from "../../components/dashboard/RecentActivities";
import CategoryStatsBar from "../../components/dashboard/CategoryStatsBar";
import DashboardActions from "../../components/dashboard/DashboardActions";

import "../../styles/Dashboard/Dashboard.css";
import "../../styles/global.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/dashboard";

const DEFAULT_DASHBOARD = {
    summary: {
        totalRecords: 0,
        totalKeywords: 0,
        totalCategories: 0,
    },
    recentActivities: [],
    categoryStats: [],
};

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(DEFAULT_DASHBOARD);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const hasFetchedRef = useRef(false);
    const abortRef = useRef(null);

    const fetchDashboard = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError("");

        try {
            const data = await getDashboard({ signal: controller.signal });

            setDashboard({
                summary: data?.summary ?? DEFAULT_DASHBOARD.summary,
                recentActivities: data?.recentActivities ?? [],
                categoryStats: data?.categoryStats ?? [],
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

    const isEmptyRecords = (dashboard.summary?.totalRecords ?? 0) === 0;

    return (
        <div>
            <Header variant="dashboard" />
            <main className="dashboard">
                <div className="dashboard-container">
                    <h2>{user?.nickname ?? "회원"}님의 지식정원에 오신 것을 환영합니다!</h2>
                    <p>새로운 학습을 기록하고 당신의 성장을 시각화해보세요.</p>

                    <button className="add-study-record-btn">+ 새 학습 기록 작성</button>

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
