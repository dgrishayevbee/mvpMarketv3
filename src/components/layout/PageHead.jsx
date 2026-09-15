import { Link } from "react-router-dom";
import "./PageHead.css";

/*
  Шапка экрана по Screen Template: хлебные крошки 12px, h1 serif 30-38px,
  строка-пояснение, справа действия (одно основное).
*/
export function PageHead({ crumbs = [], title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div className="page-head__text">
        {crumbs.length > 0 && (
          <div className="page-head__crumbs">
            {crumbs.map((c, i) => (
              <span key={i} className="page-head__crumb">
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span className="page-head__crumb--last">{c.label}</span>}
                {i < crumbs.length - 1 && <span className="page-head__sep">/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="page-head__title serif">{title}</h1>
        {subtitle && <span className="page-head__subtitle">{subtitle}</span>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </div>
  );
}

/* Заголовок секции внутри экрана. */
export function SectionHead({ title, subtitle, aside }) {
  return (
    <div className="section-head">
      <div className="section-head__text">
        <h2 className="section-head__title serif">{title}</h2>
        {subtitle && <span className="section-head__subtitle">{subtitle}</span>}
      </div>
      {aside}
    </div>
  );
}
