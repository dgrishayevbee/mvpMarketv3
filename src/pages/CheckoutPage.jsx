import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { Steps } from "../components/ui/Steps.jsx";
import { Tag } from "../components/ui/Tag.jsx";
import { Price, formatPrice } from "../components/ui/Price.jsx";
import { Checklist } from "../components/ui/Checklist.jsx";
import { IconCheck, IconDoc } from "../components/ui/icons.jsx";
import "./CheckoutPage.css";

/*
  Покупка идёт тремя шагами, как в первой версии: состав заказа → оплата →
  подтверждение. Смысл разбиения в том, что между «заказом» и «оплатой»
  стоит гейт: услуги подключаются на юрлицо, поэтому без аккаунта компании,
  заведённого по ЭЦП, дальше первого шага пройти нельзя. Дальше — единый
  счёт платформы, НДС и закрывающие документы, которые подписываются той же
  подписью.

  Верстка своя, от v3: карточки, чеклисты и типографика ДС. Из первой
  версии взяты сценарий и тексты, а не CSS.
*/

const STEPS = [
  { id: "order", label: "Заказ" },
  { id: "payment", label: "Оплата" },
  { id: "confirm", label: "Подтверждение" },
];

// Демо-реквизиты прототипа: единый счёт выставляет сама платформа.
const COMPANY = {
  payer: "ТОО «Ваша компания»",
  bin: "123456789012",
  contract: "B2B-2026-004718",
  account: "8 707 000 00 00",
  provider: "ТОО «Beeline Business Kazakhstan»",
  providerBin: "980540000397",
  iik: "KZ12 3456 7890 1234 5678",
  bank: "АО «Банк ЦентрКредит», KCJBKZKX",
};

const PAYMENT_OPTIONS = [
  {
    id: "invoice",
    title: "Единый счёт Beeline Business",
    note: "Постоплата: один счёт в месяц по всем услугам, оплата с расчётного счёта компании",
    tag: "Рекомендуем",
  },
  {
    id: "card",
    title: "Оплата картой онлайн",
    note: "Списание сразу, закрывающие документы формируются так же",
  },
];

const CLOSING_DOCS = [
  {
    id: "invoice",
    title: "Счёт на оплату",
    note: "Единый счёт по всем услугам, PDF — сразу после оформления",
  },
  {
    id: "act",
    title: "Акт выполненных работ",
    note: "Формируется в первый рабочий день следующего месяца",
  },
  {
    id: "esf",
    title: "Электронная счёт-фактура (ЭСФ)",
    note: "Выписывается в ИС ЭСФ на БИН плательщика",
  },
  {
    id: "offer",
    title: "Договор-оферта на услуги",
    note: "Подписывается ЭЦП, хранится в личном кабинете",
  },
];

const CONFIRM_STEPS = [
  {
    title: "Оплата проверяется",
    note: "Платёж по единому счёту подтверждается автоматически, обычно в течение одного рабочего дня после поступления средств.",
  },
  {
    title: "Сервисы будут подключены",
    note: "После подтверждения оплаты услуги активируются автоматически, доступы придут на почту подписанта.",
  },
  {
    title: "Документы в личном кабинете",
    note: "Статус заявки, счёт и закрывающие документы — акт, ЭСФ, договор — лежат в кабинете.",
  },
];

function Requisites({ title, rows }) {
  return (
    <div className="checkout__req-col">
      <span className="card-title">{title}</span>
      <dl className="checkout__req">
        {rows.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CheckoutPage() {
  const { items, subtotal, setQty, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState("order");
  const [payment, setPayment] = useState("invoice");
  const [order, setOrder] = useState(null);

  if (items.length === 0 && !order) {
    return (
      <>
        <PageHead crumbs={[{ label: "Заявка" }]} title="Нечего оформлять" />
        <Card className="checkout-empty">
          <span>Корзина пуста — сначала выберите сервисы в каталоге.</span>
          <Button as={Link} to="/">
            В каталог
          </Button>
        </Card>
      </>
    );
  }

  // Цены в каталоге с НДС, поэтому налог выделяется из суммы, а не сверху.
  const vat = subtotal - subtotal / 1.12;

  const submitOrder = () => {
    const created = createOrder({
      items,
      total: subtotal,
      payment: PAYMENT_OPTIONS.find((o) => o.id === payment)?.title || payment,
      buyerEmail: user?.email || "company@mvpmarket.dev",
    });
    setOrder(created);
    clear();
    setStep("confirm");
  };

  return (
    <>
      <PageHead
        crumbs={[{ label: "Корзина", to: "/cart" }, { label: "Заявка" }]}
        title="Заявка на подключение"
        subtitle="Услуги подключаются на юрлицо: договоры подписываются ЭЦП, счёт приходит один на все сервисы"
      />

      <Steps steps={STEPS} activeId={step} />

      {step === "order" && (
        <div className="checkout">
          <Card className="checkout__form">
            <span className="card-title">Состав заявки</span>

            <div className="checkout__lines">
              {items.map((item) => (
                <div className="checkout__line" key={item.id}>
                  <div className="checkout__line-text">
                    <span className="checkout__line-title">{item.title}</span>
                    {item.subtitle && (
                      <span className="checkout__line-note">{item.subtitle}</span>
                    )}
                  </div>

                  <div className="checkout__qty">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="Меньше"
                    >
                      −
                    </button>
                    <span className="num">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Больше"
                    >
                      +
                    </button>
                  </div>

                  <span className="checkout__line-price num">
                    {item.price === 0 ? "В тарифе" : formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout__total-row">
              <span>Итого в месяц</span>
              <Price size="md" value={subtotal} />
            </div>

            {isAuthenticated ? (
              <div className="form-actions">
                <Button onClick={() => setStep("payment")}>Далее — к оплате</Button>
                <Button as={Link} to="/cart" variant="ghost">
                  Вернуться в корзину
                </Button>
              </div>
            ) : null}
          </Card>

          {isAuthenticated ? (
            <Card className="checkout__summary">
              <span className="card-title">Плательщик</span>
              <dl className="checkout__req">
                <div>
                  <dt>Компания</dt>
                  <dd>{user?.company || COMPANY.payer}</dd>
                </div>
                <div>
                  <dt>БИН</dt>
                  <dd className="num">{user?.bin || COMPANY.bin}</dd>
                </div>
                {user?.method === "ecp" && (
                  <div>
                    <dt>Подписант (ЭЦП)</dt>
                    <dd>{user.name}</dd>
                  </div>
                )}
                <div>
                  <dt>E-mail для документов</dt>
                  <dd>{user?.email || "—"}</dd>
                </div>
              </dl>

              <Checklist
                items={[
                  "Счёт на оплату в течение дня",
                  "Договор на подпись ЭЦП",
                  "Подключение до одного рабочего дня",
                ]}
              />
            </Card>
          ) : (
            <Card className="checkout__gate">
              <span className="card-title">Для оформления нужен аккаунт компании</span>
              <p className="checkout__gate-text">
                Услуги подключаются на юридическое лицо: регистрация идёт по ЭЦП, данные
                компании подтянутся из сертификата, договоры подпишете электронной подписью —
                без визита в офис. Корзина сохранится.
              </p>

              <Checklist
                items={[
                  "Вход по ключу ЭЦП или через eGov mobile",
                  "Подтверждение личности подписанта — Verigram Face ID",
                  "Договор-оферта и согласия подписываются ЭЦП онлайн",
                ]}
              />

              <div className="form-actions">
                <Button as={Link} to="/register?next=/checkout">
                  Зарегистрироваться по ЭЦП
                </Button>
                <Button as={Link} to="/login?next=/checkout" variant="ghost">
                  Уже есть аккаунт
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {step === "payment" && (
        <div className="checkout-step">
          <Card>
            <span className="card-title">Способ оплаты</span>
            <div className="checkout__options">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    "checkout__option",
                    payment === option.id ? "checkout__option--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setPayment(option.id)}
                >
                  <span className="checkout__option-head">
                    <span className="checkout__option-title">{option.title}</span>
                    {option.tag && <Tag tone="solid">{option.tag}</Tag>}
                  </span>
                  <span className="checkout__option-note">{option.note}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <span className="card-title">Единый счёт по всем услугам</span>
            <p className="muted-note">
              Все подключённые сервисы, лицензии и тарифы попадают в один счёт Beeline
              Business. Отдельные договоры с поставщиками заключать не нужно — платформа сама
              рассчитывается с ними.
            </p>

            <div className="checkout__invoice">
              <div className="checkout__invoice-row">
                <span>Услуги за расчётный период</span>
                <span className="num">{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout__invoice-row checkout__invoice-row--muted">
                <span>в том числе НДС 12%</span>
                <span className="num">{formatPrice(vat)}</span>
              </div>
              <div className="checkout__invoice-row checkout__invoice-row--total">
                <span>К оплате по счёту</span>
                <span className="num">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <span className="card-title">Закрывающие документы</span>
            <ul className="checkout__docs">
              {CLOSING_DOCS.map((doc) => (
                <li key={doc.id} className="checkout__doc">
                  <IconDoc size={18} />
                  <span className="checkout__doc-body">
                    <span className="checkout__doc-title">{doc.title}</span>
                    <span className="checkout__doc-note">{doc.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <span className="muted-note">
              Документы формируются автоматически и появляются в кабинете в разделе
              «Документы».
            </span>
          </Card>

          <Card>
            <div className="checkout__req-grid">
              <Requisites
                title="Плательщик"
                rows={[
                  ["Компания", user?.company || COMPANY.payer],
                  ["БИН", user?.bin || COMPANY.bin],
                  ...(user?.method === "ecp" ? [["Подписант (ЭЦП)", user.name]] : []),
                  ["Договор", COMPANY.contract],
                  ["Лицевой счёт", COMPANY.account],
                  ["E-mail для документов", user?.email || "—"],
                ]}
              />
              <Requisites
                title="Получатель платежа"
                rows={[
                  ["Компания", COMPANY.provider],
                  ["БИН", COMPANY.providerBin],
                  ["ИИК", COMPANY.iik],
                  ["Банк", COMPANY.bank],
                  ["Назначение платежа", "Оплата по единому счёту Beeline Business"],
                ]}
              />
            </div>
          </Card>

          <Notice>
            Договор-оферта и согласия подписываются ЭЦП подписанта — ссылка придёт на{" "}
            {user?.email || "почту компании"} сразу после оформления.
          </Notice>

          <div className="form-actions">
            <Button onClick={submitOrder}>Подтвердить заявку</Button>
            <Button variant="secondary" onClick={() => setStep("order")}>
              Назад
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && order && (
        <Card className="checkout__confirm">
          <span className="checkout__confirm-mark">
            <IconCheck size={20} />
          </span>

          <div className="checkout__confirm-head">
            <h2 className="serif">Заявка {order.id} оформлена</h2>
            <span className="muted-note">
              Счёт выставлен на {formatPrice(order.total)} в месяц. Документы уйдут на{" "}
              {order.buyerEmail}.
            </span>
          </div>

          <ol className="checkout__confirm-list">
            {CONFIRM_STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="checkout__confirm-step num">{i + 1}</span>
                <span className="checkout__confirm-body">
                  <span className="checkout__confirm-title">{s.title}</span>
                  <span className="checkout__confirm-note">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="form-actions">
            <Button onClick={() => navigate("/profile")}>Перейти в кабинет</Button>
            <Button as={Link} to="/" variant="ghost">
              Вернуться в каталог
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
