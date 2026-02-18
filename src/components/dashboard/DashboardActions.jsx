import "../../styles/Dashboard/DashboardActions.css";
import { useNavigate } from "react-router-dom";

const DashboardActions = () => {
    const navigate = useNavigate();

    return (
        <section className="dashboard-actions">
            <button 
            className="action-btn action-btn--gradient"
            type="button"
            onClick={() => navigate("/mindmap")}
            >마인드맵 보기</button>

            <button
                className="action-btn action-btn--outline"
                type="button"
                onClick={() => navigate("/records")}
            >
                모든 기록 조회
            </button>

            <button
                className="action-btn action-btn--outline"
                type="button"
                onClick={() => navigate("/goals")}
            >
                목표 관리
            </button>
        </section>
    );
};

export default DashboardActions;
