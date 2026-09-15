import "./Field.css";

/*
  Поле ввода ДС: метка сверху 13px/500, поле высотой --row-h, подсказка
  снизу 12px --ink-3. Ошибка красит рамку и подсказку в --error.
*/
export function Field({ label, hint, error, as = "input", children, ...rest }) {
  const Control = as;
  return (
    <label className={["field", error ? "field--error" : ""].filter(Boolean).join(" ")}>
      {label && <span className="field__label">{label}</span>}
      {children || <Control className="field__control" {...rest} />}
      {(error || hint) && <span className="field__hint">{error || hint}</span>}
    </label>
  );
}

/* Строка поиска: иконка внутри рамки, поле без собственных границ. */
export function SearchField({ icon, className = "", ...rest }) {
  return (
    <div className={["search", className].filter(Boolean).join(" ")}>
      {icon}
      <input type="text" className="search__input" {...rest} />
    </div>
  );
}
