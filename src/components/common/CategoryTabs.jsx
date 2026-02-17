import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
    { label: "강의", value: "lecture" },
    { label: "독서", value: "reading" },
    { label: "프로젝트", value: "project" },
    { label: "세미나", value: "seminar" },
    { label: "개인학습", value: "personal" },
    { label: "기타", value: "other" },
];

const ALL_CATEGORY = { label: "모두", value: "all" };

const CategoryTabs = ({ showAll = true }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabs = showAll ? [ALL_CATEGORY, ...CATEGORIES] : CATEGORIES;

    const fallback = tabs[0]?.value ?? "";
    const activeTab = searchParams.get("category") ?? fallback;

    const onSelect = (value) => {
        const next = new URLSearchParams(searchParams);

        if (showAll && value === "all") {
            next.delete("category");
        } else {
            next.set("category", value);
        }
        next.delete("page");
        setSearchParams(next);
    };

    return (
        <div className="record-tabs">
            {tabs.map(({ label, value }) => (
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
