import { NavLink, Link, Outlet } from "react-router-dom";
import { useContent } from "../../context/ContentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { SearchField } from "../ui/Field.jsx";
import { Button } from "../ui/Button.jsx";
import {
  IconSearch,
  IconBell,
  IconCart,
  IconHome,
  IconGrid,
  IconCard,
  IconDoc,
  IconClipboard,
  IconUser,
} from "../ui/icons.jsx";
import "./Layout.css";

const NAV_ICONS = {
  home: IconHome,
  grid: IconGrid,
  card: IconCard,
  cart: IconCart,
  doc: IconDoc,
  clipboard: IconClipboard,
  user: IconUser,
};

/*
  Каркас приложения по Screen Template дизайн-системы: топбар на всю
  ширину, под ним сайдбар 206px и рабочая область. Тень нигде не
  используется — разделяют только границы --border.
*/
export function Layout() {
  const { content } = useContent();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const initials = (user?.name || "Гость")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <Link to="/" className="topbar__brand">
            <span className="topbar__mark" />
            <span className="topbar__name">{content.brand.name}</span>
          </Link>
          <span className="topbar__divider" />
          <span className="topbar__account">{user?.company || content.brand.account}</span>
        </div>

        <div className="topbar__right">
          <SearchField
            className="search--compact"
            icon={<IconSearch size={15} />}
            placeholder="Поиск"
            aria-label="Поиск"
          />
          <button className="topbar__icon-btn" type="button" aria-label="Уведомления">
            <IconBell size={16} />
          </button>
          <Link to="/cart" className="topbar__icon-btn" aria-label="Корзина">
            <IconCart size={16} />
            {count > 0 && <span className="topbar__count num">{count}</span>}
          </Link>
          {user ? (
            <button className="topbar__avatar" type="button" onClick={logout} title="Выйти">
              {initials}
            </button>
          ) : (
            <Button as={Link} to="/login" variant="secondary" size="sm">
              Войти
            </Button>
          )}
        </div>
      </header>

      <div className="app__body">
        <nav className="sidebar">
          {content.nav.map((item) => {
            const NavIcon = NAV_ICONS[item.icon] || IconGrid;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  ["sidebar__item", isActive ? "sidebar__item--active" : ""].filter(Boolean).join(" ")
                }
              >
                <NavIcon size={15} />
                <span className="sidebar__label">{item.label}</span>
                {item.id === "cart" && count > 0 && <span className="sidebar__badge num">{count}</span>}
              </NavLink>
            );
          })}

          <div className="sidebar__manager">
            <span className="sidebar__manager-text">{content.support.managerNote}</span>
            <Button variant="secondary" className="sidebar__manager-btn">
              Написать
            </Button>
          </div>
        </nav>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
