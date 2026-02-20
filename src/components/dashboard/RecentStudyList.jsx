import StudyItem from "./StudyItem";
import "../../styles/dashboard/RecentStudyList.css";

const studies = [
    {
        id: 1,
        title: "학습한 내용 제목",
        category: "키워드",
        date: new Date(),
    },
    {
        id: 2,
        title: "트리플에스 프로젝트",
        category: "project",
        keyword: "figma",
        date: new Date(),
    },
    {
        id: 3,
        title: "트리플에스 프로젝트",
        category: "project",
        keyword: "figma",
        date: new Date(),
    },
    {
        id: 4,
        title: "트리플에스 프로젝트",
        category: "project",
        keyword: "figma",
        date: new Date(),
    },
];

const RecentStudyList = () => {
    return (
        <section className="recent-study-section">
            <div className="section-header">
                <h3>최근 학습 활동 </h3>
                <p>모두 보기</p>
            </div>
            <div className="study-list">
                {studies.map((item) => (
                    <StudyItem key={item.id} {...item} />
                ))}
            </div>
        </section>
    );
};

export default RecentStudyList;
