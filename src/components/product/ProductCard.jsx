import { Link } from "react-router-dom";
import { Card } from "../ui/Card.jsx";
import { IconTile } from "../ui/IconTile.jsx";
import { Tag, Status } from "../ui/Tag.jsx";
import { Icon } from "../ui/icons.jsx";
import "./ProductCard.css";

/*
  Плитка каталога. Намеренно минималистичная: иконка, лейбл, название и одно
  предложение о пользе — по правилу копирайта ДС, без цены и кнопки. Цена,
  состав и подключение живут на странице решения, куда ведёт вся карточка
  целиком.
*/
export function ProductCard({ product, categoryLabel, inCart }) {
  return (
    <Card
      as={Link}
      to={`/product/${product.id}`}
      interactive
      pad="md"
      className="product-card"
    >
      <div className="product-card__top">
        <IconTile size={40}>
          <Icon name={product.icon} size={20} />
        </IconTile>
        {product.badge ? (
          <Tag tone="accent">{product.badge}</Tag>
        ) : inCart ? (
          <Status tone="success">В корзине</Status>
        ) : (
          categoryLabel && <Tag tone="sunken">{categoryLabel}</Tag>
        )}
      </div>

      <div className="product-card__text">
        <span className="product-card__title">{product.title}</span>
        <span className="product-card__subtitle">{product.subtitle}</span>
      </div>
    </Card>
  );
}
