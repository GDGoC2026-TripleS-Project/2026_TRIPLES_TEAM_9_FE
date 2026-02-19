import "../../styles/common/LoadingState.css";

const LoadingState = ({
  title = "불러오는 중입니다",
  description = "잠시만 기다려주세요.",
  compact = false,
  className = "",
}) => {
  const classes = [
    "loading-state",
    compact ? "loading-state--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className="loading-state-spinner" aria-hidden="true">
        <span className="loading-state-spinner-dot" />
      </div>
      <div className="loading-state-copy">
        <p className="loading-state-title">{title}</p>
        {description ? <p className="loading-state-description">{description}</p> : null}
      </div>
    </div>
  );
};

export default LoadingState;
