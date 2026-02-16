import { BookOpen } from "lucide-react";
import DashboardCard from "./DashboardCard";

const DashboardSummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "총 학습 기록",
      value: summary?.totalRecords ?? 0,
      icon: BookOpen,
      tone: "record",
    },
    {
      title: "보유 키워드",
      value: summary?.totalKeywords ?? 0,
      icon: BookOpen,
      tone: "keyword",
    },
    {
      title: "업적",
      value: summary?.unlocked ?? 0,
      icon: BookOpen,
      tone: "achievement",
    },
    {
      title: "카테고리",
      value: summary?.totalCategories ?? 0,
      icon: BookOpen,
      tone: "category",
    },
  ];

  return (
    <section className="dashboard-cards">
      {cards.map((item) => (
        <DashboardCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          tone={item.tone}
        />
      ))}
    </section>
  );
};

export default DashboardSummaryCards;
