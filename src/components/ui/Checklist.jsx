import { IconCheck } from "./icons.jsx";
import "./Checklist.css";

/* Чеклист ДС: галочка 16px --ink, текст 14px --ink-2. */
export function Checklist({ title, items = [] }) {
  return (
    <div className="checklist">
      {title && <span className="checklist__title">{title}</span>}
      {items.map((item, i) => (
        <div className="checklist__item" key={i}>
          <IconCheck size={16} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
