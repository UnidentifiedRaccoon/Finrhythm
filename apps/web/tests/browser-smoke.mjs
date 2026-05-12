import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.WEB_SMOKE_BASE_URL ?? "http://127.0.0.1:3400";
const outputDir = process.env.WEB_SMOKE_OUTPUT_DIR ?? ".";
const screenshotPrefix = process.env.WEB_SMOKE_SCREENSHOT_PREFIX ?? "mvp-03-onboarding-privacy-screen-001";
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;

const scenarios = [
  {
    name: "mobile-ready",
    path: "/learning",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Новичок",
      "План N1-N7",
      "Урок-превью N1",
      "Открыть урок",
      "Открыть N2",
      "Открыть N3",
      "Подробнее о приватности"
    ]
  },
  {
    name: "mobile-onboarding-privacy",
    path: "/onboarding/privacy",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Какие данные видит работодатель",
      "Что HR видит по умолчанию",
      "Агрегированную аналитику по группе",
      "Что HR не видит по умолчанию",
      "персональные ответы диагностики",
      "Старт проходит без фото, документов и банковских скриншотов",
      "Текст требует юридической проверки",
      "не является принятием согласия",
      "Диагностика будет отдельным шагом"
    ]
  },
  {
    name: "mobile-lesson-n1",
    path: "/learning/lessons/N1",
    viewport: { width: 390, height: 844 },
    expected: ["Финпульс", "Финансовая опора", "N1: первый резерв", "Мини-тест", "Пример: сменный график"]
  },
  {
    name: "mobile-lesson-n2",
    path: "/learning/lessons/N2",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Челлендж накоплений",
      "N2: начните копить играючи",
      "Мини-тест",
      "Выбрать формат без сохранения",
      "Демо без начисления баллов"
    ]
  },
  {
    name: "mobile-lesson-n3",
    path: "/learning/lessons/N3",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Расхламление дома",
      "N3: пополняйте копилки",
      "Что безопаснее при продаже вещи",
      "Выбрать план без сохранения",
      "Демо без начисления баллов"
    ]
  },
  {
    name: "mobile-empty",
    path: "/learning?state=empty",
    viewport: { width: 390, height: 844 },
    expected: ["Уроки не найдены", "Для демо-режима пока не добавлены уроки"]
  },
  {
    name: "mobile-error",
    path: "/learning?state=error",
    viewport: { width: 390, height: 844 },
    expected: ["Не удалось открыть обучение", "Синтетическая ошибка"]
  },
  {
    name: "mobile-loading",
    path: "/learning?state=loading",
    viewport: { width: 390, height: 844 },
    expected: ["Загружаем учебный маршрут", "без персональных данных"]
  }
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath
});
const refs = [];

try {
  for (const scenario of scenarios) {
    const page = await browser.newPage({
      isMobile: true,
      viewport: scenario.viewport
    });
    const response = await page.goto(new URL(scenario.path, baseUrl).toString(), {
      waitUntil: "networkidle"
    });
    assert.equal(response?.ok(), true, `${scenario.name} route responded`);

    for (const text of scenario.expected) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    const html = await page.content();
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
      joinText("худшие", " ", "сотрудники"),
      "пас" + "порт",
      "загрузите " + "скриншот",
      "отправьте " + "документ",
      "загрузите " + "фото",
      "приложите " + "фото",
      "укажите " + "адрес",
      "укажите " + "ссылку на объявление",
      "укажите " + "сумму сделки",
      "отправьте " + "переписку с покупателем",
      "загрузите " + "скриншот оплаты",
      "банковский " + "скриншот требуется",
      "точные " + "личные суммы обязательны",
      "обязательный " + "мерч",
      joinText("гарантир", "ованный", " ", "мерч"),
      joinText("гарантир", "ованный", " ", "результат"),
      "случайный " + "приз"
    ];
    for (const token of forbidden) {
      assert.equal(html.includes(token), false, `${scenario.name} rendered forbidden token ${token}`);
    }

    const screenshotPath = join(outputDir, `${screenshotPrefix}-${scenario.name}.png`);
    await page.screenshot({ fullPage: true, path: screenshotPath });
    refs.push(screenshotPath);
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  join(outputDir, `${screenshotPrefix}-browser-smoke.json`),
  JSON.stringify({ baseUrl, screenshots: refs, scenarios: scenarios.map((item) => item.name) }, null, 2)
);

console.log(`web browser smoke passed: ${refs.length} screenshots`);

function joinText(...parts) {
  return parts.join("");
}
