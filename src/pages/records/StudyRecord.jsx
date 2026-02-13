import Header from "../../components/common/Header";
import CategoryTabs from "../../components/records/CategoryTabs";
import StudyRecordList from "../../components/records/StudyRecordList";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import "../../styles/records/StudyRecord.css";

import { useState } from "react";

const initialRecords = [
    {
        id: 1,
        title: "드론 비행안전법",
        categoryLabel: "개인학습",
        categoryValue: "personal",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Drone",
        categoryBadge: "badge--green",
        tagBadge: "badge--blue",
    },
    {
        id: 2,
        title: "트리플에스 프로젝트",
        categoryLabel: "프로젝트",
        categoryValue: "project",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Design",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
    {
        id: 3,
        title: "파이썬 기초 공부",
        categoryLabel: "개인학습",
        categoryValue: "personal",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Python",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
    {
        id: 4,
        title: "UX/XI 디자인 잘 하는 법",
        categoryLabel: "강의",
        categoryValue: "lecture",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Figma",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
    {
        id: 5,
        title: "드론 비행안전법",
        categoryLabel: "개인학습",
        categoryValue: "personal",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Drone",
        categoryBadge: "badge--green",
        tagBadge: "badge--blue",
    },
    {
        id: 6,
        title: "트리플에스 프로젝트",
        categoryLabel: "프로젝트",
        categoryValue: "project",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Design",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
    {
        id: 7,
        title: "파이썬 기초 공부",
        categoryLabel: "개인학습",
        categoryValue: "personal",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Python",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
    {
        id: 8,
        title: "UX/XI 디자인 잘 하는 법",
        categoryLabel: "강의",
        categoryValue: "lecture",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Figma",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
];

const categoryMeta = {
    lecture: { label: "강의", badge: "badge--blue" },
    reading: { label: "독서", badge: "badge--blue" },
    project: { label: "프로젝트", badge: "badge--blue" },
    seminar: { label: "세미나", badge: "badge--blue" },
    personal: { label: "개인 학습", badge: "badge--green" },
    other: { label: "기타", badge: "badge--blue" },
};

const formatDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${year}. ${Number(month)}. ${Number(day)}`;
};

const StudyRecord = () => {
    const [isRecordAddOpen, setIsRecordAddOpen] = useState(false);
    const [records, setRecords] = useState(initialRecords);

    const onCreateSave = (payload) => {
        const meta = categoryMeta[payload.category] ?? categoryMeta.other;
        const newRecord = {
            id: Date.now(),
            title: payload.title || "제목 없음",
            categoryLabel: meta.label,
            categoryValue: payload.category || "other",
            date: formatDate(payload.date),
            description: payload.content || "",
            tag: payload.keywords[0] || "기록",
            categoryBadge: meta.badge,
            tagBadge: "badge--blue",
        };

        setRecords((prev) => [newRecord, ...prev]);
        setIsRecordAddOpen(false);
    };

    return (
        <div className="study-record-page">
            <Header
                variant="records"
                title="학습 기록"
                showBack
                onAdd={() => setIsRecordAddOpen(true)}
            />
            <main className="study-record-main">
                <div className="record-layout">
                    <section className="record-content">
                        <CategoryTabs />
                        <StudyRecordList records={records} />
                    </section>
                </div>
            </main>
            {isRecordAddOpen && (
                <StudyRecordCreateModal
                    onClose={() => setIsRecordAddOpen(false)}
                    onSave={onCreateSave}
                />
            )}
        </div>
    );
};

export default StudyRecord;
