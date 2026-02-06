import { X, GraduationCap, BookOpen, Cog, Users, User, MoreHorizontal, Plus } from "lucide-react";
import "../../styles/StudyRecord/StudyRecordCreateModal.css";

const categories = [
    { key: "lecture", label: "강의", icon: GraduationCap },
    { key: "reading", label: "독서", icon: BookOpen },
    { key: "project", label: "프로젝트", icon: Cog },
    { key: "seminar", label: "세미나", icon: Users },
    { key: "personal", label: "개인 학습", icon: User },
    { key: "other", label: "기타", icon: MoreHorizontal },
];

const StudyRecordCreateModal = ({ onClose }) => {
    return (
        <div className="record-modal-overlay" role="dialog" aria-modal="true">
            <div className="record-modal">
                <header className="record-modal-header">
                    <h2 className="record-modal-title">새 학습 기록</h2>
                    <button
                        type="button"
                        className="record-modal-close"
                        aria-label="닫기"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="record-modal-body">
                    <div className="record-field">
                        <label className="record-label">학습 날짜</label>
                        <input
                            className="record-input"
                            type="text"
                            value="2026. 01. 19."
                            readOnly
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label">카테고리</label>
                        <div className="record-category-grid">
                            {categories.map(({ key, label, icon: Icon }) => (
                                <button key={key} type="button" className="record-category-card">
                                    <Icon size={22} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="record-field">
                        <label className="record-label">제목</label>
                        <input
                            className="record-input"
                            type="text"
                            placeholder="예 : React Hooks 학습"
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label">내용</label>
                        <textarea
                            className="record-textarea"
                            rows={5}
                            placeholder="학습 활동에서 배운 내용을 자유롭게 작성해주세요."
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label">키워드</label>
                        <div className="record-keyword-row">
                            <input className="record-input" type="text" placeholder="키워드 입력" />
                            <button type="button" className="record-keyword-add">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="record-modal-footer">
                    <button type="button" className="record-footer-btn secondary" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" className="record-footer-btn primary">
                        저장
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default StudyRecordCreateModal;
