export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-card">
      <h1 className="auth-title">{title}</h1>
      {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
      {children}
    </div>
  );
}
