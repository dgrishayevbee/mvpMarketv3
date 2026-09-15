import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultContent, CONTENT_VERSION } from "../data/siteContent.js";

const ContentContext = createContext(null);

const CONTENT_KEY = "mvpmarket:content";
const VERSION_KEY = "mvpmarket:content-version";

// Контент живёт в localStorage, а значит у каждого посетителя своя копия.
// Когда в siteContent.js выкатывается новый текст, старая копия его перекрыла
// бы — и владелец правок видел бы одно, а все остальные другое. Поэтому при
// смене CONTENT_VERSION сохранённая копия отбрасывается. Делается это до
// первого рендера, чтобы страница сразу отрисовалась новым контентом.
function dropOutdatedContent() {
  try {
    if (window.localStorage.getItem(VERSION_KEY) !== CONTENT_VERSION) {
      window.localStorage.removeItem(CONTENT_KEY);
      window.localStorage.setItem(VERSION_KEY, CONTENT_VERSION);
    }
  } catch {
    // localStorage недоступен — работаем на дефолтах, это и нужно
  }
}

dropOutdatedContent();

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Сохранённый контент кладётся поверх дефолтов, а не вместо них: поля,
// добавленные в siteContent.js уже после того, как у пользователя завёлся
// localStorage (например oldPrice у пакета), иначе никогда бы до него не
// доехали. Элементы списков сопоставляются по id — состав и порядок берём
// из сохранённого (удаление в /admin должно работать), недостающие поля
// подмешиваем из дефолтного элемента с тем же id.
function mergeDeep(defaults, saved) {
  if (saved === undefined) return defaults;

  if (Array.isArray(defaults)) {
    if (!Array.isArray(saved)) return saved;
    return saved.map((item) => {
      if (!isPlainObject(item) || item.id === undefined) return item;
      const base = defaults.find((d) => isPlainObject(d) && d.id === item.id);
      return base ? mergeDeep(base, item) : item;
    });
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(saved)) return saved;
    const merged = { ...defaults };
    for (const key of Object.keys(saved)) {
      merged[key] = mergeDeep(defaults[key], saved[key]);
    }
    return merged;
  }

  return saved;
}

function mergeWithDefaults(saved) {
  if (!isPlainObject(saved)) return defaultContent;
  return mergeDeep(defaultContent, saved);
}

export function ContentProvider({ children }) {
  const [stored, setContent] = useLocalStorage(CONTENT_KEY, defaultContent);
  const content = useMemo(() => mergeWithDefaults(stored), [stored]);

  const value = useMemo(() => {
    const updateSection = (key, patch) =>
      setContent((c) => ({ ...c, [key]: { ...c[key], ...patch } }));

    const addItem = (key, item, prefix) =>
      setContent((c) => ({ ...c, [key]: [...c[key], { id: makeId(prefix || key), ...item }] }));

    const updateItem = (key, id, patch) =>
      setContent((c) => ({
        ...c,
        [key]: c[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));

    const removeItem = (key, id) =>
      setContent((c) => ({ ...c, [key]: c[key].filter((item) => item.id !== id) }));

    // Тарифы лежат вложенно (plans.items), поэтому у них свои три метода.
    const updatePlans = (patch) => updateSection("plans", patch);

    const addPlan = (item) =>
      setContent((c) => ({
        ...c,
        plans: { ...c.plans, items: [...c.plans.items, { id: makeId("plan"), ...item }] },
      }));

    const updatePlan = (id, patch) =>
      setContent((c) => ({
        ...c,
        plans: {
          ...c.plans,
          items: c.plans.items.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        },
      }));

    const removePlan = (id) =>
      setContent((c) => ({
        ...c,
        plans: { ...c.plans, items: c.plans.items.filter((t) => t.id !== id) },
      }));

    return {
      content,

      updateSection,
      updateBrand: (patch) => updateSection("brand", patch),
      updateHero: (patch) => updateSection("hero", patch),
      updateCatalog: (patch) => updateSection("catalog", patch),
      updateSupport: (patch) => updateSection("support", patch),
      updateCabinet: (patch) => updateSection("cabinet", patch),

      addCategory: (item) => addItem("categories", item, "cat"),
      updateCategory: (id, patch) => updateItem("categories", id, patch),
      removeCategory: (id) => removeItem("categories", id),

      addSolution: (item) => addItem("solutions", item, "sol"),
      updateSolution: (id, patch) => updateItem("solutions", id, patch),
      removeSolution: (id) => removeItem("solutions", id),

      addNavItem: (item) => addItem("nav", item, "nav"),
      updateNavItem: (id, patch) => updateItem("nav", id, patch),
      removeNavItem: (id) => removeItem("nav", id),

      updatePlans,
      addPlan,
      updatePlan,
      removePlan,

      exportJson: () => JSON.stringify(content, null, 2),
      importJson: (text) => {
        const parsed = JSON.parse(text);
        setContent(mergeWithDefaults(parsed));
      },
      resetAll: () => setContent(defaultContent),
      resetSection: (key) => setContent((c) => ({ ...c, [key]: defaultContent[key] })),
    };
  }, [content, setContent]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
