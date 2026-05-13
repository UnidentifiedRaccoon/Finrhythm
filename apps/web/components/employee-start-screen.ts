import { createElement as h } from "react";

const startSteps = [
  {
    title: "Сначала граница приватности",
    body: "Перед профилем показываем, какие данные остаются личными и что работодатель видит только в агрегированном виде."
  },
  {
    title: "Затем временная профильная сессия",
    body: "После экрана приватности можно открыть короткую сессию для проверки профиля."
  },
  {
    title: "Контакты только после сессии",
    body: "Email и телефон вводятся или обновляются уже после временной профильной сессии."
  }
];

export function EmployeeStartScreen() {
  return h(
    "main",
    { className: "learning-page privacy-page employee-start-page" },
    h(
      "div",
      { className: "mobile-shell privacy-shell employee-start-shell" },
      h(StartHeader),
      h(StartHero),
      h(StartPrivacyCard),
      h(StartStepList),
      h(StartActions)
    )
  );
}

function StartHeader() {
  return h(
    "header",
    { className: "app-header" },
    h(
      "a",
      { className: "brand-lockup", href: "/learning", "aria-label": "Финпульс: обучение" },
      h("span", { className: "brand-mark", "aria-hidden": "true" }, "Ф"),
      h("span", null, "Финпульс")
    ),
    h("span", { className: "demo-pill" }, "старт")
  );
}

function StartHero() {
  return h(
    "section",
    { className: "privacy-hero", "aria-labelledby": "employee-start-title" },
    h("p", { className: "section-label" }, "Первый шаг"),
    h("h1", { id: "employee-start-title" }, "Начните с приватности"),
    h(
      "p",
      { className: "hero-copy" },
      "Финпульс открывает профильный путь спокойно: сначала показываем границы данных, затем даём открыть временную профильную сессию."
    )
  );
}

function StartPrivacyCard() {
  return h(
    "section",
    { className: "privacy-card privacy-draft-card", "aria-labelledby": "employee-start-privacy-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
      h("p", { className: "section-label" }, "Без скрытой передачи"),
      h("h2", { id: "employee-start-privacy-title" }, "Секрет сессии не идёт через адрес"),
      h(
        "p",
        null,
        "На этом экране нет полей и нет создания сессии. Сессионный секрет не передаётся через адресную строку, ссылки или параметры страницы."
      )
    )
  );
}

function StartStepList() {
  return h(
    "section",
    { className: "privacy-disclosure privacy-disclosure-visible", "aria-labelledby": "employee-start-order-title" },
    h("p", { className: "section-label" }, "Безопасный порядок"),
    h("h2", { id: "employee-start-order-title" }, "Профиль открывается после объяснения границ"),
    h(
      "ol",
      { className: "privacy-bullets" },
      startSteps.map((step) =>
        h(
          "li",
          { key: step.title },
          h("strong", null, step.title),
          " — ",
          step.body
        )
      )
    )
  );
}

function StartActions() {
  return h(
    "section",
    { className: "privacy-next-step", "aria-labelledby": "employee-start-next-title" },
    h("p", { className: "section-label" }, "Продолжить"),
    h("h2", { id: "employee-start-next-title" }, "Откройте экран приватности"),
    h(
      "p",
      null,
      "Контактные данные появятся только после временной профильной сессии. Начните с объяснения приватности, затем продолжите вход в профиль."
    ),
    h(
      "div",
      { className: "privacy-actions" },
      h("a", { className: "primary-action", href: "/onboarding/privacy" }, "Перейти к приватности"),
      h(
        "a",
        { className: "secondary-action", href: "/profile/session" },
        "Уже прочитали про приватность: продолжить вход в профиль"
      )
    )
  );
}
