import "./IconTile.css";

/*
  Плитка с линейной иконкой. Размеры из ДС: 32px в строках списка,
  34px в плотной карточке каталога, 40px в карточке продукта.
  tone="solid" — тёмная заливка со светлым глифом, для плиток каталога:
  на сетке они читаются как логотипы сервисов, а не как декор.
*/
export function IconTile({ size = 34, muted = false, tone = "outline", radius, children }) {
  return (
    <span
      className={["icon-tile", `icon-tile--${tone}`, muted ? "icon-tile--muted" : ""]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: radius }}
    >
      {children}
    </span>
  );
}
