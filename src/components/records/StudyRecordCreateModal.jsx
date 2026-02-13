import "../../styles/records/StudyRecordCreateModal.css";
import { useState } from "react";
import close1 from "../../assets/records/close1.svg";
import Lecture from "../../assets/records/Lecture.svg";
import Reading from "../../assets/records/Reading.svg";
import Project from "../../assets/records/Project.svg";
import Seminar from "../../assets/records/Seminar.svg";
import Personal from "../../assets/records/Personal.svg";
import Other from "../../assets/records/Other.svg";
import MarkdownPreview from "../common/MarkdownPreview";

const categories = [
    { key: "lecture", label: "강의", icon: Lecture },
    { key: "reading", label: "독서", icon: Reading },
    { key: "project", label: "프로젝트", icon: Project },
    { key: "seminar", label: "세미나", icon: Seminar },
    { key: "personal", label: "개인 학습", icon: Personal },
    { key: "other", label: "기타", icon: Other },
];

const toKeywordArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.filter((word) => typeof word === "string" && word.trim());
};

const validateForm = (form) => {
    if (!form?.date) return "학습 날짜를 입력해주세요.";
    if (!form?.category) return "카테고리를 선택해주세요.";
    if (!form?.title?.trim()) return "제목을 입력해주세요.";
    if (!form?.content?.trim()) return "내용을 입력해주세요.";
    if (!Array.isArray(form?.keywords) || form.keywords.length === 0) return "키워드를 입력해주세요.";
    return "";
};

const StudyRecordCreateModal = ({ onClose, onSave, initialForm = null, mode = "create" }) => {
    const [form, setForm] = useState(() => ({
        date: initialForm?.date ?? "",
        category: initialForm?.category ?? "",
        title: initialForm?.title ?? "",
        content: initialForm?.content ?? "",
        keywords: toKeywordArray(initialForm?.keywords),
    }));
    const [contentTab, setContentTab] = useState("write");

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

    const onKeywordRemove = (targetKeyword) => {
        setForm((prev) => ({
            ...prev,
            keywords: prev.keywords.filter((keyword) => keyword !== targetKeyword),
        }));
    };

    const onDateInputClick = (event) => {
        try {
            event.currentTarget.showPicker?.();
        } catch {
            console.warn("날짜 선택 UI를 표시하지 못했습니다.");
        }
    };

    return (
        <div className="record-modal-overlay">
            <div className="record-modal">
                <header className="record-modal-header">
                    <h2 className="record-modal-title">
                        {mode === "edit" ? "학습 기록 수정" : "새 학습 기록"}
                    </h2>
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
                            onClick={onDateInputClick}
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
                        <div className="record-markdown-tabs">
                            <button
                                type="button"
                                className={`record-markdown-tab ${contentTab === "write" ? "active" : ""}`}
                                onClick={() => setContentTab("write")}
                            >
                                작성
                            </button>
                            <button
                                type="button"
                                className={`record-markdown-tab ${contentTab === "preview" ? "active" : ""}`}
                                onClick={() => setContentTab("preview")}
                            >
                                미리보기
                            </button>
                        </div>
                        {contentTab === "write" ? (
                            <textarea
                                className="record-textarea"
                                rows={7}
                                placeholder="Markdown으로 내용을 작성해주세요."
                                value={form.content}
                                onChange={onFieldChange("content")}
                            />
                        ) : (
                            <div className="record-markdown-preview">
                                {form.content.trim() ? (
                                    <MarkdownPreview markdown={form.content} />
                                ) : (
                                    <p className="record-markdown-empty">
                                        작성 탭에서 Markdown을 입력하면 미리보기가 표시됩니다.
                                    </p>
                                )}
                            </div>
                        )}
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
                                    <span key={keyword} className="record-keyword-label">
                                        <span>{keyword}</span>
                                        <button
                                            type="button"
                                            className="record-keyword-remove"
                                            onClick={() => onKeywordRemove(keyword)}
                                            aria-label={`${keyword} 삭제`}
                                        >
                                            ×
                                        </button>
                                    </span>
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
                            const validationMessage = validateForm(form);
                            if (validationMessage) {
                                alert(validationMessage);
                                return;
                            }
                            onSave?.(form);
                        }}
                    >
                        {mode === "edit" ? "수정" : "저장"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default StudyRecordCreateModal;
