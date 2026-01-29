import HeaderDashboard from "../../components/dashboard/HeaderDashboard";
import DashboardCard from "../../components/dashboard/DashboardCard";
import RecentStudyList from "../../components/dashboard/RecentStudyList";
import CategoryProgress from "../../components/dashboard/CategoryProgress";
import DashboardActions from "../../components/dashboard/DashboardActions";

import "../../styles/Dashboard/Dashboard.css";
import "../../styles/global.css";

import { BookOpen } from "lucide-react";

const cards = [
    {
        title: "총 학습 기록",
        value: 0,
        icon: BookOpen,
        tone: "record",
    },
    {
        title: "보유 키워드",
        value: 0,
        icon: BookOpen,
        tone: "keyword",
    },
    {
        title: "업적",
        value: 0,
        icon: BookOpen,
        tone: "achievement",
    },
    {
        title: "카테고리",
        value: 0,
        icon: BookOpen,
        tone: "category",
    },
];

const Dashboard = () => {
    return (
        <div>
            <HeaderDashboard />
            <main className="dashboard">
                <div className="container">
                    <h2>김규빈님의 지식정원에 오신 것을 환영합니다!</h2>
                    <p>새로운 학습을 기록하고 당신의 성장을 시각화해보세요.</p>

                    <button className="add-study-record-btn">+ 새 학습 기록 작성</button>

                    <section className="dashboard-cards">
                        {cards.map((item) => (
                            <DashboardCard
                                key={item.title}
                                title={item.title}
                                value={item.value}
                                icon={item.icon}
                                tone={item.tone}
                            />
                        ))}
                    </section>
                    <section className="recent-study-list">
                        <RecentStudyList />
                        <aside className="dashboard-right">
                            <CategoryProgress />
                            <DashboardActions />
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
