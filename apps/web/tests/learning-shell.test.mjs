import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonRendererScreen } from "../components/lesson-renderer.ts";
import { getLessonRendererState } from "../lib/lesson-state.ts";
import { LearningShellScreen } from "../components/learning-shell.ts";
import { noviceLearningFixture, syntheticN1LessonFixture } from "../lib/learning-fixtures.ts";
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
});

describe("fixture-backed lesson renderer", () => {
  it("resolves a direct N1 lesson entry from the fixture set", () => {
    const result = getLessonRendererState("N1");

    assert.equal(result.state, "ready");
    assert.equal(result.lesson.source, "synthetic");
    assert.equal(result.lesson.routeId, "N1");
    assert.equal(result.lesson.lessonId, "N1_RESERVE_START");
  });

  it("keeps the fixture contract aligned to required lesson block order", () => {
    assert.deepEqual(
      syntheticN1LessonFixture.blocks.map((block) => block.blockType),
      ["situation", "why", "rule", "example", "mini_test", "practice", "reward"]
    );
    assert.equal(syntheticN1LessonFixture.examples.length, 2);
    assert.equal(
      syntheticN1LessonFixture.quizItems.every((item) => item.displayOnly === true),
      true
    );
    assert.equal(syntheticN1LessonFixture.practiceTask.storesExactSum, false);
    assert.equal(syntheticN1LessonFixture.practiceTask.requiresPhoto, false);
    assert.equal(syntheticN1LessonFixture.practiceTask.requiresDocument, false);
    assert.equal(syntheticN1LessonFixture.practiceTask.requiresBankScreenshot, false);
    assert.equal(syntheticN1LessonFixture.review.humanReviewRequired, true);
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
