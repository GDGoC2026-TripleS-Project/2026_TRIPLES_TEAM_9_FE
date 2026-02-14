import { BookOpen, Calendar, Tag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/records/StudyRecordDetail.css";
import presentation1 from "../../assets/detail/presentation1.svg";
import pencil from "../../assets/detail/pencil.svg";
import trash from "../../assets/detail/trash.svg";
import Header from "../../components/common/Header";
import StudyRecordCreateModal from "../../components/records/StudyRecordCreateModal";
import MarkdownPreview from "../../components/common/MarkdownPreview";
import {
    useDeleteRecordMutation,
    useRecordDetailsQuery,
    useUpdateRecordMutation,
} from "../../hooks/useRecordApi";
import { toRecordDetailItem } from "../../utils/recordView";
import { useState } from "react";
import { getApiErrorMessage } from "../../api/api-response";

const toDateInputValue = (value) => {
    if (!value) return "";
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
};

const StudyRecordDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useRecordDetailsQuery(id);
    const record = data ? toRecordDetailItem(data) : null;
    const [isEditOpen, setIsEditOpen] = useState(false);

    const updateMutation = useUpdateRecordMutation({
        onSuccess: async () => {
            await refetch();
        },
    });
    const deleteMutation = useDeleteRecordMutation({
        onSuccess: async () => {
            navigate("/records");
        },
    });

    const onUpdateClick = () => {
        setIsEditOpen(true);
    };

    const onEditSave = async (form) => {
        if (!record?.id) return;
        try {
            await updateMutation.mutateAsync(record.id, {
                title: form?.title?.trim() || "",
                contentMd: form?.content?.trim() || "",
                content: form?.content?.trim() || "",
                category: form?.category?.toUpperCase?.() || undefined,
                keywords: Array.isArray(form?.keywords) ? form.keywords : [],
                learningDate: form?.date || undefined,
            });
            setIsEditOpen(false);
        } catch (mutationError) {
            alert(getApiErrorMessage(mutationError, "기록 수정에 실패했습니다."));
        }
    };

    const onDeleteClick = async () => {
        if (!record?.id) return;
        if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;

        try {
            await deleteMutation.mutateAsync(record.id);
        } catch (mutationError) {
            alert(getApiErrorMessage(mutationError, "기록 삭제에 실패했습니다."));
        }
    };

    if (loading) {
        return (
            <div className="study-record-detail-page">
                <Header variant="detail" showBack onBack={() => navigate(-1)} />

                <main className="detail-main">
                    <section className="detail-card">
                        <h1 className="detail-title">기록을 불러오는 중입니다.</h1>
                    </section>
                </main>
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="study-record-detail-page">
                <Header variant="detail" showBack onBack={() => navigate(-1)} />

                <main className="detail-main">
                    <section className="detail-card">
                        <h1 className="detail-title">
                            {error?.message || "기록을 찾을 수 없습니다."}
                        </h1>
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
                            <button
                                type="button"
                                className="detail-action edit"
                                onClick={onUpdateClick}
                                disabled={updateMutation.loading}
                            >
                                <img src={pencil} size={12} alt="pencil" />
                                {updateMutation.loading ? "수정 중..." : "수정"}
                            </button>
                            <button
                                type="button"
                                className="detail-action delete"
                                onClick={onDeleteClick}
                                disabled={deleteMutation.loading}
                            >
                                <img src={trash} width={12} height={15} alt="trash" />
                                {deleteMutation.loading ? "삭제 중..." : "삭제"}
                            </button>
                        </div>
                    </div>

                    <div className="detail-divider" />

                    <h1 className="detail-title">{record.title}</h1>

                    <div className="detail-section">
                        <h2 className="detail-section-title">내용</h2>
                        <div className="detail-content-box">
                            {record.contentMd?.trim() ? (
                                <MarkdownPreview markdown={record.contentMd} className="detail-markdown" />
                            ) : (
                                "내용이 없습니다."
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2 className="detail-section-title">
                            <Tag size={16} />
                            키워드
                        </h2>
                        {record.keywords?.length ? (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {record.keywords.map((keyword) => (
                                    <span className="detail-tag" key={keyword}>
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="detail-tag">-</span>
                        )}
                    </div>
                </section>
            </main>
            {isEditOpen && record && (
                <StudyRecordCreateModal
                    mode="edit"
                    initialForm={{
                        date: toDateInputValue(record.raw?.learningDate ?? record.raw?.date),
                        category: record.categoryValue,
                        title: record.title,
                        content: record.contentMd ?? record.content ?? "",
                        keywords: record.keywords ?? [],
                    }}
                    onClose={() => setIsEditOpen(false)}
                    onSave={onEditSave}
                />
            )}
        </div>
    );
};

export default StudyRecordDetail;
