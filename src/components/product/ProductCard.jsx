import { Link } from "react-router-dom";
import { Card } from "../ui/Card.jsx";
import { IconTile } from "../ui/IconTile.jsx";
import { Tag, Status } from "../ui/Tag.jsx";
import { Icon } from "../ui/icons.jsx";
import "./ProductCard.css";

/*
  Плитка каталога. Строение: крупная плитка-иконка сверху, название, одно
  предложение о пользе и категория внизу — мелкой строкой с иконкой, а не
  пилюлей. Категория прижата к низу карточки, поэтому в ряду все подписи
  стоят на одной линии независимо от длины описания.

  Цены и кнопки тут по-прежнему нет: они на странице решения, куда ведёт
  вся карточка целиком.
*/
export function ProductCard({ product, category, inCart }) {
  return (
    <Card
      as={Link}
      to={`/product/${product.id}`}
      interactive
      pad="md"
      className="product-card"
    >
      <div className="product-card__top">
        <IconTile size={48} tone="solid">
          <Icon name={product.icon} size={24} />
        </IconTile>
        {product.badge ? (
          <Tag tone="accent">{product.badge}</Tag>
        ) : inCart ? (
          <Status tone="success">В корзине</Status>
        ) : null}
      </div>

      <div className="product-card__text">
        <span className="product-card__title">{product.title}</span>
        <span className="product-card__subtitle">{product.subtitle}</span>
      </div>

      {category && (
        <span className="product-card__category">
          <Icon name={category.icon} size={15} />
          {category.label}
        </span>
      )}
    </Card>
  );
}
