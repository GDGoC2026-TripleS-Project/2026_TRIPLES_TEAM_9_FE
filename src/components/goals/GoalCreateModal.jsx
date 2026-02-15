import { useState } from "react";

export default function GoalCreateModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;

    setSaving(true);
    const ok = await onCreate(value);
    setSaving(false);

    if (ok) {
      setTitle("");
      onClose();
    }
  };

  return (
    <div className="goal-modal-backdrop">
      <div className="goal-modal">
        <h3 className="goal-modal-title">새 목표 추가</h3>
        <form className="goal-modal-form" onSubmit={submit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="목표 제목을 입력하세요"
          />
          <div className="goal-modal-actions">
            <button type="button" className="goal-modal-btn ghost" onClick={onClose} disabled={saving}>
              취소
            </button>
            <button type="submit" className="goal-modal-btn" disabled={saving || !title.trim()}>
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

