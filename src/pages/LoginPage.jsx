import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Field } from "../components/ui/Field.jsx";
import "./AuthPages.css";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Нужен рабочий email");
      return;
    }
    login(email);
    navigate("/profile");
  };

  return (
    <div className="auth">
      <Card className="auth__card" as="form" onSubmit={submit}>
        <div className="auth__head">
          <h1 className="auth__title serif">Вход в кабинет</h1>
          <span className="auth__subtitle">
            Прототип: авторизация мок, пароль не спрашиваем.
          </span>
        </div>

        <Field
          label="Email"
          type="email"
          placeholder="arman@company.kz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <Button full type="submit">
          Войти
        </Button>

        <span className="auth__foot">
          Нет аккаунта? <Link to="/register">Зарегистрировать бизнес</Link>
        </span>
      </Card>
    </div>
  );
}
