import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
    { label: "모두", value: "all" },
    { label: "강의", value: "lecture" },
    { label: "독서", value: "reading" },
    { label: "프로젝트", value: "project" },
    { label: "세미나", value: "seminar" },
    { label: "개인학습", value: "personal" },
    { label: "기타", value: "other" },
];

const CategoryTabs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("category") ?? "all";

    const onSelect = (value) => {
        const next = new URLSearchParams(searchParams);

        if (value === "all") {
            next.delete("category");
        } else {
            next.set("category", value);
        }
        next.delete("page");
        setSearchParams(next);
    };

    return (
        <div className="record-tabs">
            {CATEGORIES.map(({ label, value }) => (
                <button
                    key={value}
                    type="button"
                    className={`record-tab ${activeTab === value ? "active" : ""}`}
                    onClick={() => onSelect(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
