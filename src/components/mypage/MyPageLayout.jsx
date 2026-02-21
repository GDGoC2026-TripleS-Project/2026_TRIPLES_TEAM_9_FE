import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import MySidebar from "./MySidebar";

const ROUTE_MAP = {
    "회원 정보": "/mypage",
    "최근 학습 활동": "/mypage/recent",
    "업적 관리": "/mypage/achievements",
    "목표 관리": "/mypage/goals",
    "회원 탈퇴": "/mypage/withdraw",
};

export default function MyPageLayout({
    activeLabel,
    title = "마이페이지",
    description = "학습 관련 정보를 확인하고 관리해보세요.",
    actionLabel = "대시보드로 돌아가기",
    actionPath = "/dashboard",
    children,
}) {
    const navigate = useNavigate();

    return (
        <>
            <Header variant="mypage" />
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
                                <h2 className="my-title">{title}</h2>
                                <p className="my-desc">{description}</p>
                            </div>
                            <button
                                className="my-link-btn"
                                type="button"
                                onClick={() =>
                                    actionPath === "/goals"
                                        ? navigate("/goals", { state: { from: "mypage-goals" } })
                                        : navigate(actionPath)
                                }
                            >
                                {actionLabel}
                            </button>
                        </div>

                        {children}
                    </section>
                </div>
            </main>
        </>
    );
}
