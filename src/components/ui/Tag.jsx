import "./Tag.css";

/*
  Пилюли ДС:
  - neutral: контур --border-strong, серый текст (категория, фильтр);
  - sunken:  заливка --bg-sunken (категория на карточке продукта);
  - accent:  контур --ink (акцентный лейбл «Хит»);
  - solid:   чёрная заливка (маркер «Выбирают чаще»).
  Крупных залитых цветных плашек в ДС нет — цвет несут только статусы.
*/
export function Tag({ tone = "neutral", className = "", children, ...rest }) {
  return (
    <span className={["tag", `tag--${tone}`, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}

/* Статус — цветной текст и точка 6px, без плашки. */
export function Status({ tone = "success", children }) {
  return (
    <span className={`status status--${tone}`}>
      <span className="status__dot" />
      {children}
    </span>
  );
}
