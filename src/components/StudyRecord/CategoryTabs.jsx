import { useState } from "react";

const CategoryTabs = () => {
    const tabs = ["모두", "강의", "독서", "프로젝트", "세미나", "개인 학습", "기타"];
    const [activeTab, setActiveTab] = useState("모든");

    return (
        <div className="record-tabs" role="tablist" aria-label="학습 기록 카테고리">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    className={`record-tab ${activeTab === tab ? "active" : ""}`}
                    aria-pressed={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
