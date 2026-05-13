import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.WEB_SMOKE_BASE_URL ?? "http://127.0.0.1:3400";
const outputDir = process.env.WEB_SMOKE_OUTPUT_DIR ?? ".";
const screenshotPrefix = process.env.WEB_SMOKE_SCREENSHOT_PREFIX ?? "mvp-03-employee-start-route-ui-001";
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
const syntheticInviteCode = joinText("INVITE", "-", "LOCAL", "-", "001");
const sessionFormValues = {
  inviteCode: syntheticInviteCode,
  fullName: "Ирина Петрова",
  email: "irina.profile@example.test",
  phone: "+70000000000"
};

const profileSummary = {
  employeeRegistrationId: "10000000-0000-4000-8000-000000000001",
  fullName: "Ирина Петрова",
  email: "irina.profile@example.test",
  phone: "+70000000000",
  tenantId: "20000000-0000-4000-8000-000000000001",
  pilotLaunchId: "30000000-0000-4000-8000-000000000001",
  accessPoolId: "40000000-0000-4000-8000-000000000001",
  registeredAt: "2026-05-13T09:00:00Z",
  contactVerifiedByRegistrationMatch: true
};

const scenarios = [
  {
    name: "mobile-start",
    path: "/start",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Начните с приватности",
      "Секрет сессии не идёт через адрес",
      "Безопасный порядок",
      "Сначала граница приватности",
      "Затем временная профильная сессия",
      "Контакты только после сессии",
      "Перейти к приватности",
      "Уже прочитали про приватность: продолжить вход в профиль"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.locator("input").count(), 0);
      assert.equal(await page.locator("a[href='/profile/contact']").count(), 0);
      assert.equal(await page.locator("a.primary-action[href='/onboarding/privacy']").count(), 1);
      assert.equal(await page.locator("a.secondary-action[href='/profile/session']").count(), 1);
    }
  },
  {
    name: "mobile-start-to-onboarding-privacy",
    path: "/start",
    viewport: { width: 390, height: 844 },
    expected: ["Начните с приватности", "Перейти к приватности"],
    action: async (page) => {
      await page.getByRole("link", { name: "Перейти к приватности" }).click();
      await page.waitForURL("**/onboarding/privacy", { timeout: 5000 });
    },
    expectedAfter: [
      "Какие данные видит работодатель",
      "Что HR видит по умолчанию",
      "Что HR не видит по умолчанию",
      "Открыть вход в профиль"
    ],
    assertAfter: async (page) => {
      assert.equal(new URL(page.url()).pathname, "/onboarding/privacy");
      assert.equal(page.url().includes(joinText("profile", "Session", "Token", "=")), false);
    }
  },
  {
    name: "mobile-start-to-profile-session",
    path: "/start",
    viewport: { width: 390, height: 844 },
    expected: ["Начните с приватности", "Перейти к приватности"],
    action: async (page) => {
      await page.getByRole("link", { name: "Перейти к приватности" }).click();
      await page.waitForURL("**/onboarding/privacy", { timeout: 5000 });
      await page.getByRole("link", { name: "Открыть вход в профиль" }).click();
      await page.waitForURL("**/profile/session", { timeout: 5000 });
    },
    expectedAfter: [
      "Подтвердите контактный профиль",
      "Код приглашения",
      "Имя и фамилия",
      "Граница приватности видна до входа",
      "Открыть профиль"
    ],
    assertAfter: async (page) => {
      assert.equal(new URL(page.url()).pathname, "/profile/session");
      assert.equal(page.url().includes(joinText("profile", "Session", "Token", "=")), false);
    }
  },
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
      "Диагностика будет отдельным шагом",
      "Открыть вход в профиль",
      "Посмотреть демо-обучение"
    ]
  },
  {
    name: "mobile-onboarding-privacy-to-profile-session",
    path: "/onboarding/privacy",
    viewport: { width: 390, height: 844 },
    expected: [
      "Какие данные видит работодатель",
      "Что HR не видит по умолчанию",
      "Открыть вход в профиль"
    ],
    action: async (page) => {
      await page.getByRole("link", { name: "Открыть вход в профиль" }).click();
      await page.waitForURL("**/profile/session", { timeout: 5000 });
    },
    expectedAfter: [
      "Подтвердите контактный профиль",
      "Код приглашения",
      "Имя и фамилия",
      "Граница приватности видна до входа",
      "Открыть профиль"
    ],
    assertAfter: async (page) => {
      assert.equal(new URL(page.url()).pathname, "/profile/session");
      assert.equal(page.url().includes(joinText("profile", "Session", "Token", "=")), false);
    }
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
  },
  {
    name: "mobile-profile-contact-start",
    path: "/profile/contact",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Контакты для связи",
      "Граница приватности сохраняется",
      "Нужна профильная сессия",
      "Откройте вход в профиль",
      "Короткая сессия останется только в памяти текущей вкладки",
      "Открыть вход в профиль"
    ]
  },
  {
    name: "mobile-profile-session-start",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    expected: [
      "Финпульс",
      "Подтвердите контактный профиль",
      "Код приглашения",
      "Имя и фамилия",
      "Граница приватности видна до входа",
      "Открыть профиль"
    ]
  },
  {
    name: "mobile-profile-session-loading",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: { sessionStatus: 200, sessionDelayMs: 3000, summaryStatus: 200 },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: submitProfileSessionForm,
    expectedAfter: ["Проверяем профиль", "без сохранения секрета"]
  },
  {
    name: "mobile-profile-session-loaded",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: { sessionStatus: 200, summaryStatus: 200 },
    expected: [
      "Подтвердите контактный профиль",
      "Открыть профиль"
    ],
    action: submitProfileSessionForm,
    expectedAfter: [
      "Профильная сессия готова",
      "Проверьте контактные поля",
      "Ирина Петрова",
      "Email",
      "Телефон",
      "Сохранить контакты"
    ],
    assertAfter: assertLoadedProfileFields
  },
  {
    name: "mobile-profile-session-updated",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      summaryStatus: 200,
      expectedPatchBody: { email: "updated.profile@example.test", phone: "+70000000001" },
      contactStatus: 200,
      contactResponse: {
        ...profileSummary,
        email: "updated.profile@example.test",
        phone: "+70000000001",
        changed: true,
        outcome: "updated",
        changedFields: ["email", "phone"],
        contactVerifiedByProfileSession: true
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: async (page) => {
      await submitProfileSessionForm(page);
      await page.getByText("Проверьте контактные поля", { exact: false }).first().waitFor({ timeout: 5000 });
      await page.getByLabel("Email").fill("updated.profile@example.test");
      await page.getByLabel("Телефон").fill("+70000000001");
      await page.getByRole("button", { name: "Сохранить контакты" }).click();
    },
    expectedAfter: ["Контакты обновлены", "Имя осталось без изменений"]
  },
  {
    name: "mobile-profile-session-noop",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      summaryStatus: 200,
      expectedPatchBody: { email: "IRINA.PROFILE@example.test" },
      contactStatus: 200,
      contactResponse: {
        ...profileSummary,
        changed: false,
        outcome: "noop",
        changedFields: [],
        contactVerifiedByProfileSession: true
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: async (page) => {
      await submitProfileSessionForm(page);
      await page.getByText("Проверьте контактные поля", { exact: false }).first().waitFor({ timeout: 5000 });
      await page.getByLabel("Email").fill("IRINA.PROFILE@example.test");
      await page.getByRole("button", { name: "Сохранить контакты" }).click();
    },
    expectedAfter: ["Контакты уже совпадали", "после нормализации email и телефон уже были такими же"]
  },
  {
    name: "mobile-profile-session-contact-validation-400",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      summaryStatus: 200,
      expectedPatchBody: { phone: "" },
      contactStatus: 400,
      contactResponse: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        fieldErrors: [{ field: "phone", code: "INVALID_PHONE", message: "Invalid phone" }]
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: async (page) => {
      await submitProfileSessionForm(page);
      await page.getByText("Проверьте контактные поля", { exact: false }).first().waitFor({ timeout: 5000 });
      await page.getByLabel("Телефон").fill("");
      await page.getByRole("button", { name: "Сохранить контакты" }).click();
    },
    expectedAfter: ["Проверьте контактные данные", "Мы не показываем введённое значение в ошибке"]
  },
  {
    name: "mobile-profile-session-invalid-proof-400",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 400,
      sessionResponse: {
        code: "EMPLOYEE_PROFILE_SESSION_PROOF_INVALID",
        message: "Profile proof did not match",
        fieldErrors: []
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: submitProfileSessionForm,
    expectedAfter: ["Не удалось подтвердить профиль", "Мы не показываем введённые значения"],
    assertAfter: async (page) => {
      assert.equal(await page.getByLabel("Код приглашения").inputValue(), "");
    }
  },
  {
    name: "mobile-profile-session-invalid-401",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      summaryStatus: 401,
      summaryResponse: {
        code: "PROFILE_SESSION_INVALID",
        message: "Profile session expired or invalid",
        fieldErrors: []
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: submitProfileSessionForm,
    expectedAfter: [
      "Сессия истекла",
      "Нужна новая профильная сессия",
      "Вернитесь к входу по коду",
      "Пароль или постоянный вход здесь не создаются"
    ]
  },
  {
    name: "mobile-profile-session-generic-failure",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 503,
      sessionResponse: {
        code: "TEMPORARY_UNAVAILABLE",
        message: "Temporary unavailable",
        fieldErrors: []
      }
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: submitProfileSessionForm,
    expectedAfter: ["Не удалось создать профильную сессию", "сеть или API временно недоступны"],
    assertAfter: async (page) => {
      assert.equal(await page.getByLabel("Код приглашения").inputValue(), "");
    }
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
    const profileSessionToken = scenario.profileMock || scenario.sessionMock ? randomUUID() : null;
    if (scenario.profileMock) {
      await installProfileContactMocks(page, scenario.profileMock, profileSessionToken);
    }
    if (scenario.sessionMock) {
      await installProfileSessionFlowMocks(page, scenario.sessionMock, profileSessionToken);
    }

    const scenarioPath = typeof scenario.path === "function" ? scenario.path(profileSessionToken) : scenario.path;
    const response = await page.goto(new URL(scenarioPath, baseUrl).toString(), {
      waitUntil: "networkidle"
    });
    assert.equal(response?.ok(), true, `${scenario.name} route responded`);

    for (const text of scenario.expected) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    if (scenario.assertBefore) {
      await scenario.assertBefore(page);
    }

    if (scenario.action) {
      await scenario.action(page);
    }

    for (const text of scenario.expectedAfter ?? []) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    if (scenario.assertAfter) {
      await scenario.assertAfter(page);
    }

    const html = await page.content();
    const visibleText = await page.locator("body").innerText();
    assert.equal(
      page.url().includes(joinText("profile", "Session", "Token", "=")),
      false,
      `${scenario.name} has no profile-session token in the URL`
    );
    if (profileSessionToken) {
      assert.equal(visibleText.includes(profileSessionToken), false, `${scenario.name} did not show raw profile-session token`);
    }
    if (scenario.sessionMock) {
      assert.equal(html.includes(syntheticInviteCode), false, `${scenario.name} did not keep raw invite code in HTML`);
      assert.equal(visibleText.includes(syntheticInviteCode), false, `${scenario.name} did not show raw invite code`);
    }

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
      "случайный " + "приз",
      joinText("local", "Storage"),
      joinText("session", "Storage"),
      joinText("document", ".", "cookie"),
      joinText("cookie", "Store")
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

async function submitProfileSessionForm(page) {
  await page.getByLabel("Код приглашения").fill(sessionFormValues.inviteCode);
  await page.getByLabel("Имя и фамилия").fill(sessionFormValues.fullName);
  await page.getByLabel("Email").fill(sessionFormValues.email);
  await page.getByLabel("Телефон").fill(sessionFormValues.phone);
  await page.getByRole("button", { name: "Открыть профиль" }).click();
}

async function installProfileSessionFlowMocks(page, sessionMock, profileSessionToken) {
  await page.route("**/api/v1/employee-registrations/profile-sessions", async (route) => {
    const request = route.request();
    const body = JSON.parse(request.postData() ?? "{}");
    assert.equal(request.method(), "POST");
    assert.deepEqual(Object.keys(body).sort(), ["email", "fullName", "inviteCode", "phone"]);
    assert.equal(typeof body.inviteCode, "string");
    assert.equal(typeof body.fullName, "string");
    assert.equal(typeof body.email, "string");
    assert.equal(typeof body.phone, "string");

    if (sessionMock.sessionDelayMs) {
      await delay(sessionMock.sessionDelayMs);
    }

    await route.fulfill({
      contentType: "application/json",
      status: sessionMock.sessionStatus,
      body: JSON.stringify(
        sessionMock.sessionResponse ??
          {
            profileSessionToken,
            expiresAt: "2026-05-13T09:15:00Z",
            employeeRegistrationId: profileSummary.employeeRegistrationId,
            tenantId: profileSummary.tenantId,
            pilotLaunchId: profileSummary.pilotLaunchId,
            accessPoolId: profileSummary.accessPoolId,
            contactVerifiedByRegistrationMatch: true
          }
      )
    });
  });

  if (sessionMock.summaryStatus !== undefined) {
    await installProfileContactMocks(page, sessionMock, profileSessionToken);
  }
}

async function installProfileContactMocks(page, profileMock, profileSessionToken) {
  await page.route("**/api/v1/employee-registrations/me/profile-summary", async (route) => {
    const request = route.request();
    assert.equal(request.method(), "GET");
    assert.equal(request.url().includes(profileSessionToken), false, "summary request does not leak token in URL");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);

    await route.fulfill({
      contentType: "application/json",
      status: profileMock.summaryStatus,
      body: JSON.stringify(profileMock.summaryResponse ?? profileSummary)
    });
  });

  if (profileMock.contactStatus === undefined) {
    return;
  }

  await page.route("**/api/v1/employee-registrations/me/contact", async (route) => {
    const request = route.request();
    assert.equal(request.method(), "PATCH");
    assert.equal(request.url().includes(profileSessionToken), false, "contact request does not leak token in URL");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    assert.deepEqual(JSON.parse(request.postData() ?? "{}"), profileMock.expectedPatchBody);

    await route.fulfill({
      contentType: "application/json",
      status: profileMock.contactStatus,
      body: JSON.stringify(profileMock.contactResponse)
    });
  });
}

async function assertLoadedProfileFields(page) {
  assert.equal(await page.getByLabel("Email").inputValue(), profileSummary.email);
  assert.equal(await page.getByLabel("Телефон").inputValue(), profileSummary.phone);
}

function joinText(...parts) {
  return parts.join("");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
