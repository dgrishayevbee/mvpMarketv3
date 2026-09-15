import { IconTile } from "./IconTile.jsx";
import { Icon } from "./icons.jsx";
import "./ServiceIcon.css";

/*
  Иконка услуги из набора (`public/images/services/`). Вариант light несёт
  свою плитку внутри картинки, поэтому контейнеру фон и рамка не нужны —
  иначе получилась бы плитка в плитке. Вариант plain — тот же объект без
  плитки, для мелких мест вроде строки категории.

  Если у услуги картинки нет (например, её завели через /admin), падаем на
  линейную иконку кита — сетка не разъезжается.
*/
export function ServiceIcon({ src, name, size = 56, alt = "" }) {
  if (!src) {
    return (
      <IconTile size={size}>
        <Icon name={name} size={Math.round(size * 0.45)} />
      </IconTile>
    );
  }

  return (
    <img
      className="service-icon"
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{ flex: `0 0 ${size}px` }}
    />
  );
}
