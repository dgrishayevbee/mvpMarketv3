import { Button } from "../ui/Button.jsx";
import { Icon, IconSparkle } from "../ui/icons.jsx";
import "./AiBanner.css";

/*
  Промо ИИ-подбора. От первой версии остались только смысл и тексты:
  розово-оранжевый градиент с эмодзи заменён на одну жёлтую плоскость —
  это единственный цветной блок на странице, и он держится строго, без
  второго оттенка и без картинок.

  Подсказки не декоративные: клик подставляет фразу в поиск каталога и
  прокручивает к результатам, поэтому это кнопки, а не надписи.
*/
export function AiBanner({ banner, onSuggestion, onStart }) {
  if (!banner) return null;

  return (
    <section className="section ai-banner" id="ai">
      <div className="ai-banner__main">
        <h2 className="ai-banner__title serif">{banner.title}</h2>
        <p className="ai-banner__subtitle">{banner.subtitle}</p>
        <Button variant="ink" onClick={onStart} className="ai-banner__cta">
          <IconSparkle size={16} />
          {banner.ctaLabel}
        </Button>
      </div>

      <div className="ai-banner__suggestions">
        {banner.suggestions.map((s) => (
          <button
            key={s.id}
            type="button"
            className="ai-banner__suggestion"
            onClick={() => onSuggestion(s.text)}
          >
            <span className="ai-banner__suggestion-icon">
              <Icon name={s.icon} size={16} />
            </span>
            <span className="ai-banner__suggestion-text">{s.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
