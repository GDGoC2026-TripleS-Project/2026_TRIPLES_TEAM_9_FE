const DEFAULT_ITEMS = [
  "회원 정보",
  "최근 학습 활동",
  "마인드맵 요약",
  "목표관리",
  "회원 탈퇴",
];

export default function MySidebar({
  activeLabel = "회원 정보",
  items = DEFAULT_ITEMS,
  onSelect,
}) {
  return (
    <aside className="my-sidebar">
      <div className="my-sidebar-title">마이페이지</div>
      <div className="my-nav">
        {items.map((label) => (
          <button
            key={label}
            className={`my-nav-item ${
              label === activeLabel ? "is-active" : ""
            } ${label === "최근 학습 활동" ? "is-recent" : ""}`}
            type="button"
            onClick={() => onSelect?.(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
