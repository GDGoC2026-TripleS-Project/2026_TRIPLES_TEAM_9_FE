import { ChevronLeft, Pencil, Trash2, BookOpen, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/StudyRecord/StudyRecordDetail.css";

const StudyRecordDetail = () => {
    return (
        <div className="study-record-detail-page">
            <header className="detail-header">
                <Link className="back-link" to="/study-record">
                    <ChevronLeft size={18} />
                    돌아가기
                </Link>
            </header>

            <main className="detail-main">
                <section className="detail-card">
                    <div className="detail-card-top">
                        <div className="detail-meta">
                            <span className="detail-chip">
                                <BookOpen size={14} />
                                강의
                            </span>
                            <span className="detail-date">
                                <Calendar size={14} />
                                2026. 1. 18
                            </span>
                        </div>
                        <div className="detail-actions">
                            <button type="button" className="detail-action edit">
                                <Pencil size={14} />
                                수정
                            </button>
                            <button type="button" className="detail-action delete">
                                <Trash2 size={14} />
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="detail-divider" />

                    <h1 className="detail-title">파이썬 기초 공부</h1>

                    <div className="detail-section">
                        <h2 className="detail-section-title">내용</h2>
                        <div className="detail-content-box">여기에 마크다운 형식으로 내용 보임</div>
                    </div>

                    <div className="detail-section">
                        <h2 className="detail-section-title">
                            <Tag size={14} />
                            키워드
                        </h2>
                        <span className="detail-tag">Python</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudyRecordDetail;
