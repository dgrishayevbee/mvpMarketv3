import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useContent } from "../../context/ContentContext.jsx";
import { PageHead } from "../../components/layout/PageHead.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Field } from "../../components/ui/Field.jsx";

const SELLER = "Beeline Business";
const ICONS = ["box", "card", "book", "phone", "chart", "doc", "shield", "grid", "clock", "star", "signature"];

export function SellerProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, addProduct, updateProduct } = useProducts();
  const { content } = useContent();

  const existing = id ? getById(id) : null;

  const [form, setForm] = useState({
    title: existing?.title || "",
    subtitle: existing?.subtitle || "",
    category: existing?.category || content.categories[0]?.id || "",
    price: existing?.price ?? 0,
    priceNote: existing?.priceNote || "в месяц",
    icon: existing?.icon || "box",
    features: (existing?.features || []).join("\n"),
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "Название обязательно";
    if (!form.subtitle.trim()) next.subtitle = "Одно предложение о пользе";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const data = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      priceNote: form.priceNote,
      icon: form.icon,
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (existing) {
      updateProduct(existing.id, data);
    } else {
      addProduct(data, SELLER);
    }
    navigate("/seller/products");
  };

  return (
    <>
      <PageHead
        crumbs={[
          { label: "Кабинет поставщика", to: "/seller" },
          { label: "Товары", to: "/seller/products" },
          { label: existing ? "Правка" : "Новый товар" },
        ]}
        title={existing ? form.title || "Правка товара" : "Новый товар"}
        subtitle="Позиция появится в каталоге сразу после сохранения"
      />

      <Card as="form" onSubmit={submit}>
        <div className="field-grid">
          <Field label="Название" value={form.title} onChange={set("title")} error={errors.title} />
          <Field label="Категория">
            <select className="field__control" value={form.category} onChange={set("category")}>
              {content.categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Описание"
          value={form.subtitle}
          onChange={set("subtitle")}
          error={errors.subtitle}
          hint="Одно предложение о пользе, без цены и призыва"
        />

        <div className="field-grid">
          <Field label="Цена, ₸" type="number" value={form.price} onChange={set("price")} />
          <Field label="Подпись к цене" value={form.priceNote} onChange={set("priceNote")} />
          <Field label="Иконка">
            <select className="field__control" value={form.icon} onChange={set("icon")}>
              {ICONS.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          as="textarea"
          label="Что входит"
          value={form.features}
          onChange={set("features")}
          hint="По одному пункту в строке"
        />

        <div className="form-actions">
          <Button type="submit">{existing ? "Сохранить" : "Добавить в каталог"}</Button>
          <Button as={Link} to="/seller/products" variant="ghost">
            Отмена
          </Button>
        </div>
      </Card>
    </>
  );
}
