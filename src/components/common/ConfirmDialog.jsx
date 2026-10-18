import { useEffect, useRef } from 'react';

export function ConfirmDialog({ open, title, description, confirmLabel = 'Удалить', onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const previousFocus = useRef(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    cancelRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancelRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.requestAnimationFrame(() => previousFocus.current?.focus());
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="dialog-icon" aria-hidden="true">!</div>
        <p className="eyebrow">ПОДТВЕРЖДЕНИЕ</p>
        <h2 id="confirm-title">{title}</h2>
        <p className="dialog-description">{description}</p>
        <div className="dialog-actions">
          <button ref={cancelRef} type="button" className="button button--quiet" onClick={onCancel}>Отмена</button>
          <button type="button" className="button button--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
