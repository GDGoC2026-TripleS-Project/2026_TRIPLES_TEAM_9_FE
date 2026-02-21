const MindMapCard = ({ title, metaText, onClick }) => {
    return (
        <article
            className={`mindmap-card ${onClick ? "mindmap-card--clickable" : ""}`}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick}
            onKeyDown={
                onClick
                    ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onClick();
                          }
                      }
                    : undefined
            }
        >
            <h3 className="mindmap-card-title">{title}</h3>
            <span className="mindmap-card-meta">{metaText}</span>
        </article>
    );
};

export default MindMapCard;
