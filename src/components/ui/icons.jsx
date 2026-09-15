/*
  Линейные иконки по правилам ДС: fill="none", stroke="currentColor",
  толщина 1.4 на 15-16px и 1.25 на 20-28px. Залитых, цветных и эмодзи быть
  не должно. Формы взяты из раздела «Сетка, тени, иконки» библиотеки.
*/

function Svg({ size = 16, stroke, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke ?? (size >= 20 ? 1.25 : 1.4)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M5 20v-9l7-5 7 5v9z" />
  </Svg>
);

export const IconGrid = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 12h8" />
  </Svg>
);

export const IconCard = (p) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
  </Svg>
);

export const IconDoc = (p) => (
  <Svg {...p}>
    <path d="M7 4h7l4 4v12H7z" />
    <path d="M14 4v4h4" />
  </Svg>
);

export const IconClipboard = (p) => (
  <Svg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h5" />
  </Svg>
);

export const IconUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c0-3.5 3.2-5.5 7-5.5s7 2 7 5.5" />
  </Svg>
);

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
);

export const IconFilters = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M7 12h10M10 17h4" />
  </Svg>
);

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const IconAlert = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16h.01" />
  </Svg>
);

export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5 1.5 5h-15S6 14 6 10z" />
    <path d="M10.5 19a1.8 1.8 0 0 0 3 0" />
  </Svg>
);

export const IconCart = (p) => (
  <Svg {...p}>
    <path d="M4 5h2l2 10h9l2-7H7" />
    <circle cx="9.5" cy="19" r="1.3" />
    <circle cx="16.5" cy="19" r="1.3" />
  </Svg>
);

export const IconPhone = (p) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a10 10 0 0 0 5 5L15 13l5 2v4h-3A14 14 0 0 1 5 7z" />
  </Svg>
);

export const IconBook = (p) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h4" />
  </Svg>
);

export const IconChart = (p) => (
  <Svg {...p}>
    <path d="M4 18V9M10 18V5M16 18v-6M4 20h16" />
  </Svg>
);

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7z" />
  </Svg>
);

export const IconBox = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 12h8M12 8v8" />
  </Svg>
);

export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </Svg>
);

export const IconStar = (p) => (
  <Svg {...p}>
    <path d="m12 4 2.3 5 5.2.6-3.9 3.5 1.1 5.2-4.7-2.7-4.7 2.7 1.1-5.2L4.5 9.6 9.7 9z" />
  </Svg>
);

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </Svg>
);

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
  </Svg>
);

export const IconSignature = (p) => (
  <Svg {...p}>
    <path d="M4 17c3-6 5-8 6.5-8s1 4-.5 6 0 3 2 2 3.5-3 5-3 2 1 3 1" />
  </Svg>
);

/* Иконки тарифных колонок — «дерево» из библиотеки, растёт по старшинству. */
export const IconPlanS = (p) => (
  <Svg size={28} stroke={1.2} {...p}>
    <circle cx="12" cy="5" r="2.4" />
    <path d="M12 7.4V20M12 12l-4.5 3M12 12l4.5 3" />
  </Svg>
);

export const IconPlanM = (p) => (
  <Svg size={28} stroke={1.2} {...p}>
    <circle cx="12" cy="5" r="2.4" />
    <circle cx="6" cy="10.5" r="1.8" />
    <circle cx="18" cy="10.5" r="1.8" />
    <path d="M12 7.4V20M12 12l-4.6-1M12 12l4.6-1" />
  </Svg>
);

export const IconPlanL = (p) => (
  <Svg size={28} stroke={1.2} {...p}>
    <circle cx="12" cy="4.5" r="2.2" />
    <circle cx="5" cy="9.5" r="1.7" />
    <circle cx="19" cy="9.5" r="1.7" />
    <circle cx="8" cy="14" r="1.7" />
    <circle cx="16" cy="14" r="1.7" />
    <path d="M12 6.7V20M12 11l-5.3-1M12 11l5.3-1M12 15l-2.6-.6M12 15l2.6-.6" />
  </Svg>
);

/* Каталог обращается к иконке по строковому ключу из контента. */
const BY_NAME = {
  book: IconBook,
  card: IconCard,
  clock: IconClock,
  box: IconBox,
  chart: IconChart,
  doc: IconDoc,
  shield: IconShield,
  phone: IconPhone,
  grid: IconGrid,
  star: IconStar,
  signature: IconSignature,
  clipboard: IconClipboard,
  user: IconUser,
  cart: IconCart,
  home: IconHome,
};

export function Icon({ name, ...rest }) {
  const Cmp = BY_NAME[name] || IconBox;
  return <Cmp {...rest} />;
}

export const PLAN_ICONS = { s: IconPlanS, m: IconPlanM, l: IconPlanL };
