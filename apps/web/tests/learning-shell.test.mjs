import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonRendererScreen } from "../components/lesson-renderer.ts";
import { getLessonRendererState } from "../lib/lesson-state.ts";
import { LearningShellScreen } from "../components/learning-shell.ts";
import { OnboardingPrivacyScreen } from "../components/onboarding-privacy-screen.ts";
import {
  learningFixtureSourceBoundary,
  learningFixtureSourceProvenance,
  learningFixtureSourceReview,
  noviceLearningFixture,
  syntheticN1LessonFixture,
  syntheticN2LessonFixture,
  syntheticN3LessonFixture
} from "../lib/learning-fixtures.ts";
import { getLearningShellState } from "../lib/learning-state.ts";

const appRoot = new URL("..", import.meta.url).pathname;
const managedSourceDirs = ["app", "components", "lib"];

describe("mobile learning shell", () => {
  it("resolves the ready state with synthetic N1-N7 metadata and one preview", () => {
    const result = getLearningShellState({});

    assert.equal(result.state, "ready");
    assert.equal(result.fixture.source, "synthetic");
    assert.equal(result.fixture.trackTitle, "Новичок");
    assert.deepEqual(
      result.fixture.lessons.map((lesson) => lesson.id),
      ["N1", "N2", "N3", "N4", "N5", "N6", "N7"]
    );
    assert.equal(result.fixture.preview.lessonId, "N1");
  });

  it("renders the shell, track entry and lesson preview", () => {
    const html = renderToStaticMarkup(
      LearningShellScreen({ result: { state: "ready", fixture: noviceLearningFixture } })
    );

    assert.match(html, /Финпульс/);
    assert.match(html, /Новичок/);
    assert.match(html, /План N1-N7/);
    assert.match(html, /Урок-превью N1/);
    assert.match(html, /href="\/learning\/lessons\/N2"/);
    assert.match(html, /Открыть N2/);
    assert.match(html, /href="\/learning\/lessons\/N3"/);
    assert.match(html, /Открыть N3/);
    assert.match(html, /href="\/onboarding\/privacy"/);
    assert.match(html, /Подробнее о приватности/);
    assert.match(html, /Пример: офис/);
    assert.match(html, /Пример: сменный график/);
    assert.match(html, /href="\/learning\/lessons\/N1"/);
  });

  it("renders loading, empty and error states from query-like params", () => {
    const loading = renderToStaticMarkup(LearningShellScreen({ result: getLearningShellState({ state: "loading" }) }));
    const empty = renderToStaticMarkup(LearningShellScreen({ result: getLearningShellState({ state: "empty" }) }));
    const error = renderToStaticMarkup(LearningShellScreen({ result: getLearningShellState({ state: "error" }) }));

    assert.match(loading, /Загружаем учебный маршрут/);
    assert.match(empty, /Уроки не найдены/);
    assert.match(error, /Не удалось открыть обучение/);
  });

  it("renders the onboarding privacy screen as draft copy without consent or diagnostics behavior", () => {
    const html = renderToStaticMarkup(OnboardingPrivacyScreen());

    assert.match(html, /Какие данные видит работодатель/);
    assert.match(html, /Что HR видит по умолчанию/);
    assert.match(html, /Агрегированную аналитику по группе/);
    assert.match(html, /Операционные данные/);
    assert.match(html, /Что HR не видит по умолчанию/);
    assert.match(html, /персональные ответы диагностики/);
    assert.match(html, /Индивидуальные слабые зоны/);
    assert.match(html, /Точные суммы/);
    assert.match(html, /reflection-заданий/);
    assert.match(html, /личные налоговые, долговые/);
    assert.match(html, /Старт проходит без фото, документов и банковских скриншотов/);
    assert.match(html, /Текст требует юридической проверки/);
    assert.match(html, /не является принятием согласия/);
    assert.match(html, /не записывает версию согласия/);
    assert.match(html, /Диагностика будет отдельным шагом/);
    assert.match(html, /href="\/learning"/);
    assert.doesNotMatch(html, /href="\/diagnostics"/);
    assert.doesNotMatch(html, /type="checkbox"/);
    assert.doesNotMatch(html, /финально утвержд/);
  });

  it("keeps managed web source free of customer brand, active old access terms and forbidden claims", async () => {
    const haystack = await managedSourceText();
    const forbidden = [
      "Lem" + "ana",
      "Лем" + "ана",
      "co" + "hort",
      "co" + "hortId",
      "co" + "horts",
      "быстрый " + "доход",
      joinText("гарантир", "ованный", " ", "результат"),
      "без " + "риска",
      joinText("рейтинг", " ", "сотрудников"),
      joinText("лучшие", " ", "сотрудники"),
      joinText("худшие", " ", "сотрудники")
    ];

    for (const token of forbidden) {
      assert.equal(haystack.includes(token), false, `forbidden token found: ${token}`);
    }
  });

  it("maps the Calm Progress design-system tokens into global CSS", async () => {
    const css = await readFile(join(appRoot, "app", "globals.css"), "utf8");
    const requiredTokens = [
      "--color-bg-primary: #f6fafe",
      "--color-primary: #1677f2",
      "--color-cyan: #2cc6d3",
      "--color-teal: #2bbfa5",
      "--color-mint: #e5f8f3",
      "--color-amber: #f5b942",
      "--color-text-primary: #102a43",
      "--color-border: #ddeaf5",
      "--button-height: 52px",
      "--card-radius: var(--radius-lg)",
      "--privacy-card-bg: var(--color-mint)",
      "--focus-ring: 0 0 0 4px rgba(22, 119, 242, 0.12)"
    ];

    for (const token of requiredTokens) {
      assert.equal(css.includes(token), true, `missing design-system token: ${token}`);
    }

    assert.doesNotMatch(css, /--(?:bg|ink|green|blue|line|surface):/);
    assert.match(css, /\.primary-action,[\s\S]*background: var\(--button-primary-bg\)/);
    assert.match(css, /\.privacy-card \{[\s\S]*background: var\(--privacy-card-bg\)/);
    assert.match(css, /\.reward-block \{[\s\S]*border-color: var\(--color-reward-border\)/);
    assert.match(css, /\.reward-block \.block-type \{[\s\S]*background: var\(--color-warning-soft\)/);
    assert.match(css, /\.reward-block \.block-type \{[\s\S]*border-color: var\(--color-reward-border\)/);
    assert.match(css, /\.reward-points \{[\s\S]*color: var\(--color-amber\)/);
  });

  it("uses synthetic fixtures without required personal finance artifacts", () => {
    const fixtureText = JSON.stringify(noviceLearningFixture);
    const forbidden = [
      "пас" + "порт",
      "банк" + "овский скриншот",
      "справка",
      "точный " + "доход",
      "точный " + "долг",
      "остаток на счете",
      "фото обязательно"
    ];

    for (const token of forbidden) {
      assert.equal(fixtureText.includes(token), false, `fixture contains forbidden personal-data token: ${token}`);
    }
  });

  it("keeps imported lesson payload under content fixtures with draft review status", async () => {
    const adapterSource = await readFile(join(appRoot, "lib", "learning-fixtures.ts"), "utf8");
    const contentFixturePath = join(
      appRoot,
      "..",
      "..",
      "content",
      "fixtures",
      "learning",
      "novice-demo-lessons.v0.1.json"
    );
    const contentFixture = JSON.parse(await readFile(contentFixturePath, "utf8"));

    assert.match(adapterSource, /content\/fixtures\/learning\/novice-demo-lessons\.v0\.1\.json/);
    assert.doesNotMatch(adapterSource, /blocks:\s*\[/);
    assert.doesNotMatch(adapterSource, /quizItems:\s*\[/);
    assert.doesNotMatch(adapterSource, /Расхламление дома: пополняйте копилки/);

    assert.equal(learningFixtureSourceBoundary.productionContentSourceOfTruth, "CMS/PostgreSQL");
    assert.equal(learningFixtureSourceBoundary.webRuntimeRole, "renderer_adapter_consumer");
    assert.equal(learningFixtureSourceBoundary.uiCodeOwnsLessonPayload, false);
    assert.equal(learningFixtureSourceBoundary.publishableFromFixture, false);
    assert.equal(learningFixtureSourceReview.reviewStatus, "method_adapted");
    assert.equal(learningFixtureSourceReview.productionReady, false);
    assert.equal(learningFixtureSourceReview.humanReviewRequired, true);
    assert.equal(learningFixtureSourceReview.wordingReviewStatus, "DONE_WITH_HUMAN_PENDING");
    assert.equal(learningFixtureSourceProvenance.activeSourceRoot, "content/getcourse-finstrategy/");
    assert.equal(learningFixtureSourceProvenance.sourceInventory.humanReviewRequiredLessons, 73);
    assert.equal(learningFixtureSourceProvenance.inactiveSourcesNotUsed.includes("content/getcourse-path-to-money"), true);

    const reviewStatuses = [
      contentFixture.review.reviewStatus,
      ...contentFixture.provenance.lessonSources.map((source) => source.adaptationStatus),
      ...contentFixture.lessons.map((lesson) => lesson.review.reviewStatus)
    ];

    assert.equal(contentFixture.runtimeBoundary.productionContentSourceOfTruth, "CMS/PostgreSQL");
    assert.equal(contentFixture.runtimeBoundary.webRuntimeRole, "renderer_adapter_consumer");
    assert.equal(contentFixture.runtimeBoundary.uiCodeOwnsLessonPayload, false);
    assert.equal(contentFixture.review.productionReady, false);
    assert.equal(contentFixture.review.humanReviewRequired, true);
    assert.equal(reviewStatuses.includes("production_ready"), false);
    assert.equal(
      contentFixture.provenance.lessonSources.every((source) => source.sourceHumanReview === "required"),
      true
    );
  });
});

describe("fixture-backed lesson renderer", () => {
  it("resolves direct N1, N2 and N3 lesson entries from the fixture set", () => {
    const result = getLessonRendererState("N1");
    const n2 = getLessonRendererState("N2");
    const n3 = getLessonRendererState("N3");
    const n3Alias = getLessonRendererState("N3_DECLUTTER_TO_GOAL");

    assert.equal(result.state, "ready");
    assert.equal(result.lesson.source, "synthetic");
    assert.equal(result.lesson.routeId, "N1");
    assert.equal(result.lesson.lessonId, "N1_RESERVE_START");
    assert.equal(n2.state, "ready");
    assert.equal(n2.lesson.source, "synthetic");
    assert.equal(n2.lesson.routeId, "N2");
    assert.equal(n2.lesson.lessonId, "N2_SAVINGS_CHALLENGE_START");
    assert.equal(n3.state, "ready");
    assert.equal(n3.lesson.source, "synthetic");
    assert.equal(n3.lesson.routeId, "N3");
    assert.equal(n3.lesson.lessonId, "N3_DECLUTTER_TO_GOAL");
    assert.equal(n3Alias.state, "ready");
    assert.equal(n3Alias.lesson.routeId, "N3");
  });

  it("keeps the fixture contract aligned to required lesson block order", () => {
    for (const lesson of [syntheticN1LessonFixture, syntheticN2LessonFixture, syntheticN3LessonFixture]) {
      assert.deepEqual(
        lesson.blocks.map((block) => block.blockType),
        ["situation", "why", "rule", "example", "mini_test", "practice", "reward"],
        `${lesson.routeId} block order`
      );
      assert.equal(lesson.examples.length, 2);
      assert.equal(
        lesson.quizItems.every((item) => item.displayOnly === true),
        true
      );
      assert.equal(lesson.practiceTask.storesExactSum, false);
      assert.equal(lesson.practiceTask.requiresPhoto, false);
      assert.equal(lesson.practiceTask.requiresDocument, false);
      assert.equal(lesson.practiceTask.requiresBankScreenshot, false);
      assert.equal(lesson.review.humanReviewRequired, true);
    }
  });

  it("keeps the synthetic N3 decluttering fixture display-only and non-persistent", () => {
    assert.equal(syntheticN3LessonFixture.routeId, "N3");
    assert.equal(syntheticN3LessonFixture.lessonId, "N3_DECLUTTER_TO_GOAL");
    assert.equal(syntheticN3LessonFixture.primaryCompetency, "C4");
    assert.deepEqual(syntheticN3LessonFixture.secondaryCompetencies, ["C3", "C9"]);
    assert.deepEqual(
      syntheticN3LessonFixture.quizItems.map((item) => item.quizId),
      ["Q10", "Q11", "Q12"]
    );
    assert.equal(
      syntheticN3LessonFixture.quizItems.every((item) => item.displayOnly === true),
      true
    );
    assert.equal(syntheticN3LessonFixture.practiceTask.taskType, "checklist");
    assert.match(syntheticN3LessonFixture.practiceTask.allowedInputs.join(" "), /диапазон вещей/);
    assert.match(syntheticN3LessonFixture.practiceTask.allowedInputs.join(" "), /чек-лист безопасности/);
    assert.match(syntheticN3LessonFixture.practiceTask.allowedInputs.join(" "), /категория направления/);
    assert.equal(syntheticN3LessonFixture.practiceTask.storesExactSum, false);
    assert.equal(syntheticN3LessonFixture.practiceTask.requiresPhoto, false);
    assert.equal(syntheticN3LessonFixture.practiceTask.requiresDocument, false);
    assert.equal(syntheticN3LessonFixture.practiceTask.requiresBankScreenshot, false);
    assert.equal(syntheticN3LessonFixture.review.humanReviewRequired, true);

    const fixtureText = JSON.stringify(syntheticN3LessonFixture);
    const forbiddenRequestPatterns = [
      "загрузите фото",
      "приложите фото",
      "укажите адрес",
      "укажите ссылку на объявление",
      "укажите сумму сделки",
      "отправьте переписку с покупателем",
      "загрузите скриншот оплаты",
      "банковский скриншот требуется",
      "точные личные суммы обязательны",
      "обязательный мерч",
      "гарантированный результат",
      "случайный приз"
    ];

    for (const token of forbiddenRequestPatterns) {
      assert.equal(fixtureText.includes(token), false, `N3 fixture requests forbidden data or claim: ${token}`);
    }

    assert.match(syntheticN3LessonFixture.reward.noMoneyEquivalentCopy, /не являются деньгами/);
    assert.match(syntheticN3LessonFixture.reward.noMoneyEquivalentCopy, /зарплатой/);
    assert.match(syntheticN3LessonFixture.reward.noMoneyEquivalentCopy, /гарантией результата/);
    assert.match(syntheticN3LessonFixture.reward.noMoneyEquivalentCopy, /случайной наградой/);
    assert.match(syntheticN3LessonFixture.reward.noMoneyEquivalentCopy, /денежным эквивалентом/);
  });

  it("renders the full synthetic N1 lesson without persistence or points claims", () => {
    const html = renderToStaticMarkup(LessonRendererScreen({ lesson: syntheticN1LessonFixture }));

    assert.match(html, /Синтетический урок/);
    assert.match(html, /N1: первый резерв/);
    assert.match(html, /Ситуация/);
    assert.match(html, /Зачем/);
    assert.match(html, /Правило/);
    assert.match(html, /Пример: офис/);
    assert.match(html, /Пример: сменный график/);
    assert.match(html, /Мини-тест/);
    assert.match(html, /Локальное превью/);
    assert.match(html, /Практика/);
    assert.match(html, /Демо без начисления баллов/);
    assert.match(html, /не являются деньгами/);
    assert.doesNotMatch(html, /завершение урока зафиксировано/);
    assert.doesNotMatch(html, /ответ отправлен/);
  });

  it("renders the synthetic N2 savings challenge without persistence, exact sums or points claims", () => {
    const html = renderToStaticMarkup(LessonRendererScreen({ lesson: syntheticN2LessonFixture }));

    assert.match(html, /Синтетический урок/);
    assert.match(html, /Челлендж накоплений/);
    assert.match(html, /N2: начните копить играючи/);
    assert.match(html, /6-недельного накопительного challenge/);
    assert.match(html, /Пример: офис/);
    assert.match(html, /Пример: сменный график/);
    assert.match(html, /Мини-тест/);
    assert.match(html, /Локальное превью/);
    assert.match(html, /Практика/);
    assert.match(html, /Выбрать формат без сохранения/);
    assert.match(html, /Демо без начисления баллов/);
    assert.match(html, /не являются деньгами/);
    assert.match(html, /гарантией накоплений/);
    assert.doesNotMatch(html, /запуск challenge зафиксирован/);
    assert.doesNotMatch(html, /ответ отправлен/);
    assert.doesNotMatch(html, /банковский скриншот требуется/);
  });

  it("renders the synthetic N3 decluttering lesson without sale proof, persistence or unsafe rewards", () => {
    const html = renderToStaticMarkup(LessonRendererScreen({ lesson: syntheticN3LessonFixture }));

    assert.match(html, /Синтетический урок/);
    assert.match(html, /Расхламление дома/);
    assert.match(html, /N3: пополняйте копилки/);
    assert.match(html, /Пример: офис/);
    assert.match(html, /Пример: сменный график/);
    assert.match(html, /Мини-тест/);
    assert.match(html, /Локальное превью/);
    assert.match(html, /Практика/);
    assert.match(html, /Выбрать план без сохранения/);
    assert.match(html, /Что безопаснее при продаже вещи/);
    assert.match(html, /не являются деньгами/);
    assert.match(html, /гарантией результата/);
    assert.match(html, /случайной наградой/);
    assert.doesNotMatch(html, /продажа зафиксирована/);
    assert.doesNotMatch(html, /ответ отправлен/);
    assert.doesNotMatch(html, /загрузите фото/);
    assert.doesNotMatch(html, /укажите адрес/);
    assert.doesNotMatch(html, /загрузите скриншот оплаты/);
  });

  it("keeps the renderer source free of customer brand, old access terms and unsafe claims", async () => {
    const haystack = await managedSourceText();
    const forbidden = [
      "Lem" + "ana",
      "Лем" + "ана",
      "co" + "hort",
      "co" + "hortId",
      "co" + "horts",
      "быстрый " + "доход",
      joinText("гарантир", "ованный", " ", "результат"),
      "без " + "риска",
      joinText("рейтинг", " ", "сотрудников"),
      joinText("лучшие", " ", "сотрудники"),
      joinText("худшие", " ", "сотрудники")
    ];

    for (const token of forbidden) {
      assert.equal(haystack.includes(token), false, `forbidden token found: ${token}`);
    }
  });
});

async function managedSourceText() {
  const files = [];
  for (const dir of managedSourceDirs) {
    files.push(...(await listFiles(join(appRoot, dir))));
  }

  const chunks = await Promise.all(
    files
      .filter((file) => /\.(css|ts|tsx)$/.test(file))
      .map((file) => readFile(file, "utf8"))
  );
  return chunks.join("\n");
}

function joinText(...parts) {
  return parts.join("");
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else {
      files.push(path);
    }
  }
  return files;
}
