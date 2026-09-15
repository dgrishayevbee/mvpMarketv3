import "./Button.css";

/*
  Кнопка ДС. Вариантов три: primary (чёрный --accent), secondary (контур),
  ghost (без фона). Правило ДС — одна primary на экран.
  Размер md = --row-h (44px), sm = 36-38px для плотных строк.
*/
export function Button({
  variant = "primary",
  size = "md",
  full = false,
  as: Tag = "button",
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    full ? "btn--full" : "",
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
