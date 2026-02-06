import { ArrowLeft } from "lucide-react";
import "../../styles/StudyRecord/StudyRecordHeader.css";
import "../../styles/global.css";

const StudyRecordHeader = ({ onAddClick }) => {
    return (
        <header className="StudyRecordHeader">
            <div className="study-record-container header-inner">
                <div className="header-left">
                    <button className="icon-btn" type="button" aria-label="뒤로가기">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="header-title">학습 기록</h1>
                </div>
                <button className="add-btn" type="button" onClick={onAddClick}>
                    + 새 기록
                </button>
            </div>
        </header>
    );
};

export default StudyRecordHeader;
