import "./FaqSection.css";

/*
  Частые вопросы. Собран на <details>/<summary>, а не на состоянии React:
  так раскрытие работает с клавиатуры и со скринридером без единой строки
  обработчиков, а плюс переворачивается в крестик обычным details[open].

  Знак вопроса в шапке — не картинка, а буква тем же шрифтом, что и
  заголовок: Literata в тонком круге. Рисованная иконка тут спорила с
  типографикой блока, а «?» из гарнитуры заголовка садится в неё ровно.

  Секция уже ширины рабочей области и центрирована явной шириной
  (width: min(100%, N)), а не max-width с margin: auto — .content это
  flex-колонка, и на flex-элементе связка max-width + auto схлопнула бы
  блок в shrink-to-fit. Подробности в разделе 6.1 ARCHITECTURE.
*/
export function FaqSection({ faq }) {
  if (!faq?.items?.length) return null;

  return (
    <section className="section faq" id="faq">
      <div className="faq__head">
        <span className="faq__mark serif" aria-hidden="true">
          ?
        </span>
        <h2 className="faq__title serif">{faq.title}</h2>
        {faq.subtitle && <span className="faq__subtitle">{faq.subtitle}</span>}
      </div>

      <div className="faq__list">
        {faq.items.map((item) => (
          <details className="faq__item" key={item.id}>
            <summary className="faq__question">
              <span className="faq__question-text serif">{item.q}</span>
              <span className="faq__toggle" aria-hidden="true" />
            </summary>
            <p className="faq__answer">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
