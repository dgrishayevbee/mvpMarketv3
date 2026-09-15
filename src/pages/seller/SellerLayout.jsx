import { NavLink, Outlet } from "react-router-dom";
import "./SellerLayout.css";

/*
  Кабинет поставщика. Внутренняя навигация — сегменты по правилам ДС:
  плотные строки, активный пункт на --bg-sunken.
*/
const TABS = [
  { to: "/seller", label: "Сводка", end: true },
  { to: "/seller/products", label: "Товары" },
  { to: "/seller/orders", label: "Заявки" },
];

export function SellerLayout() {
  return (
    <div className="seller">
      <nav className="seller__tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              ["seller__tab", isActive ? "seller__tab--active" : ""].filter(Boolean).join(" ")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
