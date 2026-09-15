import "./IconTile.css";

/*
  Плитка с линейной иконкой. Размеры из ДС: 32px в строках списка,
  34px в плотной карточке каталога, 40px в карточке продукта.
*/
export function IconTile({ size = 34, muted = false, children }) {
  return (
    <span
      className={["icon-tile", muted ? "icon-tile--muted" : ""].filter(Boolean).join(" ")}
      style={{ width: size, height: size, flex: `0 0 ${size}px` }}
    >
      {children}
    </span>
  );
}
