import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageLayout from "../../components/mypage/MyPageLayout";
import { deleteMyAccount } from "../../api/mypage.api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/MyPage.css";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const onWithdraw = async () => {
    const ok = window.confirm("정말 탈퇴하시겠어요? 이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteMyAccount();
      logout();
      sessionStorage.removeItem("onboardingAgreements");
      sessionStorage.removeItem("onboardingAuthToken");
      navigate("/", { replace: true });
    } catch (e) {
      alert("회원 탈퇴에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPageLayout
      activeLabel="회원 탈퇴"
      title="회원 탈퇴"
      description="탈퇴 전 유의사항을 확인해주세요."
    >
      <div className="withdraw-card">
        <h3 className="withdraw-title">회원 탈퇴</h3>
        <p className="withdraw-desc">
          탈퇴 시 모든 학습 기록과 계정 정보가 삭제됩니다.
        </p>
        <button
          className="my-btn danger"
          type="button"
          onClick={onWithdraw}
          disabled={loading}
        >
          {loading ? "처리 중..." : "회원 탈퇴"}
        </button>
      </div>
    </MyPageLayout>
  );
}
