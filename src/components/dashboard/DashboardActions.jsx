import "../../styles/Dashboard/DashboardActions.css";

const DashboardActions = () => {
    return (
        <section className="dashboard-actions">
            <button className="action-btn action-btn--gradient">마인드맵 보기</button>

            <button className="action-btn action-btn--outline">모든 기록 조회</button>

            <button className="action-btn action-btn--outline">목표 관리</button>
        </section>
    );
};

export default DashboardActions;
