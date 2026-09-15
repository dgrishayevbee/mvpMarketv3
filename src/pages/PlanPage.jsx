import { useParams, useNavigate, Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Price } from "../components/ui/Price.jsx";
import { Tag } from "../components/ui/Tag.jsx";
import { Checklist } from "../components/ui/Checklist.jsx";
import "./ProductPage.css";

/*
  Страница тарифного пакета. Устроена как страница решения: слева состав,
  справа цена и действия.

  Главное отличие — состав собирается накопительно. На карточке пакет
  показывает только свою прибавку («Всё из «Kense Solo», плюс:»), и это
  правильно для сравнения колонок. Но открытая страница отвечает на другой
  вопрос — «что я получу», — поэтому здесь перечислено всё, что входит,
  включая унаследованное от младших пакетов, с подписью, откуда что.
*/

// Собираем состав пакета из него самого и всех, что идут до него в списке.
export function planItemForCart(plan) {
  return {
    id: plan.id,
    title: `Тариф «${plan.name}»`,
    price: plan.price,
    seller: "Beeline Business",
    subtitle: plan.audience,
    icon: "phone",
  };
}

export function PlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const { addItem } = useCart();

  const items = content.plans?.items || [];
  const index = items.findIndex((p) => p.id === id);
  const plan = index >= 0 ? items[index] : null;

  if (!plan) {
    return (
      <PageHead
        crumbs={[{ label: "Каталог", to: "/" }, { label: "Не найдено" }]}
        title="Пакет не найден"
        subtitle="Возможно, он был снят с публикации."
        actions={
          <Button as={Link} to="/#plans">
            К тарифам
          </Button>
        }
      />
    );
  }

  // Сначала то, что даёт сам пакет, потом унаследованное от младших:
  // человек открыл страницу старшего тарифа, чтобы понять прибавку.
  const groups = [
    { id: plan.id, title: "Что входит", features: plan.features || [] },
    ...items
      .slice(0, index)
      .map((p) => ({ id: p.id, title: `Из пакета «${p.name}»`, features: p.features || [] })),
  ];

  const addToCart = () => addItem(planItemForCart(plan));

  return (
    <>
      <PageHead
        crumbs={[{ label: "Каталог", to: "/" }, { label: "Тарифы", to: "/#plans" }, { label: plan.name }]}
        title={plan.name}
        subtitle={plan.audience}
      />

      <div className="product-page">
        <Card className="product-page__main">
          <div className="product-page__head">
            <div className="product-page__tags">
              <Tag tone="sunken">Тарифный пакет</Tag>
              {plan.badge && <Tag tone="solid">{plan.badge}</Tag>}
            </div>
          </div>

          <p className="product-page__lead">{plan.priceNote}</p>

          {groups.map((group) => (
            <div className="product-page__features" key={group.id}>
              <Checklist title={group.title} items={group.features} />
            </div>
          ))}

          <div className="product-page__meta">
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Кому подходит</span>
              <span>{plan.audience}</span>
            </div>
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Переход между тарифами</span>
              <span>С первого числа месяца</span>
            </div>
            <div className="product-page__meta-item">
              <span className="product-page__meta-label">Оплата</span>
              <span>В общем счёте Beeline Business</span>
            </div>
          </div>
        </Card>

        <Card className="product-page__aside">
          <Price size="lg" value={plan.price} label={plan.priceLabel} note="в месяц" />

          <Button
            full
            onClick={() => {
              addToCart();
              navigate("/cart");
            }}
          >
            {plan.cta || "Подключить"}
          </Button>
          <Button full variant="secondary" onClick={addToCart}>
            В корзину
          </Button>

          <span className="product-page__aside-note">
            Счёт выставляется один раз в месяц на тариф и все подключённые
            сервисы. Сменить пакет можно с первого числа.
          </span>
        </Card>
      </div>
    </>
  );
}
