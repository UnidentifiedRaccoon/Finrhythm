import { createElement as h } from "react";
import { EmployeePageFrame, SecondarySupportEntry } from "./employee-app-shell.ts";

const homeSections = [
  {
    body: "Сначала Q0 про приватность, затем короткая самооценка и несколько preview-карточек без сохранения ответов.",
    cta: "Открыть preview",
    href: "/diagnostics",
    title: "Диагностика"
  },
  {
    body: "Короткий маршрут N1-N7 с уроками-превью и безопасными практиками без точных личных сумм.",
    cta: "Открыть обучение",
    href: "/learning",
    title: "Обучение"
  },
  {
    body: "Вход по данным приглашения открывает короткую профильную сессию для контактного профиля.",
    cta: "Открыть профиль",
    href: "/profile/session",
    title: "Профиль"
  },
  {
    body: "Раздел подготовлен как место для будущих спокойных активностей. Сейчас он только объясняет границы.",
    cta: "Посмотреть раздел",
    href: "/challenges",
    title: "Челлендж"
  },
  {
    body: "Будущий раздел наград пока показывает только навигационное место и ограничения без операций.",
    cta: "Посмотреть награды",
    href: "/rewards",
    title: "Награды"
  }
];

export function EmployeeHomeScreen() {
  return h(
    EmployeePageFrame,
    { active: "home", className: "employee-home-page", pill: "Главная" },
    h(
      "section",
      { className: "home-hero", "aria-labelledby": "home-title" },
      h("p", { className: "section-label" }, "Главная"),
      h("h1", { id: "home-title" }, "Ваш спокойный маршрут"),
      h(
        "p",
        { className: "hero-copy" },
        "На главной собраны вход в обучение, профиль, будущие разделы активности и поддержка. Экран не просит личные финансовые данные и не показывает бренд работодателя."
      )
    ),
    h(
      "section",
      { className: "home-section-grid", "aria-label": "Разделы приложения" },
      homeSections.map((item) =>
        h(
          "article",
          { className: "home-section-card", key: item.href },
          h("h2", null, item.title),
          h("p", null, item.body),
          h("a", { className: "section-card-link", href: item.href }, item.cta)
        )
      )
    ),
    h(SecondarySupportEntry)
  );
}
