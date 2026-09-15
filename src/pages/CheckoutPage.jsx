import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Field } from "../components/ui/Field.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { Price, formatPrice } from "../components/ui/Price.jsx";
import { Checklist } from "../components/ui/Checklist.jsx";
import "./CheckoutPage.css";

/*
  Экран «Заявка на подключение» из ДС: две колонки — форма и сводка с
  ценой. Основное действие одно и стоит внизу формы.
*/
export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: user?.company || "",
    bin: user?.bin || "",
    signer: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (items.length === 0) {
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

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.company.trim()) next.company = "Укажите название ИП или ТОО";
    if (!/^\d{12}$/.test(form.bin.trim())) next.bin = "БИН или ИИН — 12 цифр";
    if (!form.email.includes("@")) next.email = "Нужен рабочий email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const order = createOrder({
      items,
      total: subtotal,
      payment: "Счёт на оплату",
      buyerEmail: form.email,
    });
    clear();
    navigate(`/profile?order=${order.id}`);
  };

  return (
    <>
      <PageHead
        crumbs={[{ label: "Корзина", to: "/cart" }, { label: "Заявка" }]}
        title="Заявка на подключение"
        subtitle="Проверьте реквизиты — счёт и договор придут на указанный email"
      />

      <form className="checkout" onSubmit={submit}>
        <Card className="checkout__form">
          <div className="checkout__group">
            <span className="checkout__group-title">Реквизиты</span>
            <div className="field-grid">
              <Field
                label="Название ИП или ТОО"
                placeholder="ИП Ахметов А."
                value={form.company}
                onChange={set("company")}
                error={errors.company}
                hint="Как в свидетельстве о регистрации"
              />
              <Field
                label="БИН / ИИН"
                placeholder="123456789012"
                value={form.bin}
                onChange={set("bin")}
                error={errors.bin}
                hint="12 цифр без пробелов"
              />
            </div>
          </div>

          <div className="checkout__group">
            <span className="checkout__group-title">Контакты</span>
            <div className="field-grid">
              <Field
                label="Подписант"
                placeholder="Ахметов Арман"
                value={form.signer}
                onChange={set("signer")}
              />
              <Field
                label="Email"
                type="email"
                placeholder="arman@company.kz"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <Field
                label="Телефон"
                placeholder="+7 700 000 00 00"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
          </div>

          <div className="checkout__group">
            <span className="checkout__group-title">Комментарий</span>
            <Field
              as="textarea"
              placeholder="Например: подключить с 1 октября"
              value={form.comment}
              onChange={set("comment")}
              hint="Необязательно"
            />
          </div>

          <Notice>
            Документы подписываются ЭЦП — ссылка придёт на email после проверки
            реквизитов.
          </Notice>

          <div className="form-actions">
            <Button type="submit">Отправить заявку</Button>
            <Button as={Link} to="/cart" variant="ghost">
              Вернуться в корзину
            </Button>
          </div>
        </Card>

        <Card className="checkout__summary">
          <span className="checkout__summary-title">В заявке</span>

          <div className="checkout__items">
            {items.map((item) => (
              <div className="checkout__item" key={item.id}>
                <span className="checkout__item-title">
                  {item.title}
                  {item.qty > 1 && <span className="checkout__item-qty num"> × {item.qty}</span>}
                </span>
                <span className="checkout__item-price num">
                  {item.price === 0 ? "В тарифе" : formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__total">
            <Price size="md" value={subtotal} note="в месяц" />
          </div>

          <Checklist
            items={[
              "Счёт на оплату в течение дня",
              "Договор на подпись ЭЦП",
              "Подключение до одного рабочего дня",
            ]}
          />
        </Card>
      </form>
    </>
  );
}
