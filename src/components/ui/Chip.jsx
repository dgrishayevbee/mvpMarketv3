import "./Chip.css";

/* Фильтр-чип каталога. Активный — чёрная заливка, остальные — контур. */
export function Chip({ active = false, children, ...rest }) {
  return (
    <button type="button" className={["chip", active ? "chip--active" : ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </button>
  );
}
