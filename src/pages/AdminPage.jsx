import { useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import { PageHead, SectionHead } from "../components/layout/PageHead.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Field } from "../components/ui/Field.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { IconPlus, IconTrash } from "../components/ui/icons.jsx";
import "./AdminPage.css";

/*
  Редактор контента. Правит те же данные, что показывает каталог, — через
  ContentContext, а не через JSX компонентов. Изменения живут в localStorage
  этого браузера, поэтому рядом лежат экспорт и импорт JSON.
*/
export function AdminPage() {
  const {
    content,
    updateHero,
    updateCatalog,
    updateSupport,
    addCategory,
    updateCategory,
    removeCategory,
    addSolution,
    updateSolution,
    removeSolution,
    updatePlans,
    updatePlan,
    removePlan,
    addPlan,
    exportJson,
    importJson,
    resetAll,
  } = useContent();

  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");

  const doExport = async () => {
    const json = exportJson();
    try {
      await navigator.clipboard.writeText(json);
      setMessage("JSON контента скопирован в буфер обмена.");
    } catch {
      setImportText(json);
      setMessage("Буфер недоступен — JSON положен в поле ниже.");
    }
  };

  const doImport = () => {
    try {
      importJson(importText);
      setMessage("Контент импортирован.");
    } catch {
      setMessage("Не похоже на JSON контента — импорт не выполнен.");
    }
  };

  return (
    <>
      <PageHead
        crumbs={[{ label: "Контент" }]}
        title="Редактор контента"
        subtitle="Тексты каталога, категории, решения и тарифы"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={doExport}>
              Экспорт JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={resetAll}>
              Сбросить всё
            </Button>
          </>
        }
      />

      {message && <Notice tone="info">{message}</Notice>}

      <section className="section">
        <SectionHead
          title="Приветствие и AI-поиск"
          subtitle="Блок над каталогом: заголовок, пояснение и фразы, которые набираются в поле"
        />
        <Card>
          <Field
            label="Заголовок"
            value={content.hero.greeting}
            onChange={(e) => updateHero({ greeting: e.target.value })}
          />
          <Field
            as="textarea"
            label="Пояснение"
            value={content.hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
          />
          <Field
            as="textarea"
            label="Фразы поиска"
            value={content.hero.queries.join("\n")}
            onChange={(e) =>
              updateHero({
                queries: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
              })
            }
            hint="По одной фразе в строке — они набираются и стираются по очереди"
          />
        </Card>
      </section>

      <section className="section">
        <SectionHead title="Каталог" subtitle="Заголовок экрана и подпись под ним" />
        <Card>
          <div className="field-grid">
            <Field
              label="Заголовок"
              value={content.catalog.title}
              onChange={(e) => updateCatalog({ title: e.target.value })}
            />
            <Field
              label="Плейсхолдер поиска"
              value={content.catalog.searchPlaceholder}
              onChange={(e) => updateCatalog({ searchPlaceholder: e.target.value })}
            />
          </div>
          <Field
            label="Подпись"
            value={content.catalog.subtitle}
            onChange={(e) => updateCatalog({ subtitle: e.target.value })}
          />
          <Field
            label="Заметка о менеджере в сайдбаре"
            value={content.support.managerNote}
            onChange={(e) => updateSupport({ managerNote: e.target.value })}
          />
        </Card>
      </section>

      <section className="section">
        <SectionHead
          title="Категории"
          subtitle="Чипы-фильтры над сеткой каталога"
          aside={
            <Button size="sm" variant="secondary" onClick={() => addCategory({ label: "Новая категория" })}>
              <IconPlus size={16} />
              Добавить
            </Button>
          }
        />
        <Card pad="md">
          {content.categories.map((c) => (
            <div className="admin-row" key={c.id}>
              <Field
                value={c.label}
                onChange={(e) => updateCategory(c.id, { label: e.target.value })}
              />
              <span className="admin-row__id num">{c.id}</span>
              <button className="btn-icon-danger" onClick={() => removeCategory(c.id)} aria-label="Удалить">
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </Card>
      </section>

      <section className="section">
        <SectionHead
          title="Решения"
          subtitle="Карточки каталога"
          aside={
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                addSolution({
                  title: "Новое решение",
                  subtitle: "Одно предложение о пользе",
                  category: content.categories[0]?.id,
                  price: 0,
                  priceNote: "в месяц",
                  icon: "box",
                  seller: "Beeline Business",
                  features: [],
                })
              }
            >
              <IconPlus size={16} />
              Добавить
            </Button>
          }
        />
        <div className="admin-cards">
          {content.solutions.map((s) => (
            <Card pad="md" key={s.id}>
              <div className="admin-card__head">
                <Field value={s.title} onChange={(e) => updateSolution(s.id, { title: e.target.value })} />
                <button className="btn-icon-danger" onClick={() => removeSolution(s.id)} aria-label="Удалить">
                  <IconTrash size={16} />
                </button>
              </div>
              <Field
                label="Описание"
                value={s.subtitle}
                onChange={(e) => updateSolution(s.id, { subtitle: e.target.value })}
              />
              <div className="field-grid">
                <Field label="Категория">
                  <select
                    className="field__control"
                    value={s.category}
                    onChange={(e) => updateSolution(s.id, { category: e.target.value })}
                  >
                    {content.categories.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Цена, ₸"
                  type="number"
                  value={s.price}
                  onChange={(e) => updateSolution(s.id, { price: Number(e.target.value) })}
                />
                <Field
                  label="Подпись к цене"
                  value={s.priceNote || ""}
                  onChange={(e) => updateSolution(s.id, { priceNote: e.target.value })}
                />
                <Field
                  label="Цена текстом"
                  value={s.priceLabel || ""}
                  hint="Перекрывает число: «от 1,9%»"
                  onChange={(e) => updateSolution(s.id, { priceLabel: e.target.value })}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead
          title="Тарифы"
          subtitle="Колонки тарифных планов"
          aside={
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                addPlan({
                  name: "Новый тариф",
                  audience: "Для кого",
                  price: 0,
                  priceNote: "В месяц",
                  icon: "s",
                  cta: "Подключить",
                  ctaVariant: "primary",
                  features: [],
                })
              }
            >
              <IconPlus size={16} />
              Добавить
            </Button>
          }
        />
        <Card pad="md">
          <Field
            label="Заголовок секции"
            value={content.plans.title}
            onChange={(e) => updatePlans({ title: e.target.value })}
          />
          <Field
            label="Подпись секции"
            value={content.plans.subtitle}
            onChange={(e) => updatePlans({ subtitle: e.target.value })}
          />
        </Card>
        <div className="admin-cards">
          {content.plans.items.map((p) => (
            <Card pad="md" key={p.id}>
              <div className="admin-card__head">
                <Field value={p.name} onChange={(e) => updatePlan(p.id, { name: e.target.value })} />
                <button className="btn-icon-danger" onClick={() => removePlan(p.id)} aria-label="Удалить">
                  <IconTrash size={16} />
                </button>
              </div>
              <div className="field-grid">
                <Field
                  label="Для кого"
                  value={p.audience}
                  onChange={(e) => updatePlan(p.id, { audience: e.target.value })}
                />
                <Field
                  label="Цена, ₸"
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePlan(p.id, { price: Number(e.target.value) })}
                />
              </div>
              <Field
                label="Сноска под ценой"
                value={p.priceNote}
                onChange={(e) => updatePlan(p.id, { priceNote: e.target.value })}
              />
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead title="Импорт" subtitle="Вставьте JSON, снятый экспортом" />
        <Card pad="md">
          <Field
            as="textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"catalog": {...}}'
          />
          <div>
            <Button size="sm" onClick={doImport} disabled={!importText.trim()}>
              Импортировать
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}
