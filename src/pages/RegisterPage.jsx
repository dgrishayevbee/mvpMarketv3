import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Field } from "../components/ui/Field.jsx";
import { Steps } from "../components/ui/Steps.jsx";
import { Status } from "../components/ui/Tag.jsx";
import { IconShield, IconUser, IconSignature, IconGrid } from "../components/ui/icons.jsx";
import "./AuthPages.css";

/*
  Регистрация по ЭЦП, перенесена по смыслу из первой версии: аккаунт
  заводится на юрлицо, данные компании читаются из сертификата НУЦ РК,
  личность подписанта подтверждается биометрией, документы подписываются
  тем же ключом.

  Подписание мокается таймерами, но мокается честно: у каждого документа
  появляется время подписи и отпечаток. Это прототип флоу, а не заглушка
  «кнопка просто заводит аккаунт» — иначе экран не показывает того, ради
  чего он существует.
*/

const STEPS = [
  { id: "ecp", label: "ЭЦП" },
  { id: "company", label: "Компания" },
  { id: "biometry", label: "Биометрия" },
  { id: "documents", label: "Документы" },
];

// Демо-сертификат: ключ не читается, данные «подтягиваются» сразу.
const CERT = {
  company: "ТОО «Ваша компания»",
  bin: "123456789012",
  signer: "Ахметов Арман Серикович",
  iin: "870514300123",
  role: "Первый руководитель",
  serial: "1f3a 7c02 9b41 d8e5",
  validUntil: "14.02.2027",
};

const SIGN_METHODS = [
  {
    id: "key",
    title: "Ключ ЭЦП (файл AUTH_RSA / RSA)",
    note: "Сертификат НУЦ РК из NCALayer — как при входе в eGov или Кабинет налогоплательщика",
  },
  {
    id: "egov",
    title: "eGov mobile — подпись по QR",
    note: "Отсканируйте QR в приложении eGov mobile и подтвердите подпись",
  },
];

const BIOMETRY_STAGES = [
  "Поиск лица в кадре",
  "Проверка живости: моргните",
  "Сверка с фото из документа",
];

const DOCUMENTS = [
  {
    id: "offer",
    title: "Договор-оферта на оказание услуг",
    note: "Рамочный договор Beeline Business с компанией",
  },
  {
    id: "join",
    title: "Заявление о присоединении",
    note: "Подключение компании к единому счёту и личному кабинету",
  },
  {
    id: "pd",
    title: "Согласие на обработку персональных данных",
    note: "Для подписанта и сотрудников, которым выдадут доступ",
  },
  {
    id: "edo",
    title: "Соглашение об электронном документообороте",
    note: "Акты и ЭСФ приходят подписанными ЭЦП, без бумаги",
  },
];

function makeFingerprint() {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(16).slice(2, 6).toUpperCase()
  ).join(" ");
}

function StepHead({ icon, title, note }) {
  return (
    <div className="ecp__head">
      <span className="ecp__head-icon">{icon}</span>
      <div className="ecp__head-text">
        <span className="ecp__head-title">{title}</span>
        <span className="ecp__head-note">{note}</span>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { registerCompany } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/profile";

  const [step, setStep] = useState("ecp");
  const [method, setMethod] = useState("key");
  const [keyFile, setKeyFile] = useState("");
  const [password, setPassword] = useState("");

  const [company, setCompany] = useState(CERT.company);
  const [bin, setBin] = useState(CERT.bin);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [biometryStage, setBiometryStage] = useState(-1);
  const [biometryDone, setBiometryDone] = useState(false);
  const [signed, setSigned] = useState({});
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runBiometry = () => {
    setBiometryStage(0);
    BIOMETRY_STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setBiometryStage(i + 1), (i + 1) * 900));
    });
    timers.current.push(setTimeout(() => setBiometryDone(true), BIOMETRY_STAGES.length * 900));
  };

  const signAll = () => {
    DOCUMENTS.forEach((doc, i) => {
      timers.current.push(
        setTimeout(
          () =>
            setSigned((prev) => ({
              ...prev,
              [doc.id]: { at: new Date(), fingerprint: makeFingerprint() },
            })),
          (i + 1) * 450
        )
      );
    });
  };

  const allSigned = DOCUMENTS.every((d) => signed[d.id]);

  const finish = () => {
    registerCompany({
      company,
      bin,
      signer: CERT.signer,
      iin: CERT.iin,
      email: email || "company@mvpmarket.dev",
      phone,
    });
    navigate(next);
  };

  return (
    <div className="auth auth--wide">
      <Card className="auth__card">
        <div className="auth__head">
          <h1 className="auth__title serif">Регистрация компании</h1>
          <span className="auth__subtitle">
            Аккаунт заводится на юридическое лицо: подписант подтверждает личность по ЭЦП и
            биометрии, договоры подписываются электронной подписью — без визита в офис.
          </span>
        </div>

        <Steps steps={STEPS} activeId={step} />

        {step === "ecp" && (
          <div className="ecp">
            <StepHead
              icon={<IconShield size={18} />}
              title="Вход по электронной цифровой подписи"
              note="Данные компании возьмём из сертификата НУЦ РК — вводить БИН вручную не нужно"
            />

            <div className="ecp__options">
              {SIGN_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={["ecp__option", method === m.id ? "ecp__option--active" : ""]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="ecp__option-title">{m.title}</span>
                  <span className="ecp__option-note">{m.note}</span>
                </button>
              ))}
            </div>

            {method === "key" ? (
              <div className="ecp__key">
                <div className="ecp__key-file">
                  <span className="ecp__key-name">{keyFile || "Файл ключа не выбран"}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setKeyFile("AUTH_RSA256_1f3a7c02…p12")}
                  >
                    Выбрать ключ
                  </Button>
                </div>
                <Field
                  label="Пароль к хранилищу ключей"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            ) : (
              <div className="ecp__qr">
                <div className="ecp__qr-code" aria-hidden="true" />
                <span className="ecp__qr-note">
                  Откройте eGov mobile → «Цифровые документы» → сканируйте QR. Код обновится
                  через 2:00.
                </span>
              </div>
            )}

            <div className="form-actions">
              <Button
                disabled={method === "key" && (!keyFile || !password)}
                onClick={() => setStep("company")}
              >
                Прочитать сертификат
              </Button>
            </div>
          </div>
        )}

        {step === "company" && (
          <div className="ecp">
            <StepHead
              icon={<IconGrid size={18} />}
              title="Данные из сертификата"
              note="Проверьте компанию и оставьте контакты — на них придут счета и доступы"
            />

            <dl className="ecp__cert">
              <div>
                <dt>Подписант</dt>
                <dd>{CERT.signer}</dd>
              </div>
              <div>
                <dt>ИИН</dt>
                <dd className="num">{CERT.iin}</dd>
              </div>
              <div>
                <dt>Роль в компании</dt>
                <dd>{CERT.role}</dd>
              </div>
              <div>
                <dt>Серийный номер</dt>
                <dd className="num">{CERT.serial}</dd>
              </div>
              <div>
                <dt>Действителен до</dt>
                <dd className="num">{CERT.validUntil}</dd>
              </div>
              <div>
                <dt>Статус в НУЦ РК</dt>
                <dd>
                  <Status tone="success">Действующий, не отозван</Status>
                </dd>
              </div>
            </dl>

            <div className="field-grid">
              <Field
                label="Наименование компании"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Field label="БИН" value={bin} onChange={(e) => setBin(e.target.value)} />
              <Field
                label="E-mail для счетов и документов"
                type="email"
                placeholder="buh@company.kz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                label="Телефон подписанта"
                placeholder="+7 700 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Button
                disabled={!company.trim() || !bin.trim()}
                onClick={() => setStep("biometry")}
              >
                Далее — подтверждение личности
              </Button>
              <Button variant="secondary" onClick={() => setStep("ecp")}>
                Назад
              </Button>
            </div>
          </div>
        )}

        {step === "biometry" && (
          <div className="ecp">
            <StepHead
              icon={<IconUser size={18} />}
              title="Verigram Face ID"
              note="Биометрическая проверка подписанта: живость и сверка с фото из документа"
            />

            <div className="ecp__biometry">
              <div
                className={[
                  "ecp__frame",
                  biometryDone ? "ecp__frame--ok" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="ecp__face" aria-hidden="true" />
                <span className="ecp__frame-hint">
                  {biometryDone
                    ? "Личность подтверждена"
                    : biometryStage < 0
                      ? "Расположите лицо в овале"
                      : BIOMETRY_STAGES[Math.min(biometryStage, BIOMETRY_STAGES.length - 1)]}
                </span>
              </div>

              <ol className="ecp__stages">
                {BIOMETRY_STAGES.map((stage, i) => (
                  <li
                    key={stage}
                    className={[
                      "ecp__stage",
                      biometryStage > i ? "ecp__stage--done" : "",
                      biometryStage === i ? "ecp__stage--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="ecp__stage-mark num">{biometryStage > i ? "✓" : i + 1}</span>
                    {stage}
                  </li>
                ))}
              </ol>
            </div>

            {biometryDone && (
              <span className="ecp__result">
                Совпадение с фото из документа — 98,6%. Проверка живости пройдена, данные
                сверены с базой ГБД ФЛ.
              </span>
            )}

            <div className="form-actions">
              {biometryDone ? (
                <Button onClick={() => setStep("documents")}>Далее — подписание</Button>
              ) : (
                <Button disabled={biometryStage >= 0} onClick={runBiometry}>
                  {biometryStage >= 0 ? "Идёт проверка…" : "Запустить проверку"}
                </Button>
              )}
              <Button variant="secondary" onClick={() => setStep("company")}>
                Назад
              </Button>
            </div>
          </div>
        )}

        {step === "documents" && (
          <div className="ecp">
            <StepHead
              icon={<IconSignature size={18} />}
              title="Подписание документов ЭЦП"
              note="Подписываются тем же ключом — бумажные экземпляры и обмен по почте не нужны"
            />

            <ul className="ecp__docs">
              {DOCUMENTS.map((doc) => (
                <li key={doc.id} className="ecp__doc">
                  <div className="ecp__doc-body">
                    <span className="ecp__doc-title">{doc.title}</span>
                    <span className="ecp__doc-note">{doc.note}</span>
                    {signed[doc.id] && (
                      <span className="ecp__doc-sign num">
                        Подписано ЭЦП · {CERT.signer} ·{" "}
                        {signed[doc.id].at.toLocaleTimeString("ru-RU")} · SHA-256{" "}
                        {signed[doc.id].fingerprint}
                      </span>
                    )}
                  </div>
                  {signed[doc.id] ? (
                    <Status tone="success">Подписан</Status>
                  ) : (
                    <span className="ecp__doc-waiting">Ожидает подписи</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="form-actions">
              {allSigned ? (
                <Button onClick={finish}>Завершить регистрацию</Button>
              ) : (
                <Button onClick={signAll}>Подписать все ЭЦП</Button>
              )}
            </div>
          </div>
        )}

        <span className="auth__foot">
          Уже есть аккаунт?{" "}
          <Link to={`/login?next=${encodeURIComponent(next)}`}>Войти</Link>
        </span>
      </Card>
    </div>
  );
}
