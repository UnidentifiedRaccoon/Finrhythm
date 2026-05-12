import { createElement as h } from "react";

type DisclosureSection = {
  title: string;
  body: string;
  items: string[];
};

const visibleByDefault: DisclosureSection = {
  title: "Что HR видит по умолчанию",
  body: "Отчеты нужны, чтобы понять, полезен ли пилот для группы, а не оценивать личные решения сотрудников.",
  items: [
    "Агрегированную аналитику по группе: участие, диагностику, прогресс, уроки и self-assessment.",
    "Общие зоны интереса и роста только в сводном виде, без персональных ответов.",
    "Операционные данные только когда это нужно для доступа, связи, поддержки или выдачи мерча в будущих согласованных срезах."
  ]
};

const hiddenByDefault: DisclosureSection = {
  title: "Что HR не видит по умолчанию",
  body: "Личные учебные ответы остаются в продукте и используются для вашего маршрута и поддержки.",
  items: [
    "Ваши персональные ответы диагностики.",
    "Индивидуальные слабые зоны и личный результат по темам.",
    "Точные суммы, остатки, доходы, долги и другие личные финансовые детали.",
    "Подробности reflection-заданий и личные налоговые, долговые или семейные обстоятельства."
  ]
};

const noRequiredArtifacts = [
  "Точные суммы можно не указывать.",
  "Старт проходит без фото, документов и банковских скриншотов.",
  "Если в задании появится чувствительная тема, безопасный вариант по умолчанию — диапазон, категория или чек-лист."
];

export function OnboardingPrivacyScreen() {
  return h(
    "main",
    { className: "learning-page privacy-page" },
    h(
      "div",
      { className: "mobile-shell privacy-shell" },
      h(PrivacyHeader),
      h(PrivacyHero),
      h(DraftNotice),
      h(DisclosureCard, { section: visibleByDefault, tone: "visible" }),
      h(DisclosureCard, { section: hiddenByDefault, tone: "hidden" }),
      h(ArtifactNotice),
      h(FutureState)
    )
  );
}

function PrivacyHeader() {
  return h(
    "header",
    { className: "app-header" },
    h(
      "a",
      { className: "brand-lockup", href: "/learning", "aria-label": "Финпульс: обучение" },
      h("span", { className: "brand-mark", "aria-hidden": "true" }, "Ф"),
      h("span", null, "Финпульс")
    ),
    h("span", { className: "demo-pill" }, "приватность")
  );
}

function PrivacyHero() {
  return h(
    "section",
    { className: "privacy-hero", "aria-labelledby": "privacy-title" },
    h("p", { className: "section-label" }, "Перед диагностикой"),
    h("h1", { id: "privacy-title" }, "Какие данные видит работодатель"),
    h(
      "p",
      { className: "hero-copy" },
      "Финпульс помогает подобрать спокойный учебный маршрут. Здесь коротко объясняем границы данных до будущей диагностики."
    )
  );
}

function DraftNotice() {
  return h(
    "section",
    { className: "privacy-card privacy-draft-card", "aria-labelledby": "draft-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
      h("p", { className: "section-label" }, "Черновик"),
      h("h2", { id: "draft-title" }, "Текст требует юридической проверки"),
      h(
        "p",
        null,
        "Это черновое объяснение для human gate. Экран не является принятием согласия, не записывает версию согласия и не ведет логирование."
      )
    )
  );
}

function DisclosureCard({ section, tone }: { section: DisclosureSection; tone: "visible" | "hidden" }) {
  return h(
    "section",
    { className: `privacy-disclosure privacy-disclosure-${tone}`, "aria-labelledby": `privacy-${tone}-title` },
    h("p", { className: "section-label" }, tone === "visible" ? "Агрегировано" : "Лично"),
    h("h2", { id: `privacy-${tone}-title` }, section.title),
    h("p", null, section.body),
    h(
      "ul",
      { className: "privacy-bullets" },
      section.items.map((item) => h("li", { key: item }, item))
    )
  );
}

function ArtifactNotice() {
  return h(
    "section",
    { className: "privacy-artifact-panel", "aria-labelledby": "artifact-title" },
    h("p", { className: "section-label" }, "Без лишних доказательств"),
    h("h2", { id: "artifact-title" }, "Для старта без документов"),
    h(
      "ul",
      { className: "privacy-bullets privacy-bullets-compact" },
      noRequiredArtifacts.map((item) => h("li", { key: item }, item))
    )
  );
}

function FutureState() {
  return h(
    "section",
    { className: "privacy-next-step", "aria-labelledby": "privacy-next-title" },
    h("p", { className: "section-label" }, "Дальше"),
    h("h2", { id: "privacy-next-title" }, "Диагностика будет отдельным шагом"),
    h(
      "p",
      null,
      "В этом срезе диагностика, scoring, маршрут и сохранение прогресса не реализованы. Пока можно перейти к демо-обучению и посмотреть формат уроков."
    ),
    h(
      "div",
      { className: "privacy-actions" },
      h("a", { className: "primary-action", href: "/learning" }, "Перейти к обучению"),
      h("span", { className: "secondary-action privacy-static-action", "aria-disabled": "true" }, "Диагностика позже")
    )
  );
}
