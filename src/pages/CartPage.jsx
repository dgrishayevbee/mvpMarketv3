import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Row } from "../components/ui/Row.jsx";
import { IconTile } from "../components/ui/IconTile.jsx";
import { Price, formatPrice } from "../components/ui/Price.jsx";
import { Icon, IconTrash, IconPlus } from "../components/ui/icons.jsx";
import "./CartPage.css";

export function CartPage() {
  const { items, setQty, removeItem, subtotal, count, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <PageHead crumbs={[{ label: "Корзина" }]} title="Корзина пуста" />
        <Card className="cart-empty">
          <span className="cart-empty__note">
            Выберите сервисы в каталоге — они соберутся в одну заявку и один счёт.
          </span>
          <Button as={Link} to="/">
            В каталог
          </Button>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHead
        crumbs={[{ label: "Корзина" }]}
        title="Заявка на подключение"
        subtitle={`${count} позиций в одной заявке`}
        actions={
          <Button variant="ghost" size="sm" onClick={clear}>
            Очистить
          </Button>
        }
      />

      <div className="cart">
        <Card className="cart__list" pad="md">
          {items.map((item) => (
            <Row
              key={item.id}
              icon={
                <IconTile size={32}>
                  <Icon name={item.icon} size={16} />
                </IconTile>
              }
              title={item.title}
              subtitle={item.subtitle}
              amount={item.price === 0 ? "В тарифе" : formatPrice(item.price * item.qty)}
              actions={
                <>
                  <div className="cart__qty">
                    <button
                      type="button"
                      className="cart__qty-btn"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="Меньше"
                    >
                      −
                    </button>
                    <span className="cart__qty-value num">{item.qty}</span>
                    <button
                      type="button"
                      className="cart__qty-btn"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Больше"
                    >
                      <IconPlus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Убрать"
                  >
                    <IconTrash size={16} />
                  </button>
                </>
              }
            />
          ))}
        </Card>

        <Card className="cart__summary">
          <span className="cart__summary-title">Итого в месяц</span>
          <Price size="lg" value={subtotal} note="Без учёта тарифа связи" />
          <Button full onClick={() => navigate("/checkout")}>
            Оформить заявку
          </Button>
          <Button as={Link} to="/" full variant="secondary">
            Добавить ещё
          </Button>
          <span className="cart__summary-note">
            Счёт выставляется один раз в месяц на все подключённые сервисы.
          </span>
        </Card>
      </div>
    </>
  );
}
