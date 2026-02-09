import "../../styles/records/StudyRecordCreateModal.css";
import { useState } from "react";
import close1 from "../../assets/records/close1.svg";
import Lecture from "../../assets/records/Lecture.svg";
import Reading from "../../assets/records/Reading.svg";
import Project from "../../assets/records/Project.svg";
import Seminar from "../../assets/records/Seminar.svg";
import Personal from "../../assets/records/Personal.svg";
import Other from "../../assets/records/Other.svg";

const categories = [
    { key: "lecture", label: "강의", icon: Lecture },
    { key: "reading", label: "독서", icon: Reading },
    { key: "project", label: "프로젝트", icon: Project },
    { key: "seminar", label: "세미나", icon: Seminar },
    { key: "personal", label: "개인 학습", icon: Personal },
    { key: "other", label: "기타", icon: Other },
];

const StudyRecordCreateModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({
        date: "",
        category: "",
        title: "",
        content: "",
        keywords: [],
    });

    const [keywordInput, setKeywordInput] = useState("");

    const onFieldChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const onCategorySelect = (key) => {
        setForm((prev) => ({ ...prev, category: key }));
    };

    const onKeywordAdd = () => {
        const nextKeyword = keywordInput.trim();
        if (!nextKeyword) return;

        setForm((prev) => {
            if (prev.keywords.includes(nextKeyword)) return prev;
            return { ...prev, keywords: [...prev.keywords, nextKeyword] };
        });
        setKeywordInput("");
    };

    return (
        <div className="record-modal-overlay">
            <div className="record-modal">
                <header className="record-modal-header">
                    <h2 className="record-modal-title">새 학습 기록</h2>
                    <button type="button" className="record-modal-close" onClick={onClose}>
                        <img src={close1} alt="닫기" />
                    </button>
                </header>

                <div className="record-modal-body">
                    <div className="record-field">
                        <label className="record-label">학습 날짜</label>
                        <input
                            className="record-input"
                            type="date"
                            value={form.date}
                            onChange={onFieldChange("date")}
                            onClick={(event) => event.currentTarget.showPicker?.()}
                            onFocus={(event) => event.currentTarget.showPicker?.()}
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label">카테고리</label>
                        <div className="record-category-grid">
                            {categories.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`record-category-card${
                                        form.category === key ? " is-selected" : ""
                                    }`}
                                    onClick={() => onCategorySelect(key)}
                                >
                                    <img src={Icon} alt={label} />
                                    {label === "기타" && (
                                        <span className="record-category-other">{label}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="record-field">
                        <label className="record-label record-label--emphasis">제목</label>
                        <input
                            className="record-input"
                            type="text"
                            placeholder="예 : React Hooks 학습"
                            value={form.title}
                            onChange={onFieldChange("title")}
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label record-label--emphasis">내용</label>
                        <textarea
                            className="record-textarea"
                            rows={5}
                            placeholder="학습 활동에서 배운 내용을 자유롭게 작성해주세요."
                            value={form.content}
                            onChange={onFieldChange("content")}
                        />
                    </div>

                    <div className="record-field">
                        <label className="record-label record-label--emphasis">키워드</label>
                        <div className="record-keyword-row">
                            <input
                                className="record-input"
                                type="text"
                                placeholder="키워드 입력"
                                value={keywordInput}
                                onChange={(event) => setKeywordInput(event.target.value)}
                            />

                            <button
                                type="button"
                                className="record-keyword-add"
                                onClick={onKeywordAdd}
                            >
                                +
                            </button>
                        </div>

                        {form.keywords.length > 0 && (
                            <div className="record-keyword-list">
                                {form.keywords.map((keyword) => (
                                    <button
                                        key={keyword}
                                        type="button"
                                        className="record-keyword-label"
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="record-modal-footer">
                    <button type="button" className="record-footer-btn" onClick={onClose}>
                        취소
                    </button>
                    <button
                        type="button"
                        className="record-footer-btn primary"
                        onClick={() => {
                            onSave?.(form);
                        }}
                    >
                        저장
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default StudyRecordCreateModal;
