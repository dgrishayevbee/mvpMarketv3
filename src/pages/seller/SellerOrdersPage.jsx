import { useOrders } from "../../context/OrdersContext.jsx";
import { PageHead } from "../../components/layout/PageHead.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Row } from "../../components/ui/Row.jsx";
import { Status } from "../../components/ui/Tag.jsx";
import { IconTile } from "../../components/ui/IconTile.jsx";
import { formatPrice } from "../../components/ui/Price.jsx";
import { Icon } from "../../components/ui/icons.jsx";

const STATUS_TONE = {
  Оформлен: "warning",
  "В работе": "info",
  Подключено: "success",
};

export function SellerOrdersPage() {
  const { orders, setStatus } = useOrders();

  return (
    <>
      <PageHead
        crumbs={[{ label: "Кабинет поставщика", to: "/seller" }, { label: "Заявки" }]}
        title="Заявки"
        subtitle="Статус меняется вручную — это прототип, без бэкенда"
      />

      {orders.length === 0 ? (
        <Card pad="md">
          <span className="muted-note">Заявок пока нет.</span>
        </Card>
      ) : (
        orders.map((order) => (
          <Card pad="md" key={order.id}>
            <div className="card-head">
              <span className="card-title">
                {order.id} · {new Date(order.date).toLocaleDateString("ru-RU")}
              </span>
              <div className="row__actions">
                <Status tone={STATUS_TONE[order.status] || "muted"}>{order.status}</Status>
                <Button size="sm" variant="secondary" onClick={() => setStatus(order.id, "В работе")}>
                  В работу
                </Button>
                <Button size="sm" onClick={() => setStatus(order.id, "Подключено")}>
                  Подключено
                </Button>
              </div>
            </div>

            {order.items.map((item) => (
              <Row
                key={item.id}
                icon={
                  <IconTile size={32}>
                    <Icon name={item.icon} size={16} />
                  </IconTile>
                }
                title={item.title}
                subtitle={`${item.qty} шт · ${order.buyerEmail}`}
                amount={formatPrice(item.price * item.qty)}
              />
            ))}
          </Card>
        ))
      )}
    </>
  );
}
