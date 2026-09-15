import { Link } from "react-router-dom";
import { PageHead } from "../components/layout/PageHead.jsx";
import { Button } from "../components/ui/Button.jsx";

export function NotFoundPage() {
  return (
    <PageHead
      crumbs={[{ label: "404" }]}
      title="Страница не найдена"
      subtitle="Такого роута в прототипе нет."
      actions={
        <Button as={Link} to="/">
          В каталог
        </Button>
      }
    />
  );
}
