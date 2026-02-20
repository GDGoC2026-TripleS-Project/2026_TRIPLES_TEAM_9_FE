import { useRef, useState } from "react";
import Header from "../../components/common/Header";
import FeatureCard from "../../components/FeatureCard";
import InfoDrawer from "../../components/home/InfoDrawer";
import "../../styles/global.css";
import "../../styles/home.css";

import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../lib/token";

const FEATURES = [
    {
        tone: "blue",
        title: "학습 기록 작성",
        desc: "강의, 독서, 프로젝트 등 다양한 카테고리별로 학습 내용을 체계적으로 기록하세요.",
        icon: BookOpen,
    },
    {
        tone: "green",
        title: "마인드맵 자동 생성",
        desc: "키워드 기반으로 자동 연결되는 마인드맵으로 지식의 연결고리를 시각화합니다.",
        icon: BookOpen,
    },
    {
        tone: "purple",
        title: "학습 추적",
        desc: "카테고리별 학습량, 월별 추이, 키워드 클라우드로 성장을 한 눈에 확인하세요.",
        icon: BookOpen,
    },
    {
        tone: "yellow",
        title: "복습 시스템",
        desc: "과거 기록을 자동으로 리마인드하여 효과적인 복습을 돕습니다.",
        icon: BookOpen,
    },
    {
        tone: "red",
        title: "목표 관리",
        desc: "장기 목표와 일일 기록을 연결하여 동기부여를 유지하세요.",
        icon: BookOpen,
    },
    {
        tone: "orange",
        title: "업적 시스템",
        desc: "학습 목표 달성 시 배지를 획득하고 성취감을 느껴보세요.",
        icon: BookOpen,
    },
];

export default function Home() {
    const navigate = useNavigate();
    const [infoOpen, setInfoOpen] = useState(false);
    const moreInfoButtonRef = useRef(null);

    const onStartGarden = () => {
        const token = getAccessToken();
        if (!token) {
            window.alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        navigate("/dashboard");
    };

    const openInfoDrawer = () => setInfoOpen(true);
    const closeInfoDrawer = () => {
        setInfoOpen(false);
        requestAnimationFrame(() => {
            moreInfoButtonRef.current?.focus();
        });
    };

    return (
        <div className="page">
            <Header />
            <section className="hero">
                <div className="container hero-inner">
                    <h1 className="hero-title">당신의 지식은 어떻게 연결되고 있나요?</h1>
                    <p className="hero-subtitle">
                        작은 기록으로 시작하는 성장의 시각화. 강의, 독서, 프로젝트 등 다양한 학습
                        활동을 기록하면, 키워드와 카테고리를 기반으로 자동으로 연결된 마인드맵을
                        생성합니다.
                    </p>

                    <div className="hero-actions">
                        <button className="primary-btn large" onClick={onStartGarden}>내 지식 정원 가꾸기</button>
                        <button
                            ref={moreInfoButtonRef}
                            className="ghost-btn large"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={infoOpen}
                            onClick={openInfoDrawer}
                        >
                            더 알아보기
                        </button>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <h2 className="section-title">주요 기능</h2>

                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <FeatureCard
                                key={f.title}
                                tone={f.tone}
                                title={f.title}
                                desc={f.desc}
                                icon={f.icon}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* <section className="cta-section">
                <h2 className="cta-title">지금 바로 시작하세요</h2>
                <p className="cta-desc">
                    작은 기록이 모여서 당신의 성장이 됩니다.
                </p>

                <button className="cta-btn">
                    무료로 시작하기
                </button>
            </section> */}
            <InfoDrawer open={infoOpen} onClose={closeInfoDrawer} />
        </div>
    );
}
