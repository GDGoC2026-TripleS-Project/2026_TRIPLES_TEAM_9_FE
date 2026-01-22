import "../styles/home.css";

export default function FeatureCard({ tone, title, desc }) {
  return (
    <div className={`feature-card tone-${tone}`}>
      <div className="feature-icon" aria-hidden />
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  );
}
