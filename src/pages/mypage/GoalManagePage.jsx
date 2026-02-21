import MyPageLayout from "../../components/mypage/MyPageLayout";
import GoalList from "../../components/mypage/GoalList";
import "../../styles/mypage/MyPage.css";

export default function GoalManagePage() {
    return (
        <MyPageLayout
            activeLabel="목표 관리"
            title="목표 관리"
            description="학습 목표를 관리하고 달성률을 확인해보세요."
            actionLabel="목표 설정하기"
            actionPath="/goals"
        >
            <GoalList />
        </MyPageLayout>
    );
}
