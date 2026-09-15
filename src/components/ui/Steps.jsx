import { IconCheck } from "./icons.jsx";
import "./Steps.css";

/*
  Индикатор шагов мастера: номер, подпись, состояние. Пройденный шаг
  получает галочку, текущий — тёмную заливку. Кликов нет намеренно:
  шаги проходятся по порядку, назад ведёт кнопка «Назад» внутри шага.
*/
export function Steps({ steps, activeId }) {
  const activeIndex = steps.findIndex((s) => s.id === activeId);

  return (
    <ol className="steps">
      {steps.map((step, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "next";
        return (
          <li key={step.id} className={`steps__item steps__item--${state}`}>
            <span className="steps__mark num">
              {state === "done" ? <IconCheck size={13} /> : i + 1}
            </span>
            <span className="steps__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
