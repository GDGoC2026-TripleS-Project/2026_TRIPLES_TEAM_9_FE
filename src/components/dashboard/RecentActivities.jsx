import "../../styles/dashboard/RecentStudyList.css";
import "../../styles/dashboard/StudyItem.css";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
    if (!value) return "";
    const normalized = String(value).replaceAll("-", ".");
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(normalized)) return normalized;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
};

const RecentActivities = ({ items = [], isEmpty = false }) => {
    const navigate = useNavigate();
    const sortedItems = [...items].sort((a, b) => {
        const left = new Date(a.learningDate).getTime();
        const right = new Date(b.learningDate).getTime();
        return right - left;
    });

    return (
        <section className="recent-study-section">
            <div className="section-header">
                <h3>최근 학습 활동</h3>
            </div>

            {isEmpty ? (
                <p className="recent-empty">아직 기록이 없습니다</p>
            ) : (
                <div className="study-list">
                    {sortedItems.map((item) => {
                        const keywords = Array.isArray(item.keywords) ? item.keywords : [];
                        const visibleKeywords = keywords.slice(0, 3);
                        const remainCount = Math.max(0, keywords.length - 3);

                        return (
                            <button
                                type="button"
                                className="study-item study-item--clickable"
                                key={item.recordId}
                                onClick={() => navigate(`/records/${item.recordId}`)}
                            >
                                <div className="study-item-content">
                                    <h4>{item.title}</h4>
                                    <div className="study-keywords">
                                        {visibleKeywords.map((keyword, index) => (
                                            <span
                                                className="study-keyword-chip"
                                                key={`${item.recordId}-${keyword}-${index}`}
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                        {remainCount > 0 && (
                                            <span className="study-keyword-chip study-keyword-chip--more">
                                                +{remainCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="study-date">{formatDate(item.learningDate)}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default RecentActivities;
