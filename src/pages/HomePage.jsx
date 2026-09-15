import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { SectionHead } from "../components/layout/PageHead.jsx";
import { ProductCard } from "../components/product/ProductCard.jsx";
import { PlansSection } from "../components/catalog/PlansSection.jsx";
import { AiBanner } from "../components/catalog/AiBanner.jsx";
import { FaqSection } from "../components/catalog/FaqSection.jsx";
import { HeroSearch } from "../components/catalog/HeroSearch.jsx";
import { SearchField } from "../components/ui/Field.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { IconSearch, IconFilters } from "../components/ui/icons.jsx";
import "./HomePage.css";

// «1 решение», «2 решения», «6 решений» — счётчик стал динамическим
// вместе с переездом фильтра в сайдбар, и форма слова теперь меняется.
function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/*
  Мок «AI-подбора»: модели нет, но вести себя он должен предсказуемо.

  Раньше запрос совпадал, если хоть одно слово нашлось в карточке. Из-за
  этого «сдать отчётность без бухгалтера» возвращало пять решений из шести
  (слово «без» есть почти везде), а «принимать оплату картой» — ни одного:
  сравнивались пятибуквенные обрезки, и «карто» не совпадало с «карты».

  Сейчас: служебные слова выкидываются, остальные сравниваются по
  четырёхбуквенной основе с обеих сторон, «ё» приводится к «е». Совпадения
  считаются, и показывается только верхний ярус — решения с максимальным
  числом попаданий. Словарь синонимов лежит в контенте (solutions[].keywords),
  чтобы запрос «оплата картой» доходил до «Эквайринга», где слова «оплата»
  в описании нет.
*/
const STOP = new Set([
  "для", "без", "как", "что", "все", "мне", "нам", "это", "под", "при",
  "из", "на", "и", "с", "по", "от", "в", "не", "к", "о", "до", "за", "у",
  "мы", "я", "нужен", "нужно", "нужна",
]);

function stems(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .split(/[^a-zа-я0-9]+/i)
    .filter((w) => w.length >= 3 && !STOP.has(w))
    .map((w) => w.slice(0, 4));
}

function scoreOf(product, queryStems) {
  const hay = new Set(
    stems(
      [product.title, product.subtitle, ...(product.features || []), ...(product.keywords || [])]
        .join(" ")
    )
  );
  return queryStems.filter((st) => hay.has(st)).length;
}

export function HomePage() {
  const { content } = useContent();
  const { all } = useProducts();
  const { addItem, items } = useCart();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const catalogRef = useRef(null);
  const plansRef = useRef(null);
  const heroRef = useRef(null);

  // Категорию задаёт сайдбар через query — см. комментарий в Layout.jsx.
  const category = searchParams.get("category") || "all";

  const categoryById = useMemo(() => {
    const map = Object.fromEntries(content.categories.map((c) => [c.id, c]));
    return (id) => map[id] || null;
  }, [content.categories]);

  const visible = useMemo(() => {
    const byCategory = all.filter((p) => category === "all" || p.category === category);
    const queryStems = stems(query.trim());
    if (queryStems.length === 0) return byCategory;

    const scored = byCategory
      .map((p) => ({ p, score: scoreOf(p, queryStems) }))
      .filter((x) => x.score > 0);
    if (scored.length === 0) return [];

    const best = Math.max(...scored.map((x) => x.score));
    return scored.filter((x) => x.score === best).map((x) => x.p);
  }, [all, category, query]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runSearch = () => {
    setQuery(draft);
    scrollToCatalog();
  };

  // «Готовые пакеты» в сайдбаре ведут на /#plans — с любой страницы.
  useEffect(() => {
    if (location.hash === "#plans") {
      plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, location.key]);

  // Подсказка из промо-блока: подставляем фразу в поиск и уводим к выдаче.
  const askAssistant = (text) => {
    setDraft(text);
    setQuery(text);
    scrollToCatalog();
  };

  // Кнопка «Попробовать сейчас» ведёт к самому полю, а не к результатам:
  // подставлять нечего, человек будет формулировать сам.
  const startAssistant = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetSearch = () => {
    setDraft("");
    setQuery("");
  };

  const inCart = (id) => items.some((i) => i.id === id);

  const choosePlan = (plan) => {
    addItem({
      id: plan.id,
      title: `Тариф «${plan.name}»`,
      price: plan.price,
      seller: "Beeline Business",
      subtitle: plan.audience,
      icon: "phone",
    });
    navigate("/cart");
  };

  return (
    <>
      <HeroSearch
        hero={content.hero}
        value={draft}
        onChange={setDraft}
        onSubmit={runSearch}
        onBrowse={scrollToCatalog}
        sectionRef={heroRef}
      />

      <section className="section" id="catalog" ref={catalogRef}>
        <SectionHead
          title={content.catalog.title}
          subtitle={`${visible.length} ${plural(visible.length, "решение", "решения", "решений")} · ${content.catalog.subtitle}`}
          aside={
            <div className="catalog-tools">
              <SearchField
                icon={<IconSearch size={16} />}
                placeholder={content.catalog.searchPlaceholder}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setQuery(e.target.value);
                }}
              />
              <Button variant="secondary">
                <IconFilters size={16} />
                Фильтры
              </Button>
            </div>
          }
        />

        {query.trim() && (
          <Notice
            tone="info"
            action={
              <button type="button" className="link-action" onClick={resetSearch}>
                Сбросить
              </button>
            }
          >
            По запросу «{query.trim()}» подобрали решений: {visible.length}
          </Notice>
        )}

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categoryById(product.category)}
                inCart={inCart(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <span className="catalog-empty__title">Ничего не нашлось</span>
            <span className="catalog-empty__note">
              Опишите задачу другими словами или снимите фильтр по категории.
            </span>
          </div>
        )}
      </section>

      <PlansSection plans={content.plans} onChoose={choosePlan} sectionRef={plansRef} />

      <AiBanner
        banner={content.aiBanner}
        onSuggestion={askAssistant}
        onStart={startAssistant}
      />

      <FaqSection faq={content.faq} />
    </>
  );
}
