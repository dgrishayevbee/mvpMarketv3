import { Button } from "../ui/Button.jsx";
import { Tag } from "../ui/Tag.jsx";
import { Price } from "../ui/Price.jsx";
import { Checklist } from "../ui/Checklist.jsx";
import { SectionHead } from "../layout/PageHead.jsx";
import "./PlansSection.css";

/*
  Тарифные пакеты. Порядок внутри колонки: название serif 34px →
  подзаголовок → цена sans 600 → сноска → кнопка на всю ширину → линия →
  чеклист «Всё из …, плюс:». Декоративная иконка над названием убрана —
  колонка начинается сразу с названия.

  Кнопка не кладёт пакет в корзину, а открывает его страницу — как плитка
  решения. В колонке видно только прибавку к младшему пакету, а полный
  состав и условия живут на странице.

  Каждая часть — отдельный элемент общей сетки, а не вложенный блок: колонки
  делят одни и те же строки (subgrid), поэтому цены, кнопки и чеклисты стоят
  на одной линии независимо от того, что у одного пакета есть бейдж, а у
  другого сноска в две строки. Вложенные обёртки это ломали бы: высота
  выравнивалась бы только у обёрток, а не у строк внутри них.
*/
export function PlansSection({ plans, onOpen, sectionRef }) {
  return (
    <section className="section" id="plans" ref={sectionRef}>
      <SectionHead title={plans.title} subtitle={plans.subtitle} />

      <div className="plans">
        {plans.items.map((plan) => {
          return (
            <div
              key={plan.id}
              className={["plan", plan.featured ? "plan--featured" : ""].filter(Boolean).join(" ")}
            >
              <div className="plan__name-row">
                <span className="plan__name serif">{plan.name}</span>
                {plan.badge && <Tag tone="solid">{plan.badge}</Tag>}
              </div>

              <span className="plan__audience">{plan.audience}</span>

              <Price value={plan.price} label={plan.priceLabel} />

              <span className="plan__note">{plan.priceNote}</span>

              <Button full variant={plan.ctaVariant || "primary"} onClick={() => onOpen(plan)}>
                {plan.cta}
              </Button>

              <div className="plan__features">
                <Checklist title={plan.inherit} items={plan.features} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
