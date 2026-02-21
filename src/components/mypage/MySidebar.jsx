const DEFAULT_ITEMS = ["회원 정보", "최근 학습 활동", "업적 관리", "목표 관리"];
const WITHDRAW_LABEL = "회원 탈퇴";

export default function MySidebar({ activeLabel = "회원 정보", items = DEFAULT_ITEMS, onSelect }) {
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

            <button
                className={`my-nav-item is-withdraw ${activeLabel === WITHDRAW_LABEL ? "is-active" : ""}`}
                type="button"
                onClick={() => onSelect?.(WITHDRAW_LABEL)}
            >
                {WITHDRAW_LABEL}
            </button>
        </aside>
    );
}
