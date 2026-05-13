import { createElement as h } from "react";
import { EmployeePageFrame, type EmployeeNavSection } from "./employee-app-shell.ts";

type EmployeePlaceholderScreenProps = {
  active: EmployeeNavSection;
  eyebrow: string;
  title: string;
  body: string;
  boundaries: string[];
  nextHref: string;
  nextLabel: string;
  pill: string;
};

export function EmployeePlaceholderScreen({
  active,
  boundaries,
  body,
  eyebrow,
  nextHref,
  nextLabel,
  pill,
  title
}: EmployeePlaceholderScreenProps) {
  return h(
    EmployeePageFrame,
    { active, className: "employee-placeholder-page", pill },
    h(
      "section",
      { className: "placeholder-hero", "aria-labelledby": `${active}-title` },
      h("p", { className: "section-label" }, eyebrow),
      h("h1", { id: `${active}-title` }, title),
      h("p", { className: "hero-copy" }, body)
    ),
    h(
      "section",
      { className: "placeholder-boundary", "aria-labelledby": `${active}-boundary-title` },
      h("p", { className: "section-label" }, "Границы среза"),
      h("h2", { id: `${active}-boundary-title` }, "Сейчас это навигационная заглушка"),
      h(
        "ul",
        { className: "placeholder-list" },
        boundaries.map((boundary) => h("li", { key: boundary }, boundary))
      ),
      h("a", { className: "secondary-action", href: nextHref }, nextLabel)
    )
  );
}

export function ChallengesPlaceholderScreen() {
  return h(EmployeePlaceholderScreen, {
    active: "challenges",
    body:
      "Здесь будет раздел с короткими спокойными активностями. В этом срезе экран нужен только для навигации и понимания будущего места раздела.",
    boundaries: [
      "Нельзя присоединиться к активности или отметить выполнение.",
      "Результаты не сохраняются и не сравниваются с коллегами.",
      "Призы и напоминания не подключены."
    ],
    eyebrow: "Челлендж",
    nextHref: "/learning",
    nextLabel: "Вернуться к обучению",
    pill: "Челлендж",
    title: "Челлендж пока в подготовке"
  });
}

export function RewardsPlaceholderScreen() {
  return h(EmployeePlaceholderScreen, {
    active: "rewards",
    body:
      "Здесь появится спокойный каталог наград после отдельного согласования правил. Сейчас экран только закрепляет место раздела в навигации.",
    boundaries: [
      "Каталог, выдача и операции с наградами не подключены.",
      "Счётчики и история операций здесь не показываются.",
      "Экран не обещает получение награды или материальный результат."
    ],
    eyebrow: "Награды",
    nextHref: "/learning",
    nextLabel: "Вернуться к обучению",
    pill: "Награды",
    title: "Награды появятся позже"
  });
}

export function SupportPlaceholderScreen() {
  return h(EmployeePlaceholderScreen, {
    active: "home",
    body:
      "Поддержка помогает с доступом, маршрутом обучения, профилем и навигацией по разделам. Операторский процесс будет отдельным срезом.",
    boundaries: [
      "На этом экране нет формы отправки обращения.",
      "Здесь не даются личные финансовые, юридические, налоговые, кредитные или инвестиционные рекомендации.",
      "Для срочных вопросов по личным обязательствам нужен профильный специалист вне приложения."
    ],
    eyebrow: "Поддержка",
    nextHref: "/",
    nextLabel: "Вернуться на главную",
    pill: "Поддержка",
    title: "Помощь по приложению"
  });
}
