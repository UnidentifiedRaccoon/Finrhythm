import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.ADMIN_SMOKE_BASE_URL ?? "http://127.0.0.1:3300";
const outputDir = process.env.ADMIN_SMOKE_OUTPUT_DIR ?? ".";
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;

const scenarios = [
  {
    name: "desktop-success",
    path: "/",
    viewport: { width: 1440, height: 960 },
    expected: ["Статус кодов пула доступа", "Источник: синтетический fixture", "500 · Запланирован", "Активирован"],
    forbiddenText: ["500 · PLANNED"]
  },
  {
    name: "mobile-success",
    path: "/",
    viewport: { width: 390, height: 844 },
    expected: ["Статус кодов пула доступа", "Воронка", "ID записи"]
  },
  {
    name: "desktop-empty",
    path: "/?state=empty&status=ACTIVATED",
    viewport: { width: 1280, height: 860 },
    expected: ["Нет строк для отображения", "По текущему фильтру нет записей"]
  },
  {
    name: "desktop-error",
    path: "/?state=error",
    viewport: { width: 1280, height: 860 },
    expected: ["Не удалось открыть статус пула доступа", "Синтетическая ошибка"]
  },
  {
    name: "desktop-loading",
    path: "/?state=loading",
    viewport: { width: 1280, height: 860 },
    expected: ["Загружаем статус пула доступа", "служебные ID записей"]
  }
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath
});
const refs = [];

try {
  for (const scenario of scenarios) {
    const page = await browser.newPage({ viewport: scenario.viewport });
    const response = await page.goto(new URL(scenario.path, baseUrl).toString(), {
      waitUntil: "networkidle"
    });
    assert.equal(response?.ok(), true, `${scenario.name} route responded`);

    for (const text of scenario.expected) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    const html = await page.content();
    for (const text of scenario.forbiddenText ?? []) {
      assert.equal(html.includes(text), false, `${scenario.name} rendered forbidden text ${text}`);
    }

    const forbidden = [
      "raw" + "Invite" + "Code",
      "lookup" + "Hash",
      "activation" + "Subject" + "Ref",
      "full" + "Name",
      "em" + "ail",
      "pho" + "ne",
      "Lem" + "ana",
      "Лем" + "ана"
    ];
    for (const token of forbidden) {
      assert.equal(html.includes(token), false, `${scenario.name} rendered forbidden token ${token}`);
    }

    const screenshotPath = join(outputDir, `mvp-02-access-pool-status-${scenario.name}.png`);
    await page.screenshot({ fullPage: true, path: screenshotPath });
    refs.push(screenshotPath);
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  join(outputDir, "mvp-02-access-pool-status-browser-smoke.json"),
  JSON.stringify({ baseUrl, screenshots: refs, scenarios: scenarios.map((item) => item.name) }, null, 2)
);

console.log(`browser smoke passed: ${refs.length} screenshots`);
