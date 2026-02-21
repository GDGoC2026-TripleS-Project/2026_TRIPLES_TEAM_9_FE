import "../../styles/dashboard/DashboardCard.css";

const DashboardCard = ({ title, value, icon: Icon, tone }) => {
    return (
        <div className={`dashboard-card dashboard-card--${tone}`}>
            <div className="dashboard-card-content">
                <div className="dashboard-card-text">
                    <div className="dashboard-card-title">{title}</div>
                    <div className="dashboard-card-value">{value}</div>
                </div>
                {Icon && (
                    <div className="dashboard-card-icon">
                        <Icon className="dashboard-card-icon-svg" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
