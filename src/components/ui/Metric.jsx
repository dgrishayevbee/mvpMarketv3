import "./Metric.css";

/*
  Метрика кабинета: подпись 12px, крупное число serif 28px, снизу
  пояснение или полоса прогресса.
*/
export function Metric({ label, value, note, noteTone = "muted", progress }) {
  return (
    <div className="metric">
      <span className="metric__label">{label}</span>
      <span className="metric__value serif">{value}</span>
      {typeof progress === "number" && (
        <div className="metric__track">
          <div className="metric__fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
      {note && <span className={`metric__note metric__note--${noteTone}`}>{note}</span>}
    </div>
  );
}
