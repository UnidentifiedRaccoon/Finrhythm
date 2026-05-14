import { createElement as h, Fragment, type ReactNode } from "react";
import type { FixtureLesson, LessonBlock, LessonExampleVariant, LessonQuizItem } from "../lib/learning-types";
import { EmployeeAppHeader, EmployeeBottomNav } from "./employee-app-shell.ts";

type LessonRendererProps = {
  lesson: FixtureLesson;
  progressBanner?: ReactNode;
};

const blockLabels: Record<LessonBlock["blockType"], string> = {
  situation: "Ситуация",
  why: "Зачем",
  rule: "Правило",
  example: "Примеры",
  mini_test: "Мини-тест",
  practice: "Практика",
  reward: "Награда"
};

export function LessonRendererScreen({ lesson, progressBanner }: LessonRendererProps) {
  return h(
    "main",
    { className: "learning-page lesson-renderer-page" },
    h(
      "div",
      { className: "mobile-shell" },
      h(EmployeeAppHeader, { pill: `${lesson.routeId} · демо` }),
      h(EmployeeBottomNav, { active: "learning" }),
      h(LessonHero, { lesson }),
      progressBanner ?? null,
      h(LessonProgressCard, { lesson }),
      h(
        "section",
        { className: "lesson-renderer", "aria-labelledby": "lesson-sections-title" },
        h("p", { className: "section-label" }, "Структура урока"),
        h("h2", { id: "lesson-sections-title" }, lessonStructureTitle(lesson)),
        h("p", null, "Урок собран из коротких блоков. Ответы и практические шаги в этом демо не сохраняются."),
        h(
          "div",
          { className: "lesson-block-list" },
          lesson.blocks.map((block) => h(RenderedBlock, { key: block.blockId, block, lesson }))
        )
      ),
      h(PolicyPanel, { lesson }),
      h(LessonFooter)
    )
  );
}

function lessonStructureTitle(lesson: FixtureLesson) {
  const [, subtitle] = lesson.title.split(/:\s*/);
  const title = subtitle ?? lesson.shortTitle;

  return `${lesson.routeId}: ${title.charAt(0).toLowerCase()}${title.slice(1)}`;
}

function LessonHero({ lesson }: LessonRendererProps) {
  return h(
    "section",
    { className: "hero-section lesson-hero", "aria-labelledby": "lesson-title" },
    h("a", { className: "back-link", href: "/learning" }, "Назад к треку"),
    h("p", { className: "section-label" }, "Синтетический урок"),
    h("h1", { id: "lesson-title" }, lesson.title),
    h("p", { className: "hero-copy" }, lesson.userPromise),
    h(
      "div",
      { className: "preview-meta lesson-hero-meta" },
      h("span", null, lesson.estimatedTime),
      h("span", null, lesson.primaryCompetency),
      h("span", null, lesson.secondaryCompetencies.join(" / ")),
      h("span", null, "образовательное демо")
    )
  );
}

function LessonProgressCard({ lesson }: LessonRendererProps) {
  return h(
    "section",
    { className: "lesson-progress-card", "aria-labelledby": "lesson-progress-title" },
    h(
      "div",
      null,
      h("p", { className: "section-label" }, "Прогресс урока"),
      h("h2", { id: "lesson-progress-title" }, `${lesson.blocks.length} коротких блоков`),
      h("p", null, "Можно читать по порядку. В демо прогресс не сохраняется и не сравнивается с другими участниками.")
    ),
    h(
      "ol",
      { className: "lesson-stepper", "aria-label": "Блоки урока" },
      lesson.blocks.map((block, index) =>
        h(
          "li",
          { key: block.blockId },
          h("span", { className: "stepper-dot stepper-upcoming", "aria-hidden": "true" }, index + 1),
          h("span", null, blockLabels[block.blockType])
        )
      )
    )
  );
}

function RenderedBlock({ block, lesson }: { block: LessonBlock; lesson: FixtureLesson }) {
  if (block.blockType === "example") {
    return h(
      "article",
      { className: "lesson-block", "data-block-type": block.blockType },
      h(BlockHeader, { block }),
      h("p", null, block.body),
      h("div", { className: "example-grid" }, lesson.examples.map((example) => h(ExampleCard, { key: example.variant, example })))
    );
  }

  if (block.blockType === "mini_test") {
    return h(
      "article",
      { className: "lesson-block", "data-block-type": block.blockType },
      h(BlockHeader, { block }),
      h("p", null, block.body),
      h("div", { className: "quiz-preview-list" }, lesson.quizItems.map((item, index) => h(QuizPreview, { key: item.quizId, item, index })))
    );
  }

  if (block.blockType === "practice") {
    return h(
      "article",
      { className: "lesson-block lesson-block-sensitive", "data-block-type": block.blockType },
      h(BlockHeader, { block }),
      h("p", null, block.body),
      h(
        "div",
        { className: "practice-panel privacy-subpanel" },
        h("h3", null, lesson.practiceTask.prompt),
        h("p", null, lesson.practiceTask.privacyCopy),
        h("p", { className: "practice-note" }, lesson.practiceTask.completionCriteria),
        h("button", { className: "secondary-action", type: "button", disabled: true }, block.ctaLabel ?? "Демо без сохранения")
      )
    );
  }

  if (block.blockType === "reward") {
    return h(
      "article",
      { className: "lesson-block reward-block", "data-block-type": block.blockType },
      h(BlockHeader, { block }),
      h("p", null, block.body),
      h(
        "div",
        { className: "reward-panel" },
        h("h3", null, lesson.reward.title),
        h("p", null, lesson.reward.body),
        h("p", { className: "reward-points" }, lesson.reward.pointsLabel),
        h("p", { className: "practice-note" }, lesson.reward.noMoneyEquivalentCopy)
      )
    );
  }

  return h(
    "article",
    { className: "lesson-block", "data-block-type": block.blockType },
    h(BlockHeader, { block }),
    h("p", null, block.body)
  );
}

function BlockHeader({ block }: { block: LessonBlock }) {
  return h(
    "div",
    { className: "lesson-block-header" },
    h("span", { className: "block-type" }, blockLabels[block.blockType]),
    block.sensitiveFlag ? h("span", { className: "sensitive-pill" }, "без точных данных") : null,
    h("h3", null, block.title)
  );
}

function ExampleCard({ example }: { example: LessonExampleVariant }) {
  const label = example.variant === "office" ? "Пример: офис" : "Пример: сменный график";

  return h("article", { className: "example-card" }, h("span", null, label), h("h3", null, example.title), h("p", null, example.body));
}

function QuizPreview({ item, index }: { item: LessonQuizItem; index: number }) {
  return h(
    "article",
    { className: "quiz-preview" },
    h("span", { className: "quiz-number" }, `Вопрос ${index + 1}`),
    h("h3", null, item.prompt),
    h(
      "ul",
      null,
      item.options.map((option) =>
        h("li", { key: option.id, className: option.id === item.correctOptionId ? "quiz-option-correct" : undefined }, option.label)
      )
    ),
    h("p", null, item.feedbackCorrect),
    h("p", { className: "practice-note" }, "Локальное превью: ответ не отправляется и завершение не фиксируется.")
  );
}

function PolicyPanel({ lesson }: LessonRendererProps) {
  return h(
    "section",
    { className: "policy-panel privacy-card", "aria-labelledby": "policy-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
    h("p", { className: "section-label" }, "Границы данных"),
    h("h2", { id: "policy-title" }, "Что этот урок не делает"),
    h("ul", { className: "safety-list" }, lesson.sensitiveDataPolicy.map((note) => h("li", { key: note }, note))),
    h(
      "div",
      { className: "review-note" },
      h("h3", null, "Статус review"),
      h("p", null, "Материал находится в редакционном черновике и не является production-ready публикацией."),
      h(
        "ul",
        null,
        lesson.review.notes.map((note) => h("li", { key: note }, note))
      )
    )
    )
  );
}

function LessonFooter() {
  return h(
    Fragment,
    null,
    h("a", { className: "primary-action", href: "/learning" }, "Вернуться к треку"),
    h("p", { className: "lesson-footnote" }, "Онбординг, согласие, диагностика, прогресс и баллы остаются вне этого демо-среза.")
  );
}
