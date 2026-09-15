import "./Button.css";

/*
  Кнопка ДС. Варианты: primary (жёлтый --accent), secondary (контур),
  ghost (без фона) и ink (тёмная заливка — для действия на жёлтой полосе,
  где primary слился бы с фоном). Правило ДС — одна primary на экран.
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
