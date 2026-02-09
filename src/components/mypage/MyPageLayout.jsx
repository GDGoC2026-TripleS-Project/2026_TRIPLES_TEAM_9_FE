import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import MySidebar from "./MySidebar";

const ROUTE_MAP = {
    "회원 정보": "/mypage",
    "최근 학습 활동": "/mypage/recent",
    "마인드맵 요약": "/mypage/mindmap",
    목표관리: "/mypage/goals",
    "회원 탈퇴": "/mypage/withdraw",
};

export default function MyPageLayout({ activeLabel, children }) {
    const navigate = useNavigate();

    return (
        <>
            <Header variant="dashboard" />
            <main className="my-page">
                <div className="my-container">
                    <MySidebar
                        activeLabel={activeLabel}
                        onSelect={(label) => {
                            const target = ROUTE_MAP[label];
                            if (target) navigate(target);
                        }}
                    />

                    <section className="my-content">
                        <div className="my-content-header">
                            <div>
                                <h2 className="my-title">최근 학습 기록</h2>
                                <p className="my-desc">
                                    최근 학습한 내용들을 확인하고 이어서 학습해보세요.
                                </p>
                            </div>
                            <button
                                className="my-link-btn"
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                대시보드로 돌아가기
                            </button>
                        </div>

                        {children}
                    </section>
                </div>
            </main>
        </>
    );
}
