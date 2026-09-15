import { NavLink, Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useContent } from "../../context/ContentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { SearchField } from "../ui/Field.jsx";
import { Button } from "../ui/Button.jsx";
import { Icon, IconSearch, IconBell, IconCart, IconLayers } from "../ui/icons.jsx";
import "./Layout.css";

/*
  Каркас приложения по Screen Template дизайн-системы: топбар на всю
  ширину, под ним сайдбар 206px и рабочая область. Тень нигде не
  используется — разделяют только границы --border.

  Сайдбар взят из первой версии: три группы — категории каталога, быстрые
  ссылки и неактивная поддержка. Категория не хранится в состоянии
  страницы, а лежит в query (`/?category=connect`): сайдбар живёт в
  каркасе, каталог — на главной, и общий адрес дешевле общего контекста.
  Побочная польза — на категорию можно дать ссылку.
*/
export function Layout() {
  const { content } = useContent();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const onCatalog = location.pathname === "/";
  const activeCategory = onCatalog ? searchParams.get("category") || "all" : null;

  const goCategory = (id) => {
    navigate(id === "all" ? "/" : `/?category=${id}`);
  };

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
          <nav className="topbar__nav">
            {content.topbarNav.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  ["topbar__nav-link", isActive ? "topbar__nav-link--active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
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
          <div className="sidebar__group">
            <button
              type="button"
              className={[
                "sidebar__item",
                activeCategory === "all" ? "sidebar__item--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => goCategory("all")}
            >
              <IconLayers size={15} />
              <span className="sidebar__label">Все категории</span>
            </button>

            {content.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={[
                  "sidebar__item",
                  activeCategory === c.id ? "sidebar__item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => goCategory(c.id)}
              >
                <Icon name={c.icon} size={15} />
                <span className="sidebar__label">{c.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar__group">
            {content.quickLinks.map((item) => (
              <Link key={item.id} to={item.to} className="sidebar__item">
                <Icon name={item.icon} size={15} />
                <span className="sidebar__label">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="sidebar__group">
            {content.supportLinks.map((item) => (
              <button key={item.id} type="button" className="sidebar__item" disabled>
                <Icon name={item.icon} size={15} />
                <span className="sidebar__label">{item.label}</span>
              </button>
            ))}
          </div>

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
