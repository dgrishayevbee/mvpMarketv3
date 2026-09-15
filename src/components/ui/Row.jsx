import "./Row.css";

/*
  Строка списка / таблицы: плитка иконки, две строки текста, сумма справа,
  статус. Разделитель — верхняя граница, рамок у строк нет.
*/
export function Row({ icon, title, subtitle, amount, trailing, actions }) {
  return (
    <div className="row">
      {icon}
      <div className="row__text">
        <span className="row__title">{title}</span>
        {subtitle && <span className="row__subtitle">{subtitle}</span>}
      </div>
      {amount && <span className="row__amount num">{amount}</span>}
      {trailing}
      {actions && <div className="row__actions">{actions}</div>}
    </div>
  );
}
