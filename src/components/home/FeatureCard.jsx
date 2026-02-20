import "../styles/home/home.css";

export default function FeatureCard({ tone, title, desc, icon: Icon }) {
    return (
        <div className={`feature-card tone-${tone}`}>
            <div className="feature-icon">
                <Icon className="feature-icon-svg" size={28} />
            </div>
            <div className="feature-title">{title}</div>
            <div className="feature-desc">{desc}</div>
        </div>
    );
}
