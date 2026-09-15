import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { SectionHead } from "../components/layout/PageHead.jsx";
import { ProductCard } from "../components/product/ProductCard.jsx";
import { PlansSection } from "../components/catalog/PlansSection.jsx";
import { HeroSearch } from "../components/catalog/HeroSearch.jsx";
import { SearchField } from "../components/ui/Field.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Chip } from "../components/ui/Chip.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { IconSearch, IconFilters } from "../components/ui/icons.jsx";
import "./HomePage.css";

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

  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const catalogRef = useRef(null);

  const categoryLabel = useMemo(() => {
    const map = Object.fromEntries(content.categories.map((c) => [c.id, c.label]));
    return (id) => map[id] || "";
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
    setCategory("all");
    scrollToCatalog();
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
      />

      <section className="section" id="catalog" ref={catalogRef}>
        <SectionHead
          title={content.catalog.title}
          subtitle={`${all.length} решений · ${content.catalog.subtitle}`}
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

        <div className="chip-row">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            Все
          </Chip>
          {content.categories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryLabel={categoryLabel(product.category)}
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

      <PlansSection plans={content.plans} onChoose={choosePlan} />
    </>
  );
}
