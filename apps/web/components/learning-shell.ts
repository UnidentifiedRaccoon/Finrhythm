import { createElement as h, Fragment, type ReactNode } from "react";
import type { LearningFixture, LearningShellResult, LessonPreview, NoviceLesson } from "../lib/learning-types";

type LearningShellProps = {
  result: LearningShellResult;
};

const navItems = [
  { label: "Обучение", mark: "route" },
  { label: "Челленджи", mark: "challenge" },
  { label: "Награды", mark: "reward" },
  { label: "Профиль", mark: "profile" }
];

export function LearningShellScreen({ result }: LearningShellProps) {
  if (result.state === "loading") {
    return h(LearningLoadingView);
  }

  if (result.state === "empty") {
    return h(LearningEmptyView, { message: result.message });
  }

  if (result.state === "error") {
    return h(LearningErrorView, { message: result.message });
  }

  return h(ReadyLearningView, { fixture: result.fixture });
}

export function LearningLoadingView() {
  return h(StatePage, {
    eyebrow: "Обучение",
    title: "Загружаем учебный маршрут",
    body: "Собираем демо-экран без персональных данных.",
    busy: true,
    children: h(Fragment, null, h("div", { className: "skeleton-line" }), h("div", { className: "skeleton-line" }))
  });
}

export function LearningEmptyView({ message }: { message: string }) {
  return h(StatePage, {
    eyebrow: "Пока пусто",
    title: "Уроки не найдены",
    body: message,
    action: h("a", { className: "state-link", href: "/learning" }, "Открыть обучение")
  });
}

export function LearningErrorView({ message }: { message: string }) {
  return h(StatePage, {
    eyebrow: "Ошибка",
    title: "Не удалось открыть обучение",
    body: message,
    action: h("a", { className: "state-link", href: "/learning" }, "Повторить")
  });
}

function ReadyLearningView({ fixture }: { fixture: LearningFixture }) {
  const activeLesson = fixture.lessons[0];

  return h(
    "main",
    { className: "learning-page" },
    h(
      "div",
      { className: "mobile-shell" },
      h(AppHeader),
      h(AppNav),
      h(
        "section",
        { className: "hero-section", "aria-labelledby": "learning-title" },
        h("p", { className: "section-label" }, "Учебный маршрут"),
        h("h1", { id: "learning-title" }, "Начните с короткого трека"),
        h(
          "p",
          { className: "hero-copy" },
          "Демо-вход ведет сразу к обучению: короткий трек, список уроков и безопасное превью без личных данных."
        )
      ),
      h(PrivacyCard, {
        title: "Личные ответы остаются личными",
        body: "В этом демо нет персонального отчета для работодателя. Превью показывает только синтетический маршрут и не просит точные суммы."
      }),
      h(TrackSummary, { fixture }),
      h(LessonList, { lessons: fixture.lessons }),
      activeLesson ? h(LessonPreviewCard, { preview: fixture.preview, activeLesson }) : null
    )
  );
}

function AppHeader() {
  return h(
    "header",
    { className: "app-header" },
    h(
      "a",
      { className: "brand-lockup", href: "/learning", "aria-label": "Финпульс: обучение" },
      h("span", { className: "brand-mark", "aria-hidden": "true" }, "Ф"),
      h("span", null, "Финпульс")
    ),
    h("span", { className: "demo-pill" }, "Демо без данных")
  );
}

function TrackSummary({ fixture }: { fixture: LearningFixture }) {
  return h(
    "section",
    { className: "track-summary", "aria-labelledby": "track-title" },
    h(
      "div",
      null,
      h("p", { className: "section-label" }, "Трек"),
      h("h2", { id: "track-title" }, fixture.trackTitle),
      h("p", null, fixture.trackSubtitle),
      h(RouteProgress, { lessons: fixture.lessons })
    ),
    h(
      "dl",
      { className: "track-facts", "aria-label": "Параметры трека" },
      h("div", null, h("dt", null, "Уроков"), h("dd", null, fixture.lessons.length)),
      h("div", null, h("dt", null, "Темп"), h("dd", null, "в своем ритме")),
      h("div", null, h("dt", null, "Данные"), h("dd", null, "без сумм"))
    )
  );
}

function RouteProgress({ lessons }: { lessons: NoviceLesson[] }) {
  return h(
    "div",
    { className: "route-progress", "aria-label": `Маршрут-превью: 1 из ${lessons.length} шагов показан` },
    h(
      "div",
      { className: "progress-copy" },
      h("span", null, "Маршрут-превью"),
      h("strong", null, `1 из ${lessons.length}`)
    ),
    h(
      "ol",
      { className: "stepper", "aria-hidden": "true" },
      lessons.map((lesson, index) =>
        h("li", { key: lesson.id, className: `stepper-dot stepper-${index === 0 ? "current" : lesson.status}` }, index + 1)
      )
    )
  );
}

function LessonList({ lessons }: { lessons: NoviceLesson[] }) {
  return h(
    "section",
    { className: "lesson-list-section", "aria-labelledby": "lesson-list-title" },
    h("h2", { id: "lesson-list-title" }, "План N1-N7"),
    h(
      "ol",
      { className: "lesson-list" },
      lessons.map((lesson) => h(LessonRow, { key: lesson.id, lesson }))
    )
  );
}

function LessonRow({ lesson }: { lesson: NoviceLesson }) {
  return h(
    "li",
    { className: `lesson-row lesson-${lesson.status}` },
    h(
      "div",
      { className: "lesson-number", "aria-hidden": "true" },
      lesson.id
    ),
    h(
      "div",
      { className: "lesson-body" },
      h(
        "div",
        { className: "lesson-title-line" },
        h("h3", null, lesson.title),
        h(StatusBadge, { status: lesson.status })
      ),
      h("p", null, lesson.focus),
      h(
        "div",
        { className: "lesson-meta", "aria-label": `Метаданные ${lesson.id}` },
        h("span", null, lesson.time),
        h("span", null, lesson.competencyCodes.join(" / "))
      ),
      lesson.status === "available" || lesson.status === "next"
        ? h(
            "a",
            { className: "lesson-row-link", href: `/learning/lessons/${lesson.id}` },
            lesson.status === "available" ? "Открыть урок" : `Открыть ${lesson.id}`
          )
        : null
    )
  );
}

function StatusBadge({ status }: { status: NoviceLesson["status"] }) {
  const labels: Record<NoviceLesson["status"], string> = {
    available: "превью",
    next: "следующий",
    later: "позже"
  };

  return h("span", { className: `status-badge status-${status}` }, labels[status]);
}

function LessonPreviewCard({
  preview,
  activeLesson
}: {
  preview: LessonPreview;
  activeLesson: NoviceLesson;
}) {
  return h(
    "section",
    { className: "preview-panel", "aria-labelledby": "preview-title" },
    h("p", { className: "section-label" }, `Урок-превью ${preview.lessonId}`),
    h("h2", { id: "preview-title" }, preview.title),
    h("p", { className: "preview-promise" }, preview.promise),
    h(
      "div",
      { className: "preview-meta" },
      h("span", null, preview.time),
      h("span", null, activeLesson.competencyCodes.join(" / "))
    ),
    h(PreviewBlock, { title: "Ситуация", body: preview.situation }),
    h(PreviewBlock, { title: "Правило", body: preview.rule }),
    h(PreviewBlock, { title: "Практика", body: preview.practice }),
    h(
      "div",
      { className: "example-grid" },
      h(PreviewBlock, { title: "Пример: офис", body: preview.examples.office }),
      h(PreviewBlock, { title: "Пример: сменный график", body: preview.examples.store })
    ),
    h(
      "ul",
      { className: "safety-list privacy-list", "aria-label": "Границы демо-урока" },
      preview.safetyNotes.map((note) => h("li", { key: note }, note))
    ),
    h("a", { className: "primary-action", href: `/learning/lessons/${preview.lessonId}` }, "Открыть урок")
  );
}

function PreviewBlock({ title, body }: { title: string; body: string }) {
  return h("article", { className: "preview-block" }, h("h3", null, title), h("p", null, body));
}

function AppNav() {
  return h(
    "nav",
    { className: "bottom-nav", "aria-label": "Разделы приложения" },
    navItems.map((item, index) =>
      index === 0
        ? h(
            "a",
            { key: item.label, href: "/learning", "aria-current": "page" },
            h("span", { className: `nav-mark nav-mark-${item.mark}`, "aria-hidden": "true" }),
            h("span", null, item.label)
          )
        : h(
            "span",
            { key: item.label, "aria-disabled": "true" },
            h("span", { className: `nav-mark nav-mark-${item.mark}`, "aria-hidden": "true" }),
            h("span", null, item.label)
          )
    )
  );
}

function PrivacyCard({ title, body }: { title: string; body: string }) {
  return h(
    "section",
    { className: "privacy-card", "aria-labelledby": "privacy-card-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h("div", null, h("h2", { id: "privacy-card-title" }, title), h("p", null, body))
  );
}

function StatePage({
  eyebrow,
  title,
  body,
  action,
  busy = false,
  children
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
  busy?: boolean;
  children?: ReactNode;
}) {
  return h(
    "main",
    { className: "state-page" },
    h(
      "section",
      { className: "state-panel", "aria-busy": busy ? "true" : undefined },
      h("p", { className: "section-label" }, eyebrow),
      h("h1", null, title),
      h("p", null, body),
      children,
      action
    )
  );
}
