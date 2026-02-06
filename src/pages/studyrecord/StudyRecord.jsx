import { useState } from "react";
import StudyRecordHeader from "../../components/StudyRecord/StudyRecordHeader";
import CategoryTabs from "../../components/StudyRecord/CategoryTabs";
import StudyRecordList from "../../components/StudyRecord/StudyRecordList";
import StudyRecordCreateModal from "../../components/StudyRecord/StudyRecordCreateModal";
import "../../styles/StudyRecord/StudyRecord.css";

const StudyRecord = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="study-record-page">
            <StudyRecordHeader onAddClick={() => setIsCreateOpen(true)} />
            <main className="study-record-main">
                <div className="record-layout">
                    <aside className="record-side" aria-label="현재 선택 카테고리"></aside>
                    <section className="record-content">
                        <CategoryTabs />
                        <StudyRecordList />
                    </section>
                </div>
            </main>
            {isCreateOpen && <StudyRecordCreateModal onClose={() => setIsCreateOpen(false)} />}
        </div>
    );
};

export default StudyRecord;
