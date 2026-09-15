import "./Card.css";

/*
  Базовая карточка: белая поверхность, рамка, без тени. Тень появляется
  только на hover (interactive) — без подъёма и масштабирования.
  pad: "lg" = --pad-card (28px), "md" = 20px, "sm" = 18px.
*/
export function Card({
  as: Tag = "div",
  pad = "lg",
  radius = "lg",
  interactive = false,
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "card",
    `card--pad-${pad}`,
    `card--r-${radius}`,
    interactive ? "card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
