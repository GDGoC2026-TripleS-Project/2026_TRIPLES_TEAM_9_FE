import styles from "./ReviewModal.module.css";

export default function ReviewModal({ open, items, onClose, onOpenRecord }) {
  if (!open) return null;
  const list = Array.isArray(items) ? items.slice(0, 3) : [];

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          className={styles.close}
          aria-label="닫기"
          type="button"
          onClick={() => onClose?.(list)}
        >
          ✕
        </button>

        <div className={styles.header}>
          <div className={styles.headerIcon}>📚</div>
          <div>
            <div className={styles.headerTitle}>복습시간입니다!</div>
            <div className={styles.headerSub}>
              이전에 학습한 내용을 다시 한 번 확인해보세요.
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {list.map((item) => (
            <div key={item.recordId} className={styles.card}>
              <div className={styles.cardTitle}>{item.title}</div>

              <div className={styles.metaRow}>
                <span className={styles.pill}>{item.categoryLabel ?? "-"}</span>
                <span className={styles.date}>📅 {item.learningDate ?? "-"}</span>
              </div>

              <div className={styles.preview}>{item.preview ?? "미리보기가 없습니다."}</div>

              <div className={styles.keywordRow}>
                {(item.keywords || []).map((keyword) => (
                  <span className={styles.keyword} key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>

              <button
                className={styles.detailBtn}
                type="button"
                onClick={() => onOpenRecord?.(item.recordId)}
              >
                상세보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

