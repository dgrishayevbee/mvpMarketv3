import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { SectionHead } from "../components/layout/PageHead.jsx";
import { ProductCard } from "../components/product/ProductCard.jsx";
import { PlansSection } from "../components/catalog/PlansSection.jsx";
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

// Поиск по запросу на естественном языке: слова короче трёх букв
// отбрасываются, остальные ищутся в названии, описании и составе решения.
// Это мок «AI-подбора» — без модели, но ведёт себя предсказуемо.
function matches(product, query) {
  const words = query
    .toLowerCase()
    .split(/[^a-zа-яё0-9]+/i)
    .filter((w) => w.length >= 3);

  if (words.length === 0) return true;

  const haystack = [product.title, product.subtitle, ...(product.features || [])]
    .join(" ")
    .toLowerCase();

  return words.some((word) => haystack.includes(word.slice(0, 5)));
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

  // Категорию задаёт сайдбар через query — см. комментарий в Layout.jsx.
  const category = searchParams.get("category") || "all";

  const categoryById = useMemo(() => {
    const map = Object.fromEntries(content.categories.map((c) => [c.id, c]));
    return (id) => map[id] || null;
  }, [content.categories]);

  const visible = useMemo(() => {
    const q = query.trim();
    return all.filter((p) => {
      const byCategory = category === "all" || p.category === category;
      return byCategory && (!q || matches(p, q));
    });
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

      <FaqSection faq={content.faq} />
    </>
  );
}
