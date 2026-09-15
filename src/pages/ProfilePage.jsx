import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Metric } from "../components/ui/Metric.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { Row } from "../components/ui/Row.jsx";
import { Status } from "../components/ui/Tag.jsx";
import { IconTile } from "../components/ui/IconTile.jsx";
import { formatPrice } from "../components/ui/Price.jsx";
import { Icon, IconDoc, IconStar } from "../components/ui/icons.jsx";
import "./ProfilePage.css";

/*
  Личный кабинет по эталонному экрану ДС: полоса-уведомление (одна),
  метрики serif, ниже плотные строки сервисов и список документов.
*/
export function ProfilePage() {
  const { content } = useContent();
  const { orders } = useOrders();
  const { user } = useAuth();
  const { ids } = useFavorites();
  const { getById } = useProducts();
  const [params] = useSearchParams();

  const justOrdered = params.get("order");
  const cabinet = content.cabinet;

  // Подключённые сервисы — позиции всех заявок, склеенные по id.
  const services = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        const prev = map.get(item.id);
        map.set(item.id, {
          ...item,
          qty: (prev?.qty || 0) + item.qty,
          orderId: order.id,
          status: order.status,
        });
      }
    }
    return [...map.values()];
  }, [orders]);

  const favorites = ids.map(getById).filter(Boolean);

  return (
    <>
      <PageHead
        crumbs={[{ label: "Кабинет" }]}
        title={cabinet.title}
        subtitle={user ? `${user.company || user.name} · ${user.email}` : "Демо-данные прототипа"}
        actions={
          <>
            <Button variant="secondary" size="sm">
              Выставить счёт
            </Button>
            <Button size="sm">Пополнить баланс</Button>
          </>
        }
      />

      {justOrdered ? (
        <Notice tone="success">
          Заявка {justOrdered} отправлена. Счёт и договор придут на почту в течение дня.
        </Notice>
      ) : (
        <Notice action={<button className="link-action">{cabinet.notice.action}</button>}>
          {cabinet.notice.text}
        </Notice>
      )}

      <div className="metric-grid">
        {cabinet.metrics.map((m) => (
          <Metric
            key={m.id}
            label={m.label}
            value={m.value}
            note={m.note}
            noteTone={m.noteTone}
            progress={m.progress}
          />
        ))}
      </div>

      <div className="cabinet">
        <Card pad="md" className="cabinet__services">
          <div className="card-head">
            <span className="card-title">Мои сервисы</span>
            <Link to="/" className="cabinet__card-link">
              В каталог
            </Link>
          </div>

          {services.length === 0 ? (
            <span className="muted-note">
              Пока ничего не подключено. Соберите заявку в каталоге — сервисы появятся здесь.
            </span>
          ) : (
            services.map((item) => (
              <Row
                key={item.id}
                icon={
                  <IconTile size={32}>
                    <Icon name={item.icon} size={16} />
                  </IconTile>
                }
                title={item.title}
                subtitle={`Заявка ${item.orderId}`}
                amount={item.price === 0 ? "0 ₸" : formatPrice(item.price * item.qty)}
                trailing={
                  <Status tone={item.status === "Оформлен" ? "warning" : "success"}>
                    {item.status === "Оформлен" ? "На проверке" : item.status}
                  </Status>
                }
              />
            ))
          )}
        </Card>

        <div className="cabinet__side">
          <Card pad="md">
            <span className="card-title">Документы</span>
            {cabinet.documents.map((doc) => (
              <div className="cabinet__doc" key={doc.id}>
                <IconDoc size={15} />
                <span className="cabinet__doc-label">{doc.label}</span>
                <button className="link-action cabinet__doc-link">PDF</button>
              </div>
            ))}
          </Card>

          <Card pad="md">
            <span className="card-title">Избранное</span>
            {favorites.length === 0 ? (
              <span className="muted-note">
                Отмечайте решения звёздочкой — они соберутся здесь.
              </span>
            ) : (
              favorites.map((p) => (
                <div className="cabinet__doc" key={p.id}>
                  <IconStar size={15} />
                  <Link to={`/product/${p.id}`} className="cabinet__doc-label">
                    {p.title}
                  </Link>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {orders.length > 0 && (
        <Card pad="md">
          <span className="card-title">Заявки</span>
          {orders.map((order) => (
            <Row
              key={order.id}
              icon={
                <IconTile size={32}>
                  <IconDoc size={16} />
                </IconTile>
              }
              title={order.id}
              subtitle={`${new Date(order.date).toLocaleDateString("ru-RU")} · ${order.items.length} позиций`}
              amount={formatPrice(order.total)}
              trailing={<Status tone="warning">{order.status}</Status>}
            />
          ))}
        </Card>
      )}
    </>
  );
}
