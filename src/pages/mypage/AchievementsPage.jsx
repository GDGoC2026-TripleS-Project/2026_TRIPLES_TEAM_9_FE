import { useEffect, useMemo, useState } from "react";
import MyPageLayout from "../../components/mypage/MyPageLayout";
import { getAchievements } from "../../api/achievement.api";
import styles from "./AchievementsPage.module.css";

const TABS = [
  { key: "ALL", label: "모든 뱃지" },
  { key: "LEARNING", label: "학습" },
  { key: "ATTENDANCE", label: "출석" },
  { key: "CHALLENGE", label: "도전" },
];

export default function AchievementsPage() {
  const [tab, setTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAchievements();
        if (!alive) return;
        setPayload(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "업적 데이터를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const summary = payload?.summary ?? payload?.data?.summary ?? { total: 0, unlocked: 0 };

  const sections = useMemo(() => {
    const allSections = payload?.sections ?? payload?.data?.sections ?? [];
    if (tab === "ALL") return allSections;
    return allSections.filter((section) => section.category === tab);
  }, [payload, tab]);

  return (
    <MyPageLayout
      activeLabel="업적 관리"
      title="업적 관리"
      description="뱃지를 모아 당신의 학습 성장을 기록하세요."
      actionLabel="대시보드로 돌아가기"
      actionPath="/dashboard"
    >
      <div className={styles.page}>
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>달성 현황</span>
          <strong className={styles.summaryValue}>
            {summary.unlocked} / {summary.total}
          </strong>
        </div>

        <div className={styles.tabs}>
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={tab === item.key ? styles.tabActive : styles.tab}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && <div className={styles.stateText}>로딩중...</div>}
        {!loading && error && <div className={styles.errorText}>{error}</div>}

        {!loading && !error && (
          <div className={styles.sectionList}>
            {sections.length === 0 ? (
              <div className={styles.stateText}>표시할 업적이 없습니다.</div>
            ) : (
              sections.map((section) => (
                <section key={`${section.category}-${section.title}`} className={styles.sectionCard}>
                  <div className={styles.sectionHead}>
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                  </div>

                  <div className={styles.badgeGrid}>
                    {(section.badges ?? []).map((badge) => (
                      <article
                        key={badge.badgeId}
                        className={`${styles.badge} ${badge.unlocked ? styles.unlocked : styles.locked}`}
                        title={badge.description}
                      >
                        <div className={styles.badgeIcon} aria-hidden="true">
                          🏅
                        </div>
                        <div className={styles.badgeName}>{badge.title}</div>
                        <p className={styles.badgeDescription}>{badge.description}</p>

                        <div className={styles.badgeMeta}>
                          {badge.unlocked ? (
                            <span className={styles.unlockLabel}>달성</span>
                          ) : (
                            <>
                              <span className={styles.lockLabel}>미달성</span>
                              <span className={styles.progressText}>
                                {badge.progress}/{badge.target}
                              </span>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </div>
    </MyPageLayout>
  );
}
