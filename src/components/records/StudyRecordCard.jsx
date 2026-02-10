import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const StudyRecordCard = ({ record }) => {
    return (
        <Link className="record-card-link" to={`/records/${record.id}`} state={record}>
            <article className="record-card">
                <h3 className="record-title">{record.title}</h3>
                <div className="record-meta">
                    <span className={`badge ${record.categoryBadge}`}>{record.categoryLabel}</span>
                    <span className="record-date">
                        <Calendar size={12} />
                        {record.date}
                    </span>
                </div>
                <p className="record-desc">{record.description}</p>
                <div className="record-footer">
                    <span className={`badge badge--tag ${record.tagBadge}`}>{record.tag}</span>
                </div>
            </article>
        </Link>
    );
};

export default StudyRecordCard;
