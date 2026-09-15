import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext.jsx";
import { useContent } from "../context/ContentContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Price } from "../components/ui/Price.jsx";
import { Tag } from "../components/ui/Tag.jsx";
import { IconTile } from "../components/ui/IconTile.jsx";
import { Checklist } from "../components/ui/Checklist.jsx";
import { Icon, IconStar } from "../components/ui/icons.jsx";
import "./ProductPage.css";

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = useProducts();
  const { content } = useContent();
  const { addItem } = useCart();
  const { has, toggle } = useFavorites();

  const product = getById(id);

  if (!product) {
    return (
      <PageHead
        crumbs={[{ label: "Каталог", to: "/" }, { label: "Не найдено" }]}
        title="Решение не найдено"
        subtitle="Возможно, оно было снято с публикации."
        actions={
          <Button as={Link} to="/">
            В каталог
          </Button>
        }
      />
    );
  }

  const category = content.categories.find((c) => c.id === product.category);

  return (
    <>
      <PageHead
        crumbs={[{ label: "Каталог", to: "/" }, { label: product.title }]}
        title={product.title}
        subtitle={product.subtitle}
        actions={
          <Button variant="secondary" size="sm" onClick={() => toggle(product.id)}>
            <IconStar size={16} />
            {has(product.id) ? "В избранном" : "В избранное"}
          </Button>
        }
      />

      <div className="product-page">
        <Card className="product-page__main">
          <div className="product-page__head">
            <IconTile size={40}>
              <Icon name={product.icon} size={20} />
            </IconTile>
            <div className="product-page__tags">
              {product.badge && <Tag tone="accent">{product.badge}</Tag>}
              {category && <Tag tone="sunken">{category.label}</Tag>}
            </div>
          </div>

          <p className="product-page__lead">{product.subtitle}</p>

          {product.features?.length > 0 && (
            <div className="product-page__features">
              <Checklist title="Что входит" items={product.features} />
            </div>
          )}

          <div className="product-page__meta">
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Поставщик</span>
              <span>{product.seller}</span>
            </div>
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Подключение</span>
              <span>Онлайн, до одного рабочего дня</span>
            </div>
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Оплата</span>
              <span>В общем счёте Beeline Business</span>
            </div>
          </div>
        </Card>

        <Card className="product-page__aside">
          <Price
            size="lg"
            value={product.price}
            label={product.priceLabel}
            note={product.priceNote}
          />
          <Button
            full
            onClick={() => {
              addItem(product);
              navigate("/cart");
            }}
          >
            Подключить
          </Button>
          <Button full variant="secondary" onClick={() => addItem(product)}>
            В корзину
          </Button>
          <span className="product-page__aside-note">
            Списание начинается после подключения. Отключить можно в любой момент
            в кабинете.
          </span>
        </Card>
      </div>
    </>
  );
}
