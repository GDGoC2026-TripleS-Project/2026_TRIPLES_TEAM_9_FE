import MyPageLayout from "../../components/mypage/MyPageLayout";
import GoalList from "../../components/mypage/GoalList";
import "../../styles/MyPage.css";

export default function GoalManagePage() {
  return (
    <MyPageLayout
      activeLabel="목표관리"
      title="마이페이지"
      description="학습 목표를 관리하고 달성률을 확인해보세요."
    >
      <GoalList />
    </MyPageLayout>
  );
}

