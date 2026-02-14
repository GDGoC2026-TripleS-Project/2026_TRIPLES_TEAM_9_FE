import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageLayout from "../../components/mypage/MyPageLayout";
import RecentActivityCard from "../../components/mypage/RecentActivityCard";
import { getMyPageRecent } from "../../api/mypage.api";
import "../../styles/MyPage.css";

const CATEGORY_TO_QUERY = {
  LECTURE: "lecture",
  READING: "reading",
  PROJECT: "project",
  SEMINAR: "seminar",
  PERSONAL: "personal",
  STUDY: "personal",
  OTHER: "other",
};

export default function RecentActivityPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyPageRecent(5);
      console.log("data.data:", data?.data);
      setItems(Array.isArray(data?.data?.data) ? data.data.data : []);
    } catch {
      setError("최근 학습 활동을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MyPageLayout activeLabel="최근 학습 활동">
      {loading && <div className="recent-loading">불러오는 중...</div>}

      {!loading && error && (
        <div className="recent-error">
          <p>{error}</p>
          <button className="my-btn ghost" type="button" onClick={load}>
            재시도
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="recent-empty">
          아직 학습 기록이 없습니다. 기록을 추가해보세요!
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="recent-list">
          {items.map((item) => (
            <RecentActivityCard
              key={item.recordId}
              item={item}
              onClick={() => {
                const category = CATEGORY_TO_QUERY[item.category] ?? "";
                if (!category) {
                  navigate("/records");
                  return;
                }
                navigate(`/records?category=${category}`);
              }}
            />
          ))}
        </div>
      )}
    </MyPageLayout>
  );
}
