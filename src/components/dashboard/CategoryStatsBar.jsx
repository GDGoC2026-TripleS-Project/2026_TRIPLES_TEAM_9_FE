import "../../styles/dashboard/CategoryProgress.css";

const CATEGORY_LABELS = {
    LECTURE: "Lecture",
    STUDY: "study",
    PROJECT: "project",
};

const CategoryStatsBar = ({ items = [] }) => {
    const sortedItems = [...items].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    const maxCount = sortedItems.reduce((max, item) => Math.max(max, item.count ?? 0), 0);

    return (
        <section className="category-card">
            <h3 className="category-card__title">카테고리별 학습량</h3>

            <ul className="category-card__list">
                {sortedItems.map((item, index) => {
                    const count = item.count ?? 0;
                    const widthPercent = maxCount === 0 ? 0 : (count / maxCount) * 100;

                    return (
                        <li className="category-row" key={`${item.category}-${index}`}>
                            <div className="category-row__top">
                                <span className="category-row__name">
                                    {CATEGORY_LABELS[item.category] ?? item.category}
                                </span>
                                <span className="category-row__value">{count}</span>
                            </div>

                            <div className="category-row__bar">
                                <div
                                    className="category-row__fill"
                                    style={{ width: `${widthPercent}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default CategoryStatsBar;
