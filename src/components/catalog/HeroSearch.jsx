import { useTypewriter } from "../../hooks/useTypewriter.js";
import { Button } from "../ui/Button.jsx";
import { IconSearch } from "../ui/icons.jsx";
import "./HeroSearch.css";

/*
  Приветствие и AI-поиск. Композиция центрированная, как на референсе:
  метка, display-заголовок serif, две строки пояснения, поле и одно
  действие под ним.

  Плейсхолдер в поле не настоящий: поверх input лежит слой с набираемым
  текстом и кареткой. Иначе анимацию нельзя было бы оформить — у
  ::placeholder нет ни каретки, ни посимвольного вывода.
*/
export function HeroSearch({ hero, value, onChange, onSubmit, onBrowse }) {
  const typed = useTypewriter(hero.queries, value.length > 0);

  return (
    <section className="hero">
      <span className="hero__mark" aria-hidden="true">
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          <circle cx="40" cy="30" r="19" fill="var(--bg-sunken)" />
          <path
            d="M39 27 61 48.5 50.5 50 55.5 63.5 49.5 65.5 44.5 52 36.5 58.5z"
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h1 className="hero__title serif">{hero.greeting}</h1>
      <p className="hero__subtitle">{hero.subtitle}</p>

      <form
        className="hero__form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="hero__field">
          <IconSearch size={18} />

          <div className="hero__input-wrap">
            <input
              className="hero__input"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              aria-label="Опишите задачу"
            />
            {value.length === 0 && (
              <span className="hero__ghost" aria-hidden="true">
                {typed}
                <span className="hero__caret" />
              </span>
            )}
          </div>

          <Button type="submit">Подобрать</Button>
        </div>
      </form>

      <button type="button" className="link-action hero__browse" onClick={onBrowse}>
        Смотреть весь каталог
      </button>
    </section>
  );
}
