import { IconAlert } from "./icons.jsx";
import "./Notice.css";

/*
  Полоса-уведомление. Тонированный фон разрешён ДС только здесь и только
  один раз на экран.
*/
export function Notice({ tone = "warning", children, action }) {
  return (
    <div className={`notice notice--${tone}`}>
      <IconAlert size={18} />
      <span className="notice__text">{children}</span>
      {action}
    </div>
  );
}
