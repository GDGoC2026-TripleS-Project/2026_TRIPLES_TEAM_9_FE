import { ChevronLeft, ChevronRight } from "lucide-react";
import StudyRecordCard from "./StudyRecordCard";

const records = [
    {
        id: 1,
        title: "드론 비행안전법",
        category: "개인학습",
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
        category: "프로젝트",
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
        category: "개인학습",
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
        category: "강의",
        date: "2026. 1. 18",
        description:
            "마크다운 형식으로 내용을 작성하면 마크다운으로 작성된 내용에서 첫 줄만 미리 보여주고 나머지 내용은 아카이브 클릭하면 상세페이지로 넘어가서 수정 및 삭제 가능하고 기록을 볼 수 있음",
        tag: "Figma",
        categoryBadge: "badge--blue",
        tagBadge: "badge--blue",
    },
];

const StudyRecordList = () => {
    return (
        <div className="record-list-wrapper">
            <div className="record-list">
                {records.map((record) => (
                    <StudyRecordCard key={record.id} record={record} />
                ))}
            </div>

            <div className="record-pagination" role="navigation" aria-label="페이지 이동">
                <button type="button" className="page-btn" aria-label="이전 페이지">
                    <ChevronLeft size={16} />
                </button>
                <button type="button" className="page-number active">
                    1
                </button>
                <button type="button" className="page-number">
                    2
                </button>
                <button type="button" className="page-btn" aria-label="다음 페이지">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default StudyRecordList;
