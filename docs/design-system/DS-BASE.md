# DS-BASE — paste-ready блоки

## 1. Токены (helmet). Копировать целиком в начало шаблона любого экрана

```html
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300..700;1,7..72,400&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
:root{
  --bg:#F7F5F1; --bg-sunken:#EFEBE3; --surface:#FFFFFF; --surface-2:#FBFAF7;
  --border:#E7E1D7; --border-strong:#CFC8BA;
  --ink:#1A1A18; --ink-2:#57534C; --ink-3:#8B8579;
  --accent:#141413; --accent-hover:#333230; --accent-ink:#FFFFFF;
  --brand:#FFCC00; --brand-ink:#1A1A18;
  --success:#2C6A4C; --success-bg:#E7F0EA; --warning:#8A5710; --warning-bg:#FAEFD9;
  --error:#9A2A25; --error-bg:#F8E8E5; --info:#2D4F7A; --info-bg:#E8EEF6;
  --font-serif:"Literata",Georgia,serif; --font-sans:"Golos Text","Helvetica Neue",sans-serif;
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:999px;
  --shadow-sm:0 1px 2px rgba(26,26,24,.04); --shadow-md:0 2px 6px rgba(26,26,24,.05),0 14px 30px -14px rgba(26,26,24,.12);
  --card-border:1px solid var(--border); --card-shadow:none;
  --pad-card:28px; --row-h:44px;
}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-sans);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;text-wrap:pretty;}
a{color:var(--ink);text-decoration:underline;text-decoration-color:var(--border-strong);text-underline-offset:3px;}
a:hover{color:var(--accent);text-decoration-color:var(--ink-3);}
</style>
</helmet>
```

## 2. Типографика

| роль | стиль |
|---|---|
| display | `font-family:var(--font-serif);font-weight:400;font-size:52px;line-height:1.05;letter-spacing:-0.02em` |
| h1 экрана | `font-family:var(--font-serif);font-weight:400;font-size:30–38px;line-height:1.15;letter-spacing:-0.02em` |
| h3 карточки | `font-size:18–21px;font-weight:600;letter-spacing:-0.01em` (serif — для названий продуктов и тарифов) |
| body | `font-size:15px;line-height:1.5;color:var(--ink-2)` |
| caption | `font-size:12px;color:var(--ink-3)` |
| цена / сумма | `font-size:24–38px;font-weight:600;letter-spacing:-0.01em;font-variant-numeric:tabular-nums` |
| метрика | `font-family:var(--font-serif);font-size:28px;line-height:1.1` |

## 3. Кнопки

```html
<!-- primary -->
<button style="height:var(--row-h);padding:0 20px;border:none;border-radius:var(--r-sm);background:var(--accent);color:var(--accent-ink);font-family:var(--font-sans);font-size:15px;font-weight:500;white-space:nowrap;cursor:pointer;" style-hover="background:var(--accent-hover);">Подключить</button>

<!-- secondary -->
<button style="height:var(--row-h);padding:0 20px;border:1px solid var(--border-strong);border-radius:var(--r-sm);background:var(--surface);color:var(--ink);font-family:var(--font-sans);font-size:15px;font-weight:500;white-space:nowrap;cursor:pointer;" style-hover="background:var(--bg-sunken);">Подробнее</button>

<!-- ghost -->
<button style="height:var(--row-h);padding:0 14px;border:none;border-radius:var(--r-sm);background:transparent;color:var(--ink-2);font-family:var(--font-sans);font-size:15px;font-weight:500;white-space:nowrap;cursor:pointer;" style-hover="background:var(--bg-sunken);color:var(--ink);">Отмена</button>

<!-- текстовая ссылка-действие -->
<a href="#" style="display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;text-decoration:none;color:var(--ink);border-bottom:1px solid var(--border-strong);padding-bottom:1px;" style-hover="border-color:var(--ink);">Все условия</a>
```
Плотные строки: `height:36px;padding:0 14px;font-size:13px`.

## 4. Карточка (база)

```html
<div style="background:var(--surface);border:var(--card-border);box-shadow:var(--card-shadow);border-radius:var(--r-lg);padding:var(--pad-card);display:flex;flex-direction:column;gap:14px;transition:box-shadow .18s,border-color .18s;" style-hover="border-color:var(--border-strong);box-shadow:var(--shadow-sm);">…</div>
```

## 5. Карточка партнёра в каталоге
Лого-плитка 56px (`background:var(--accent)` / контур / `--brand`) → название serif 21px → одно предложение `15px/1.5 --ink-2` → снизу `margin-top:auto` категория 13px с линейной иконкой. Без цены и кнопки.

## 6. Поле ввода

```html
<label style="display:flex;flex-direction:column;gap:6px;">
  <span style="font-size:13px;font-weight:500;">Название ИП</span>
  <input type="text" placeholder="ИП Ахметов А." style="height:var(--row-h);padding:0 12px;border:1px solid var(--border-strong);border-radius:var(--r-sm);background:var(--surface);font-family:var(--font-sans);font-size:15px;color:var(--ink);outline:none;" style-focus="border-color:var(--accent);box-shadow:0 0 0 1px var(--accent);" />
  <span style="font-size:12px;color:var(--ink-3);">Как в свидетельстве о регистрации</span>
</label>
```
Ошибка: `border-color:var(--error)` + подсказка `color:var(--error)` с иконкой 13px. Сетка формы: `display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px`.

## 7. Статус и бейдж

```html
<!-- статус -->
<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--success);white-space:nowrap;"><span style="width:6px;height:6px;border-radius:50%;background:currentColor;"></span>Активен</span>
<!-- нейтральный тег -->
<span style="padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--border-strong);font-size:12px;color:var(--ink-2);white-space:nowrap;">Связь</span>
<!-- акцентный лейбл -->
<span style="padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--ink);color:var(--ink);font-size:12px;font-weight:500;">Хит</span>
```
Цвета статусов: success — активен/готово, warning — ждёт документов, error — отклонено, info — на проверке.

## 8. Чеклист

```html
<div style="display:flex;gap:10px;font-size:14px;line-height:1.45;color:var(--ink-2);">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" stroke-width="1.4" style="flex:0 0 16px;margin-top:3px;"><path d="m5 12.5 4.5 4.5L19 7"></path></svg>Онлайн-бухгалтерия
</div>
```

## 9. Строка списка / таблицы

```html
<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--border);">
  <div style="width:32px;height:32px;flex:0 0 32px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;">…icon…</div>
  <div style="flex:1;min-width:0;display:flex;flex-direction:column;"><span style="font-size:14px;font-weight:500;">Тариф «Дело M»</span><span style="font-size:12px;color:var(--ink-3);">3 номера · до 1 окт</span></div>
  <span style="font-size:13px;font-variant-numeric:tabular-nums;color:var(--ink-2);">7 900 ₸</span>
  …статус…
</div>
```

## 10. Колонки тарифов
Одна карточка `--r-lg`, внутри `display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr))`, колонки разделены `border-right:1px solid var(--border)` (последняя — без). Порядок внутри колонки: иконка 28px → название serif 34px → подзаголовок → цена sans 600 → сноска 13px `--ink-3` → primary на всю ширину → `border-top` → чеклист «Всё из …, плюс:».

## 11. Полоса-уведомление

```html
<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--warning-bg);border-radius:var(--r-md);">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="1.4" style="flex:0 0 18px;"><circle cx="12" cy="12" r="9"></circle><path d="M12 7.5v5M12 16h.01"></path></svg>
  <span style="flex:1;min-width:0;font-size:13px;color:var(--ink-2);">Не хватает справки о регистрации ИП.</span>
  <a href="#" style="font-size:13px;font-weight:500;text-decoration:none;border-bottom:1px solid var(--border-strong);">Загрузить</a>
</div>
```
Одна на экран.

## 12. Иконки
`fill="none" stroke="currentColor"`, stroke 1.4 при 15–16px, 1.25 при 20–28px, `stroke-linecap` по умолчанию. Библиотека форм — в разделе «Сетка, тени, иконки» файла `Beeline Business DS.dc.html`.
