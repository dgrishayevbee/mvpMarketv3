import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useContent } from "../../context/ContentContext.jsx";
import { PageHead } from "../../components/layout/PageHead.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Row } from "../../components/ui/Row.jsx";
import { IconTile } from "../../components/ui/IconTile.jsx";
import { Tag } from "../../components/ui/Tag.jsx";
import { formatPrice } from "../../components/ui/Price.jsx";
import { Icon, IconPlus, IconTrash } from "../../components/ui/icons.jsx";

const SELLER = "Beeline Business";

export function SellerProductsPage() {
  const { listBySeller, deleteProduct } = useProducts();
  const { content } = useContent();
  const own = listBySeller(SELLER);

  const categoryLabel = (id) => content.categories.find((c) => c.id === id)?.label || "—";

  return (
    <>
      <PageHead
        crumbs={[{ label: "Кабинет поставщика", to: "/seller" }, { label: "Товары" }]}
        title="Товары"
        subtitle="Позиции, заведённые в кабинете. Дефолтные решения правятся в /admin"
        actions={
          <Button as={Link} to="/seller/products/new" size="sm">
            <IconPlus size={16} />
            Добавить товар
          </Button>
        }
      />

      <Card pad="md">
        {own.length === 0 ? (
          <span className="muted-note">
            Пока ничего не заведено. Добавьте позицию — она появится в каталоге.
          </span>
        ) : (
          own.map((p) => (
            <Row
              key={p.id}
              icon={
                <IconTile size={32}>
                  <Icon name={p.icon} size={16} />
                </IconTile>
              }
              title={p.title}
              subtitle={p.subtitle}
              amount={p.price === 0 ? "Бесплатно" : formatPrice(p.price)}
              trailing={<Tag tone="sunken">{categoryLabel(p.category)}</Tag>}
              actions={
                <>
                  <Button as={Link} to={`/seller/products/${p.id}/edit`} variant="secondary" size="sm">
                    Править
                  </Button>
                  <button className="btn-icon-danger" onClick={() => deleteProduct(p.id)} aria-label="Удалить">
                    <IconTrash size={16} />
                  </button>
                </>
              }
            />
          ))
        )}
      </Card>
    </>
  );
}
