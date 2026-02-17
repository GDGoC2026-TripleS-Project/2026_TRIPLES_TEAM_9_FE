const MindMapCard = ({ title, date }) => {
    return (
        <article className="mindmap-card">
            <h3 className="mindmap-card-title">{title}</h3>
            <span className="mindmap-card-date">{date}</span>
        </article>
    );
};

export default MindMapCard;
