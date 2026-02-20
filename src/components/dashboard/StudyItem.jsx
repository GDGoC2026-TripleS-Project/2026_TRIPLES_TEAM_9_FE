import "../../styles/dashboard/StudyItem.css";

const StudyItem = ({ title, category, keyword, date }) => {
    return (
        <div className="study-item">
            <div className="study-item-content">
                <h4>{title}</h4>
                {category && <p className="study-category">{category}</p>}
                {keyword && <p className="study-keyword">{keyword}</p>}
            </div>
            <span className="study-date">{date.toLocaleDateString()}</span>
        </div>
    );
};

export default StudyItem;
