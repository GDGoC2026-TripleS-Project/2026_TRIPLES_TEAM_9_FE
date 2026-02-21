import "../../styles/dashboard/CategoryProgress.css";

const categories = [
    { id: 1, name: "Lecture", value: 1, max: 1 },
    { id: 2, name: "study", value: 1, max: 1 },
    { id: 3, name: "study", value: 1, max: 1 },
];

const CategoryProgress = ({ items = categories }) => {
    return (
        <section className="category-card">
            <h3 className="category-card__title">카테고리별 학습량</h3>

            <ul className="category-card__list">
                {items.map((it) => {
                    const percent = it.max ? Math.min(100, (it.value / it.max) * 100) : 0;

                    return (
                        <li className="category-row" key={it.id}>
                            <div className="category-row__top">
                                <span className="category-row__name">{it.name}</span>
                                <span className="category-row__value">{it.value}</span>
                            </div>

                            <div className="category-row__bar">
                                <div
                                    className="category-row__fill"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default CategoryProgress;
