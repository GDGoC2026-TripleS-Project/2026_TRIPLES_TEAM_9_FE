import { Pencil, Trash2, BookOpen, Calendar, Tag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/records/StudyRecordDetail.css";
import presentation1 from "../../assets/detail/presentation1.svg";
import pencil from "../../assets/detail/pencil.svg";
import trash from "../../assets/detail/trash.svg";
import Header from "../../components/common/Header";

const StudyRecordDetail = () => {
    const location = useLocation();
    const record = location.state;
    const navigate = useNavigate();

    if (!record) {
        return (
            <div className="study-record-detail-page">
                <Header variant="detail" showBack onBack={() => navigate(-1)} />

                <main className="detail-main">
                    <section className="detail-card">
                        <h1 className="detail-title">기록을 찾을 수 없습니다.</h1>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="study-record-detail-page">
            <Header variant="detail" showBack onBack={() => navigate(-1)} />

            <main className="detail-main">
                <section className="detail-card">
                    <div className="detail-card-top">
                        <div className="detail-meta">
                            <span className="detail-category">
                                {record.categoryLabel === "강의" ? (
                                    <img src={presentation1} alt="강의" />
                                ) : (
                                    <BookOpen size={24} color="#000" />
                                )}
                                {record.categoryLabel}
                            </span>
                            <span className="detail-date">
                                <Calendar size={24} />
                                {record.date}
                            </span>
                        </div>
                        <div className="detail-actions">
                            <button type="button" className="detail-action edit">
                                <img src={pencil} size={12} alt="pencil" />
                                수정
                            </button>
                            <button type="button" className="detail-action delete">
                                <img src={trash} width={12} height={15} alt="trash" />
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="detail-divider" />

                    <h1 className="detail-title">{record.title}</h1>

                    <div className="detail-section">
                        <h2 className="detail-section-title">내용</h2>
                        <div className="detail-content-box">
                            {record.description || "내용이 없습니다."}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2 className="detail-section-title">
                            <Tag size={16} />
                            키워드
                        </h2>
                        <span className="detail-tag">{record.tag || "-"}</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudyRecordDetail;
