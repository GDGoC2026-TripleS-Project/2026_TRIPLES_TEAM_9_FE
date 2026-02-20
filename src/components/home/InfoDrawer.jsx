import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Filter, Lightbulb, Link2, X } from "lucide-react";

const POINTS = [
    {
        icon: Link2,
        text: "자동 연결 규칙: 함께 등장할수록 더 굵게",
    },
    {
        icon: Filter,
        text: "필터로 보기: 기간/카테고리/상위 키워드",
    },
    {
        icon: Lightbulb,
        text: "인사이트: 중심 주제·허브 키워드·최근 성장",
    },
];

const FAQS = [
    {
        question: "키워드는 직접 입력도 가능한가요?",
        answer: "가능해요. 추천도 지원해요.",
    },
    {
        question: "내 기록은 공개되나요?",
        answer: "아쉽지만 개인정보 보호를 위해 비공개로 제공돼요.",
    },
    {
        question: "삭제하면 복구되나요?",
        answer: "삭제 후 복구 불가(안내 문구 포함).",
    },
];

export default function InfoDrawer({ open, onClose }) {
    const titleId = useId();
    const descId = useId();
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const focusableSelector = useMemo(
        () =>
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        []
    );

    useEffect(() => {
        if (!open) return undefined;

        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose?.();
                return;
            }

            if (event.key !== "Tab") return;

            const panel = panelRef.current;
            if (!panel) return;

            const focusableElements = Array.from(panel.querySelectorAll(focusableSelector));
            if (focusableElements.length === 0) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
                return;
            }

            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [focusableSelector, onClose, open]);

    if (!open) return null;

    return (
        <div
            className="info-drawer-overlay"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <aside
                ref={panelRef}
                className="info-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="info-drawer-close"
                    aria-label="닫기"
                    onClick={() => onClose?.()}
                >
                    <X size={18} />
                </button>

                <header className="info-drawer-header">
                    <h2 id={titleId} className="info-drawer-title">
                        기록이 연결되면, 복습과 성장이 쉬워져요
                    </h2>
                    <p id={descId} className="info-drawer-subtitle">
                        당신의 강의·독서·프로젝트 기록을 키워드로 묶고, 함께 등장한 주제는 더 강하게
                        연결해요.
                    </p>
                </header>

                <section className="info-drawer-section" aria-label="주요 포인트">
                    <ul className="info-point-list">
                        {POINTS.map((point) => {
                            const Icon = point.icon;
                            return (
                                <li key={point.text} className="info-point-item">
                                    <span className="info-point-icon" aria-hidden="true">
                                        <Icon size={18} />
                                    </span>
                                    <span>{point.text}</span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="info-drawer-section" aria-label="자주 묻는 질문">
                    <h3 className="info-faq-heading">FAQ</h3>
                    <div className="info-faq-list">
                        {FAQS.map((faq, index) => {
                            const expanded = openFaqIndex === index;
                            const buttonId = `${titleId}-faq-btn-${index}`;
                            const panelId = `${titleId}-faq-panel-${index}`;
                            return (
                                <div key={faq.question} className="info-faq-item">
                                    <button
                                        id={buttonId}
                                        type="button"
                                        className="info-faq-button"
                                        aria-expanded={expanded}
                                        aria-controls={panelId}
                                        onClick={() =>
                                            setOpenFaqIndex((prev) => (prev === index ? -1 : index))
                                        }
                                    >
                                        <span>Q{index + 1}. {faq.question}</span>
                                        <ChevronDown
                                            className={`info-faq-chevron${expanded ? " is-open" : ""}`}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {expanded && (
                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            className="info-faq-answer"
                                        >
                                            A{index + 1}. {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </aside>
        </div>
    );
}
