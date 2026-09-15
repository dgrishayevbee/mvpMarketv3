import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useOrders } from "../../context/OrdersContext.jsx";
import { PageHead } from "../../components/layout/PageHead.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Metric } from "../../components/ui/Metric.jsx";
import { Row } from "../../components/ui/Row.jsx";
import { Status } from "../../components/ui/Tag.jsx";
import { IconTile } from "../../components/ui/IconTile.jsx";
import { formatPrice } from "../../components/ui/Price.jsx";
import { Icon, IconPlus } from "../../components/ui/icons.jsx";

const SELLER = "Beeline Business";

export function SellerDashboardPage() {
  const { all, listBySeller } = useProducts();
  const { orders } = useOrders();

  const own = listBySeller(SELLER);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <PageHead
        crumbs={[{ label: "Кабинет поставщика" }]}
        title="Сводка"
        subtitle="Витрина платформы: единственный поставщик — сама платформа"
        actions={
          <Button as={Link} to="/seller/products/new" size="sm">
            <IconPlus size={16} />
            Добавить товар
          </Button>
        }
      />

      <div className="metric-grid">
        <Metric label="Позиций в каталоге" value={String(all.length)} note="Вместе с дефолтными" />
        <Metric label="Своих позиций" value={String(own.length)} note="Заведены в кабинете" />
        <Metric label="Заявок" value={String(orders.length)} note="За всё время" />
        <Metric label="Сумма заявок" value={formatPrice(revenue)} note="В месяц" />
      </div>

      <Card pad="md">
        <span className="card-title">Последние заявки</span>
        {orders.length === 0 ? (
          <span className="muted-note">Заявок пока нет.</span>
        ) : (
          orders.slice(0, 5).map((order) => (
            <Row
              key={order.id}
              icon={
                <IconTile size={32}>
                  <Icon name="doc" size={16} />
                </IconTile>
              }
              title={order.id}
              subtitle={`${new Date(order.date).toLocaleDateString("ru-RU")} · ${order.buyerEmail}`}
              amount={formatPrice(order.total)}
              trailing={<Status tone="warning">{order.status}</Status>}
            />
          ))
        )}
      </Card>
    </>
  );
}
