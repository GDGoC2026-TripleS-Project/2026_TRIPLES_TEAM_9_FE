const CATEGORY_LABELS = {
  PERSONAL: "개인학습",
  PROJECT: "프로젝트",
  LECTURE: "강의",
};

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
};

export default function RecentActivityCard({ item, onClick }) {
  return (
    <div className="recent-card" onClick={onClick} role="button" tabIndex={0}>
      <h3 className="recent-title">{item.title}</h3>
      <div className="recent-meta">
        <span className="recent-badge">
          {CATEGORY_LABELS[item.category] ?? item.category}
        </span>
        <span className="recent-date">{formatDate(item.learningDate)}</span>
      </div>
      <p className="recent-preview">{item.preview}</p>
      {!!item.keywords?.length && (
        <div className="recent-tags">
          {item.keywords.map((k) => (
            <span className="recent-tag" key={k}>
              {k}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
