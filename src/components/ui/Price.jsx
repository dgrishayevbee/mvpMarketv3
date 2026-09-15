import "./Price.css";

/*
  Цена: sans 600 + tabular-nums. Serif для цен ДС запрещает.
  Деньги в тенге, разряды обычным пробелом: 7 900 ₸.
  value — число; label перекрывает его для нечисловых цен («от 1,9%»).
*/
export function formatPrice(value) {
  return `${Math.round(value).toLocaleString("ru-RU").replace(/ /g, " ")} ₸`;
}

export function Price({ value, label, note, size = "md" }) {
  const text = label || (value === 0 ? "Бесплатно" : formatPrice(value));
  return (
    <span className={`price price--${size}`}>
      <span className="price__value num">{text}</span>
      {note && <span className="price__note">{note}</span>}
    </span>
  );
}
