import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Field } from "../components/ui/Field.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { Checklist } from "../components/ui/Checklist.jsx";
import "./AuthPages.css";

/*
  B2B-регистрация: аккаунт заводится на компанию, подписант известен из
  сертификата ЭЦП. Реального подписания нет — это прототип.
*/
export function RegisterPage() {
  const { registerCompany } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "",
    bin: "",
    signer: "",
    iin: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.company.trim()) next.company = "Укажите название";
    if (!/^\d{12}$/.test(form.bin.trim())) next.bin = "БИН — 12 цифр";
    if (!form.email.includes("@")) next.email = "Нужен рабочий email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    registerCompany(form);
    navigate("/profile");
  };

  return (
    <div className="auth auth--wide">
      <Card className="auth__card" as="form" onSubmit={submit}>
        <div className="auth__head">
          <h1 className="auth__title serif">Регистрация бизнеса</h1>
          <span className="auth__subtitle">
            Аккаунт заводится на компанию. Подписант берётся из сертификата ЭЦП.
          </span>
        </div>

        <div className="field-grid">
          <Field
            label="Название ИП или ТОО"
            placeholder="ИП Ахметов А."
            value={form.company}
            onChange={set("company")}
            error={errors.company}
          />
          <Field
            label="БИН"
            placeholder="123456789012"
            value={form.bin}
            onChange={set("bin")}
            error={errors.bin}
          />
          <Field
            label="Подписант"
            placeholder="Ахметов Арман"
            value={form.signer}
            onChange={set("signer")}
            hint="Как в сертификате ЭЦП"
          />
          <Field label="ИИН подписанта" placeholder="900101300123" value={form.iin} onChange={set("iin")} />
          <Field
            label="Email"
            type="email"
            placeholder="arman@company.kz"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
          />
          <Field label="Телефон" placeholder="+7 700 000 00 00" value={form.phone} onChange={set("phone")} />
        </div>

        <Notice>Подписание ЭЦП в прототипе не выполняется — кнопка просто заводит аккаунт.</Notice>

        <Button full type="submit">
          Подписать ЭЦП и продолжить
        </Button>

        <span className="auth__foot">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </span>
      </Card>

      <Card className="auth__aside">
        <span className="auth__aside-title">Что даёт аккаунт</span>
        <Checklist
          items={[
            "Один счёт на связь и сервисы",
            "Договоры и акты в электронном виде",
            "Подключение сервисов без визита в офис",
            "Персональный менеджер на пакетах Business Office и выше",
          ]}
        />
      </Card>
    </div>
  );
}
