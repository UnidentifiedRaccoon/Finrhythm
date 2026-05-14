import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  DIAGNOSTIC_ME_DRAFT_PATH,
  DIAGNOSTIC_ME_SUBMIT_PATH,
  LEARNING_ME_LESSON_START_PATH_TEMPLATE,
  LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE,
  LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION,
  LEGAL_DOCUMENT_TYPES
} from "@finrhythm/api-client";

const baseUrl = process.env.WEB_SMOKE_BASE_URL ?? "http://127.0.0.1:3400";
const outputDir = process.env.WEB_SMOKE_OUTPUT_DIR ?? ".";
const screenshotPrefix = process.env.WEB_SMOKE_SCREENSHOT_PREFIX ?? "mvp-04-employee-app-ia-nav-001";
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
const syntheticInviteCode = joinText("INVITE", "-", "LOCAL", "-", "001");
const sessionFormValues = {
  inviteCode: syntheticInviteCode,
  fullName: "Синтетический Участник",
  email: "synthetic.profile@example.test",
  phone: "+70000000000"
};

const profileSummary = {
  employeeRegistrationId: "10000000-0000-4000-8000-000000000001",
  fullName: "Синтетический Участник",
  email: "synthetic.profile@example.test",
  phone: "+70000000000",
  tenantId: "20000000-0000-4000-8000-000000000001",
  pilotLaunchId: "30000000-0000-4000-8000-000000000001",
  accessPoolId: "40000000-0000-4000-8000-000000000001",
  registeredAt: "2026-05-13T09:00:00Z",
  contactVerifiedByRegistrationMatch: true
};

const expectedLegalAcceptanceBody = {
  documents: LEGAL_DOCUMENT_TYPES.map((documentType) => ({
    documentType,
    documentVersion: LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION
  })),
  source: "web_profile_session"
};

const legalAcceptanceResponse = {
  employeeRegistrationId: profileSummary.employeeRegistrationId,
  tenantId: profileSummary.tenantId,
  pilotLaunchId: profileSummary.pilotLaunchId,
  accessPoolId: profileSummary.accessPoolId,
  acceptedDocuments: expectedLegalAcceptanceBody.documents.map((document) => ({
    ...document,
    acceptedAt: "2026-05-13T09:05:00Z",
    source: expectedLegalAcceptanceBody.source
  })),
  createdCount: expectedLegalAcceptanceBody.documents.length,
  idempotentRetry: false
};

const legalAcceptancePath = LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE.replace(
  "{employeeRegistrationId}",
  profileSummary.employeeRegistrationId
);

const diagnosticAttemptBase = {
  attemptId: "50000000-0000-4000-8000-000000000001",
  employeeRegistrationId: profileSummary.employeeRegistrationId,
  tenantId: profileSummary.tenantId,
  pilotLaunchId: profileSummary.pilotLaunchId,
  accessPoolId: profileSummary.accessPoolId,
  state: "DRAFT",
  allowedAnswerIds: {
    q0QuestionIds: ["Q0"],
    q0OptionIds: ["WHO_SEES_ANSWERS", "TRAINING_TIME", "ASSIGNMENTS_REQUIRED", "POINTS_ACCRUAL", "READY_TO_START"],
    selfAssessmentQuestionIds: ["SA1", "SA2", "SA3"],
    routingQuestionOptions: [
      { id: "Q1", optionIds: ["A", "B", "C", "D"] },
      { id: "Q2", optionIds: ["A", "B", "C", "D", "E"] },
      { id: "Q3", optionIds: ["A", "B", "C", "D"] }
    ]
  },
  q0: {
    id: "Q0",
    selectedOptionIds: []
  },
  selfAssessment: [],
  routingAnswers: [],
  routePreview: false,
  recommendedFirstLessonId: null,
  createdAt: "2026-05-14T09:10:00Z",
  updatedAt: "2026-05-14T09:10:00Z",
  submittedAt: null
};

const expectedDiagnosticDraftBody = {
  q0: {
    selectedOptionIds: ["WHO_SEES_ANSWERS", "READY_TO_START"]
  },
  selfAssessment: [
    { id: "SA1", value: 3 },
    { id: "SA2", value: 3 },
    { id: "SA3", value: 3 }
  ],
  routingAnswers: [
    { id: "Q1", optionId: "B" },
    { id: "Q2", optionId: "E" },
    { id: "Q3", optionId: "A" }
  ]
};

const diagnosticSubmitResponse = {
  state: "SUBMITTED",
  routePreview: true,
  recommendedFirstLessonId: "N1",
  createdAt: "2026-05-14T09:10:00Z",
  updatedAt: "2026-05-14T09:12:00Z",
  submittedAt: "2026-05-14T09:13:00Z"
};

const n1LessonStartPath = LEARNING_ME_LESSON_START_PATH_TEMPLATE.replace("{lessonId}", "N1");

const n1LessonProgressResponse = {
  lessonId: "N1",
  status: "STARTED",
  startedAt: "2026-05-14T09:14:00Z",
  lastOpenedAt: "2026-05-14T09:14:00Z",
  idempotentResume: false
};

const scenarios = [
  {
    name: "mobile-home",
    path: "/",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: [
      "Финпульс",
      "Ваш спокойный маршрут",
      "Открыть preview",
      "Открыть обучение",
      "Открыть профиль",
      "Челлендж",
      "Награды",
      "Помощь по доступу и навигации",
      "Открыть поддержку"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.locator("a[href='/support']").count(), 1);
      assert.equal(await page.locator("a[href='/diagnostics']").count(), 1);
      assert.equal(await page.locator("nav.bottom-nav a[href='/support']").count(), 0);
    }
  },
  {
    name: "mobile-diagnostics-q0",
    path: "/diagnostics",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: [
      "Финпульс",
      "Спокойный вход в preview",
      "Q0 сначала: кто что видит",
      "Что важно знать перед стартом",
      "Локальный progress preview",
      "1 из 4",
      "Продолжить к самооценке"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.getByText("SA1", { exact: false }).count(), 0);
      assert.equal(await page.getByText("Q1 ·", { exact: false }).count(), 0);
      assert.equal(await page.locator("form").count(), 0);
    }
  },
  {
    name: "mobile-diagnostics-sa",
    path: "/diagnostics",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: ["Спокойный вход в preview", "Q0 сначала: кто что видит"],
    action: continueFromDiagnosticQ0,
    expectedAfter: [
      "SA1-SA3",
      "Самооценка без scoring",
      "не определяют маршрут",
      "SA1 · личная уверенность",
      "SA2 · личное спокойствие",
      "SA3 · ясность следующего шага"
    ],
    assertAfter: async (page) => {
      assert.equal(await page.getByText("Q1 ·", { exact: false }).count(), 0);
      assert.equal(await page.locator("form").count(), 0);
    }
  },
  {
    name: "mobile-diagnostics-preview-questions",
    path: "/diagnostics",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: ["Спокойный вход в preview", "Q0 сначала: кто что видит"],
    action: async (page) => {
      await continueFromDiagnosticQ0(page);
      await fillDiagnosticSelfAssessment(page);
      await page.getByRole("button", { name: "Перейти к preview-вопросам" }).click();
    },
    expectedAfter: [
      "Только несколько карточек Q1-Q3",
      "synthetic preview будущего routing-блока",
      "Q1 · Финансовый резерв",
      "Q2 · Текущая опора",
      "Q3 · Первый барьер",
      "Показать черновой preview"
    ],
    assertAfter: async (page) => {
      assert.equal(await page.getByText("Q28", { exact: false }).count(), 0);
      assert.equal(await page.locator("form").count(), 0);
    }
  },
  {
    name: "mobile-diagnostics-route-preview",
    path: "/diagnostics",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: ["Спокойный вход в preview", "Q0 сначала: кто что видит"],
    action: async (page) => {
      await continueFromDiagnosticQ0(page);
      await fillDiagnosticSelfAssessment(page);
      await page.getByRole("button", { name: "Перейти к preview-вопросам" }).click();
      await answerDiagnosticPreviewQuestions(page);
      await page.getByRole("button", { name: "Показать черновой preview" }).click();
    },
    expectedAfter: [
      "Черновой preview: начните с N1",
      "не финальный результат диагностики",
      "не назначение уровня",
      "не раскрывает личные ответы работодателю",
      "Открыть N1",
      "Вернуться к обучению"
    ],
    assertAfter: async (page) => {
      assert.equal(await page.locator("a[href='/learning/lessons/N1']").count(), 1);
      assert.equal(await page.locator(".diagnostic-result-card a[href='/learning']").count(), 1);
      assert.equal(await page.locator("form").count(), 0);
    }
  },
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
    name: "mobile-start-to-profile-session-diagnostic-n1-progress",
    path: "/start",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      summaryStatus: 200,
      expectedDiagnosticDraftBody
    },
    expected: ["Начните с приватности", "Перейти к приватности"],
    action: async (page) => {
      await page.getByRole("link", { name: "Перейти к приватности" }).click();
      await page.waitForURL("**/onboarding/privacy", { timeout: 5000 });
      await page.getByRole("link", { name: "Открыть вход в профиль" }).click();
      await page.waitForURL("**/profile/session", { timeout: 5000 });
      await submitProfileSessionAcceptLegalCompleteDiagnosticAndStartN1(page);
    },
    expectedAfter: [
      "Backend progress",
      "N1 начат",
      "Записан только старт или возврат к уроку",
      "N1: первый резерв",
      "Мини-тест",
      "Что этот урок не делает"
    ],
    assertAfter: async (page, requestEvents) => {
      assertProfileSessionLegalDiagnosticAndLearningStartOrder(requestEvents);
      assert.equal(new URL(page.url()).pathname, "/profile/session");
      assert.equal(await page.locator("a[href='/learning/lessons/N1']").count(), 0);
      assert.equal(await page.getByText("Backend progress", { exact: false }).count(), 1);

      const visibleText = await page.locator("body").innerText();
      for (const token of [
        "WHO_SEES_ANSWERS",
        "READY_TO_START",
        "SA1 ·",
        "SA2 ·",
        "SA3 ·",
        "Q1 ·",
        "Q2 ·",
        "Q3 ·",
        diagnosticAttemptBase.attemptId,
        profileSummary.tenantId,
        profileSummary.pilotLaunchId,
        profileSummary.accessPoolId,
        profileSummary.employeeRegistrationId
      ]) {
        assert.equal(visibleText.includes(token), false, `N1 continuation does not render ${token}`);
      }
    }
  },
  {
    name: "mobile-ready",
    path: "/learning",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Обучение",
    expected: [
      "Финпульс",
      "Новичок",
      "План N1-N7",
      "Урок-превью N1",
      "Открыть диагностику",
      "Открыть урок",
      "Открыть N2",
      "Открыть N3",
      "Подробнее о приватности"
    ]
  },
  {
    name: "mobile-challenges",
    path: "/challenges",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Челлендж",
    expected: [
      "Финпульс",
      "Челлендж пока в подготовке",
      "Сейчас это навигационная заглушка",
      "Нельзя присоединиться к активности",
      "Результаты не сохраняются",
      "Вернуться к обучению"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.locator("form").count(), 0);
      assert.equal(await page.locator("main button").count(), 0);
    }
  },
  {
    name: "mobile-rewards",
    path: "/rewards",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Награды",
    expected: [
      "Финпульс",
      "Награды появятся позже",
      "Сейчас это навигационная заглушка",
      "Счётчики и история операций здесь не показываются",
      "не обещает получение награды",
      "Вернуться к обучению"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.locator("form").count(), 0);
      assert.equal(await page.locator("main button").count(), 0);
    }
  },
  {
    name: "mobile-support",
    path: "/support",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Главная",
    expected: [
      "Финпульс",
      "Помощь по приложению",
      "доступом, маршрутом обучения, профилем и навигацией",
      "нет формы отправки обращения",
      "не даются личные финансовые, юридические, налоговые, кредитные или инвестиционные рекомендации",
      "Вернуться на главную"
    ],
    assertBefore: async (page) => {
      assert.equal(await page.locator("form").count(), 0);
      assert.equal(await page.locator("main button").count(), 0);
      assert.equal(await page.locator("nav.bottom-nav a[href='/support']").count(), 0);
    }
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
    bottomNavActive: "Обучение",
    expected: ["Финпульс", "Финансовая опора", "N1: первый резерв", "Мини-тест", "Пример: сменный график"]
  },
  {
    name: "mobile-lesson-n2",
    path: "/learning/lessons/N2",
    viewport: { width: 390, height: 844 },
    bottomNavActive: "Обучение",
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
    bottomNavActive: "Обучение",
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
    bottomNavActive: "Профиль",
    expected: [
      "Финпульс",
      "Контакты для связи",
      "Граница приватности сохраняется",
      "Помощь по доступу и навигации",
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
    bottomNavActive: "Профиль",
    expected: [
      "Финпульс",
      "Подтвердите контактный профиль",
      "Код приглашения",
      "Имя и фамилия",
      "Граница приватности видна до входа",
      "Помощь по доступу и навигации",
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
    name: "mobile-profile-session-legal-acknowledgement",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: { sessionStatus: 200, summaryStatus: 200 },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: submitProfileSessionForm,
    expectedAfter: [
      "Подтвердите текущие черновые документы",
      "Формулировки остаются черновыми",
      "не заменяет проверку юристом",
      "Подтвердить принятие черновых документов"
    ],
    assertAfter: async (_page, requestEvents) => {
      assertProfileSessionBeforeLegalStep(requestEvents);
      assert.equal(requestEvents.includes("legal-acceptance:request"), false);
      assert.equal(requestEvents.includes("contact-summary:request"), false);
    }
  },
  {
    name: "mobile-profile-session-legal-acceptance-loading",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: { sessionStatus: 200, legalDelayMs: 3000, summaryStatus: 200 },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: async (page) => {
      await submitProfileSessionForm(page);
      await page.getByText("Подтвердите текущие черновые документы", { exact: false }).first().waitFor({ timeout: 5000 });
      await acceptLegalDocuments(page);
    },
    expectedAfter: ["Записываем принятие..."],
    assertAfter: async (_page, requestEvents) => {
      assertProfileSessionBeforeLegalAcceptance(requestEvents);
      assert.equal(requestEvents.includes("contact-summary:request"), false);
    }
  },
  {
    name: "mobile-profile-session-diagnostic-loaded",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: { sessionStatus: 200, summaryStatus: 200 },
    expected: [
      "Подтвердите контактный профиль",
      "Открыть профиль"
    ],
    action: submitProfileSessionAndAcceptLegal,
    expectedAfter: [
      "Короткая диагностика старта",
      "Граница данных сохраняется",
      "Черновик открыт",
      "Что важно знать перед стартом",
      "Самооценка без scoring",
      "Первые вопросы про резерв",
      "Сохранить черновик"
    ],
    assertAfter: async (_page, requestEvents) => {
      assertLegalAcceptanceBeforeDiagnosticDraft(requestEvents);
      assert.equal(requestEvents.includes("contact-summary:request"), false);
    }
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
      await submitProfileSessionAcceptLegalAndContinueToContact(page);
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
      expectedPatchBody: { email: "SYNTHETIC.PROFILE@example.test" },
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
      await submitProfileSessionAcceptLegalAndContinueToContact(page);
      await page.getByText("Проверьте контактные поля", { exact: false }).first().waitFor({ timeout: 5000 });
      await page.getByLabel("Email").fill("SYNTHETIC.PROFILE@example.test");
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
      await submitProfileSessionAcceptLegalAndContinueToContact(page);
      await page.getByText("Проверьте контактные поля", { exact: false }).first().waitFor({ timeout: 5000 });
      await page.getByLabel("Телефон").fill("");
      await page.getByRole("button", { name: "Сохранить контакты" }).click();
    },
    expectedAfter: ["Проверьте контактные данные", "Мы не показываем введённое значение в ошибке"]
  },
  {
    name: "mobile-profile-session-legal-failure-503",
    path: "/profile/session",
    viewport: { width: 390, height: 844 },
    sessionMock: {
      sessionStatus: 200,
      legalStatus: 503,
      legalResponse: {
        code: "TEMPORARY_UNAVAILABLE",
        message: "Temporary unavailable",
        fieldErrors: []
      },
      summaryStatus: 200
    },
    expected: ["Подтвердите контактный профиль", "Открыть профиль"],
    action: async (page) => {
      await submitProfileSessionForm(page);
      await page.getByText("Подтвердите текущие черновые документы", { exact: false }).first().waitFor({ timeout: 5000 });
      await acceptLegalDocuments(page);
    },
    expectedAfter: [
      "Не удалось записать принятие документов",
      "не показываются код приглашения, сессионный секрет, идентификаторы или контактные поля"
    ],
    assertAfter: async (page, requestEvents) => {
      assertProfileSessionBeforeLegalAcceptance(requestEvents);
      assert.equal(requestEvents.includes("contact-summary:request"), false);
      assert.equal(await page.locator("input[name='email']").count(), 0);
      assert.equal(await page.locator("input[name='phone']").count(), 0);
    }
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
    action: submitProfileSessionAcceptLegalAndContinueToContact,
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
const bottomNavLayouts = [];
const requestEventSummaries = [];

try {
  for (const scenario of scenarios) {
    const page = await browser.newPage({
      isMobile: true,
      viewport: scenario.viewport
    });
    const requestEvents = [];
    const profileSessionToken = scenario.profileMock || scenario.sessionMock ? randomUUID() : null;
    if (scenario.profileMock) {
      await installProfileContactMocks(page, scenario.profileMock, profileSessionToken, requestEvents);
    }
    if (scenario.sessionMock) {
      await installProfileSessionFlowMocks(page, scenario.sessionMock, profileSessionToken, requestEvents);
    }

    const scenarioPath = typeof scenario.path === "function" ? scenario.path(profileSessionToken) : scenario.path;
    const response = await page.goto(new URL(scenarioPath, baseUrl).toString(), {
      waitUntil: "networkidle"
    });
    assert.equal(response?.ok(), true, `${scenario.name} route responded`);

    for (const text of scenario.expected) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    if (scenario.bottomNavActive) {
      bottomNavLayouts.push(await assertBottomNav(page, scenario.bottomNavActive));
    }

    if (scenario.assertBefore) {
      await scenario.assertBefore(page, requestEvents);
    }

    if (scenario.action) {
      await scenario.action(page, requestEvents);
    }

    for (const text of scenario.expectedAfter ?? []) {
      await page.getByText(text, { exact: false }).first().waitFor({ timeout: 5000 });
    }

    if (scenario.assertAfter) {
      await scenario.assertAfter(page, requestEvents);
    }
    requestEventSummaries.push({ scenario: scenario.name, requestEvents });

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
      assert.equal(
        html.includes(profileSummary.employeeRegistrationId),
        false,
        `${scenario.name} did not keep raw employee registration id in HTML`
      );
      assert.equal(
        visibleText.includes(profileSummary.employeeRegistrationId),
        false,
        `${scenario.name} did not show raw employee registration id`
      );
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
  JSON.stringify(
    {
      baseUrl,
      bottomNavLayouts,
      legalDocumentTypesCount: LEGAL_DOCUMENT_TYPES.length,
      legalDocumentDraftVersion: LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION,
      requestEventSummaries,
      screenshots: refs,
      scenarios: scenarios.map((item) => item.name)
    },
    null,
    2
  )
);

console.log(`web browser smoke passed: ${refs.length} screenshots`);

async function submitProfileSessionForm(page) {
  await page.getByLabel("Код приглашения").fill(sessionFormValues.inviteCode);
  await page.getByLabel("Имя и фамилия").fill(sessionFormValues.fullName);
  await page.getByLabel("Email").fill(sessionFormValues.email);
  await page.getByLabel("Телефон").fill(sessionFormValues.phone);
  await page.getByRole("button", { name: "Открыть профиль" }).click();
}

async function submitProfileSessionAndAcceptLegal(page) {
  await submitProfileSessionForm(page);
  await page.getByText("Подтвердите текущие черновые документы", { exact: false }).first().waitFor({ timeout: 5000 });
  await acceptLegalDocuments(page);
}

async function submitProfileSessionAcceptLegalAndCompleteDiagnostic(page) {
  await submitProfileSessionAndAcceptLegal(page);
  await page.getByText("Короткая диагностика старта", { exact: false }).first().waitFor({ timeout: 5000 });
  await fillDiagnosticApiDraft(page);
  await page.getByRole("button", { name: "Сохранить черновик" }).click();
  await page.getByText("Черновик сохранён", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Завершить диагностику" }).click();
  await page.getByText("Диагностика записана: начните с N1", { exact: false }).first().waitFor({ timeout: 5000 });
}

async function submitProfileSessionAcceptLegalCompleteDiagnosticAndStartN1(page) {
  await submitProfileSessionAcceptLegalAndCompleteDiagnostic(page);
  await page.getByRole("button", { name: "Начать или продолжить N1" }).click();
  await page.getByText("Backend progress", { exact: false }).first().waitFor({ timeout: 5000 });
}

async function submitProfileSessionAcceptLegalAndContinueToContact(page) {
  await submitProfileSessionAcceptLegalAndCompleteDiagnostic(page);
  await page.getByRole("button", { name: "Перейти к контактам" }).click();
}

async function acceptLegalDocuments(page) {
  await page.getByRole("button", { name: "Подтвердить принятие черновых документов" }).click();
}

async function continueFromDiagnosticQ0(page) {
  await page.getByRole("button", { name: "Продолжить к самооценке" }).click();
}

async function fillDiagnosticSelfAssessment(page) {
  const items = page.locator(".self-assessment-item");
  await items.nth(0).locator("button").nth(2).click();
  await items.nth(1).locator("button").nth(2).click();
  await items.nth(2).locator("button").nth(2).click();
}

async function answerDiagnosticPreviewQuestions(page) {
  const items = page.locator(".preview-question-item");
  await items.nth(0).locator("button").nth(0).click();
  await items.nth(1).locator("button").nth(3).click();
  await items.nth(2).locator("button").nth(0).click();
}

async function fillDiagnosticApiDraft(page) {
  await page.getByRole("button", { name: /Кто увидит мои ответы/ }).click();
  await page.getByRole("button", { name: /Всё понятно, хочу начать/ }).click();

  const selfAssessmentItems = page.locator(".self-assessment-item");
  await selfAssessmentItems.nth(0).locator("button").nth(2).click();
  await selfAssessmentItems.nth(1).locator("button").nth(2).click();
  await selfAssessmentItems.nth(2).locator("button").nth(2).click();

  const routingItems = page.locator(".preview-question-item");
  await routingItems.nth(0).locator("button").nth(1).click();
  await routingItems.nth(1).locator("button").nth(4).click();
  await routingItems.nth(2).locator("button").nth(0).click();
}

async function assertBottomNav(page, activeLabel) {
  const nav = page.getByRole("navigation", { name: "Основные разделы приложения" });
  await nav.waitFor({ timeout: 5000 });

  assert.equal(await nav.locator("a").count(), 5, "bottom nav has five links");
  for (const label of ["Главная", "Обучение", "Челлендж", "Награды", "Профиль"]) {
    await nav.getByText(label, { exact: true }).waitFor({ timeout: 5000 });
  }
  assert.equal(await nav.getByText("Поддержка", { exact: true }).count(), 0, "support is not a bottom-nav item");
  assert.equal(await nav.locator("a[aria-current='page']").count(), 1, "one active bottom-nav item");
  assert.match(await nav.locator("a[aria-current='page']").innerText(), new RegExp(activeLabel));

  const box = await nav.boundingBox();
  const viewport = page.viewportSize();
  assert.ok(box, "bottom nav has a layout box");
  assert.ok(viewport, "viewport is available");

  const bottomGap = viewport.height - (box.y + box.height);
  assert.ok(box.y > viewport.height * 0.65, `bottom nav is visually near the viewport bottom, top=${box.y}`);
  assert.ok(bottomGap >= 0 && bottomGap <= 24, `bottom nav is anchored near the viewport bottom, gap=${bottomGap}`);

  return {
    activeLabel,
    bottom: Math.round(box.y + box.height),
    bottomGap: Math.round(bottomGap),
    height: Math.round(box.height),
    top: Math.round(box.y),
    viewport
  };
}

async function installProfileSessionFlowMocks(page, sessionMock, profileSessionToken, requestEvents) {
  await page.route("**/api/v1/employee-registrations/profile-sessions", async (route) => {
    const request = route.request();
    const body = JSON.parse(request.postData() ?? "{}");
    requestEvents.push("profile-session:request");
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
    requestEvents.push(`profile-session:response:${sessionMock.sessionStatus}`);
  });

  await page.route(`**${legalAcceptancePath}`, async (route) => {
    const request = route.request();
    const body = JSON.parse(request.postData() ?? "{}");
    const url = new URL(request.url());
    const legalStatus = sessionMock.legalStatus ?? 200;

    requestEvents.push("legal-acceptance:request");
    assert.equal(request.method(), "POST");
    assert.equal(url.pathname, legalAcceptancePath);
    assert.equal(request.url().includes(profileSessionToken), false, "legal acceptance URL does not leak token");
    assert.equal(request.url().includes(syntheticInviteCode), false, "legal acceptance URL does not leak invite code");
    assert.equal(request.headers().authorization ?? "", "", "legal acceptance request has no token header");
    assert.deepEqual(body, expectedLegalAcceptanceBody);
    assert.equal(JSON.stringify(body).includes(profileSessionToken), false, "legal acceptance body does not leak token");
    assert.equal(JSON.stringify(body).includes(syntheticInviteCode), false, "legal acceptance body does not leak invite code");
    assert.equal(
      JSON.stringify(body).includes(profileSummary.employeeRegistrationId),
      false,
      "legal acceptance body does not duplicate employee registration id"
    );

    if (sessionMock.legalDelayMs) {
      await delay(sessionMock.legalDelayMs);
    }

    await route.fulfill({
      contentType: "application/json",
      status: legalStatus,
      body: JSON.stringify(sessionMock.legalResponse ?? legalAcceptanceResponse)
    });
    requestEvents.push(`legal-acceptance:response:${legalStatus}`);
  });

  if (sessionMock.sessionStatus === 200) {
    await installDiagnosticMocks(page, sessionMock, profileSessionToken, requestEvents, {
      requireLegalAcceptance: true
    });
    await installLearningProgressMocks(page, sessionMock, profileSessionToken, requestEvents);
  }

  if (sessionMock.summaryStatus !== undefined) {
    await installProfileContactMocks(page, sessionMock, profileSessionToken, requestEvents, {
      requireDiagnosticSubmit: sessionMock.sessionStatus === 200
    });
  }
}

async function installDiagnosticMocks(
  page,
  sessionMock,
  profileSessionToken,
  requestEvents,
  { requireLegalAcceptance = false } = {}
) {
  await page.route(`**${DIAGNOSTIC_ME_DRAFT_PATH}`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    assert.equal(url.pathname, DIAGNOSTIC_ME_DRAFT_PATH);
    assert.equal(request.url().includes(profileSessionToken), false, "diagnostic draft URL does not leak token");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    if (requireLegalAcceptance) {
      assert.equal(
        requestEvents.includes("legal-acceptance:response:200"),
        true,
        "diagnostic draft starts only after successful legal acceptance"
      );
    }

    if (request.method() === "GET") {
      requestEvents.push("diagnostic-draft:get:request");
      await route.fulfill({
        contentType: "application/json",
        status: sessionMock.diagnosticGetStatus ?? 200,
        body: JSON.stringify(sessionMock.diagnosticGetResponse ?? diagnosticAttemptBase)
      });
      requestEvents.push(`diagnostic-draft:get:response:${sessionMock.diagnosticGetStatus ?? 200}`);
      return;
    }

    if (request.method() === "PUT") {
      const body = JSON.parse(request.postData() ?? "{}");
      requestEvents.push("diagnostic-draft:put:request");
      assert.deepEqual(Object.keys(body).sort(), ["q0", "routingAnswers", "selfAssessment"]);
      assert.deepEqual(body, sessionMock.expectedDiagnosticDraftBody ?? expectedDiagnosticDraftBody);
      assert.equal(JSON.stringify(body).includes(profileSessionToken), false, "diagnostic draft body does not leak token");
      assert.equal(JSON.stringify(body).includes(syntheticInviteCode), false, "diagnostic draft body does not leak invite code");
      assert.equal(
        JSON.stringify(body).includes(profileSummary.employeeRegistrationId),
        false,
        "diagnostic draft body does not duplicate employee registration id"
      );

      await route.fulfill({
        contentType: "application/json",
        status: sessionMock.diagnosticPutStatus ?? 200,
        body: JSON.stringify(diagnosticAttemptFromDraftBody(body))
      });
      requestEvents.push(`diagnostic-draft:put:response:${sessionMock.diagnosticPutStatus ?? 200}`);
      return;
    }

    throw new Error(`Unexpected diagnostic draft method: ${request.method()}`);
  });

  await page.route(`**${DIAGNOSTIC_ME_SUBMIT_PATH}`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    requestEvents.push("diagnostic-submit:request");
    assert.equal(request.method(), "POST");
    assert.equal(url.pathname, DIAGNOSTIC_ME_SUBMIT_PATH);
    assert.equal(request.url().includes(profileSessionToken), false, "diagnostic submit URL does not leak token");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    assert.equal(requestEvents.includes("diagnostic-draft:get:response:200"), true, "diagnostic submit starts after GET");
    assert.equal(requestEvents.includes("diagnostic-draft:put:response:200"), true, "diagnostic submit starts after PUT");

    await route.fulfill({
      contentType: "application/json",
      status: sessionMock.diagnosticSubmitStatus ?? 200,
      body: JSON.stringify(sessionMock.diagnosticSubmitResponse ?? diagnosticSubmitResponse)
    });
    requestEvents.push(`diagnostic-submit:response:${sessionMock.diagnosticSubmitStatus ?? 200}`);
  });
}

async function installLearningProgressMocks(page, sessionMock, profileSessionToken, requestEvents) {
  await page.route(`**${n1LessonStartPath}`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const learningStatus = sessionMock.learningStartStatus ?? 200;
    const postData = request.postData();

    requestEvents.push("learning-start:request");
    assert.equal(request.method(), "POST");
    assert.equal(url.pathname, n1LessonStartPath);
    assert.equal(request.url().includes(profileSessionToken), false, "N1 start URL does not leak token");
    assert.equal(request.url().includes(syntheticInviteCode), false, "N1 start URL does not leak invite code");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    assert.equal(postData === null || postData === "", true, "N1 start request has no body");
    assert.equal(
      requestEvents.includes("diagnostic-submit:response:200"),
      true,
      "N1 start happens only after diagnostic submit handoff"
    );

    await route.fulfill({
      contentType: "application/json",
      status: learningStatus,
      body: JSON.stringify(sessionMock.learningStartResponse ?? n1LessonProgressResponse)
    });
    requestEvents.push(`learning-start:response:${learningStatus}`);
  });
}

async function installProfileContactMocks(
  page,
  profileMock,
  profileSessionToken,
  requestEvents,
  { requireDiagnosticSubmit = false } = {}
) {
  await page.route("**/api/v1/employee-registrations/me/profile-summary", async (route) => {
    const request = route.request();
    requestEvents.push("contact-summary:request");
    assert.equal(request.method(), "GET");
    assert.equal(request.url().includes(profileSessionToken), false, "summary request does not leak token in URL");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    if (requireDiagnosticSubmit) {
      assert.equal(
        requestEvents.includes("diagnostic-submit:response:200"),
        true,
        "summary request starts only after diagnostic submit"
      );
    }

    await route.fulfill({
      contentType: "application/json",
      status: profileMock.summaryStatus,
      body: JSON.stringify(profileMock.summaryResponse ?? profileSummary)
    });
    requestEvents.push(`contact-summary:response:${profileMock.summaryStatus}`);
  });

  if (profileMock.contactStatus === undefined) {
    return;
  }

  await page.route("**/api/v1/employee-registrations/me/contact", async (route) => {
    const request = route.request();
    requestEvents.push("contact-update:request");
    assert.equal(request.method(), "PATCH");
    assert.equal(request.url().includes(profileSessionToken), false, "contact request does not leak token in URL");
    assert.equal(request.headers().authorization, `Bearer ${profileSessionToken}`);
    assert.deepEqual(JSON.parse(request.postData() ?? "{}"), profileMock.expectedPatchBody);

    await route.fulfill({
      contentType: "application/json",
      status: profileMock.contactStatus,
      body: JSON.stringify(profileMock.contactResponse)
    });
    requestEvents.push(`contact-update:response:${profileMock.contactStatus}`);
  });
}

async function assertLoadedProfileFields(page) {
  assert.equal(await page.getByLabel("Email").inputValue(), profileSummary.email);
  assert.equal(await page.getByLabel("Телефон").inputValue(), profileSummary.phone);
}

function assertProfileSessionBeforeLegalStep(requestEvents) {
  assert.deepEqual(requestEvents, ["profile-session:request", "profile-session:response:200"]);
}

function assertProfileSessionBeforeLegalAcceptance(requestEvents) {
  const profileResponseIndex = requestEvents.indexOf("profile-session:response:200");
  const legalRequestIndex = requestEvents.indexOf("legal-acceptance:request");

  assert.notEqual(profileResponseIndex, -1, "profile session response exists");
  assert.notEqual(legalRequestIndex, -1, "legal acceptance request exists");
  assert.equal(profileResponseIndex < legalRequestIndex, true, "legal acceptance starts after profile session");
}

function assertLegalAcceptanceBeforeContactSummary(requestEvents) {
  assertProfileSessionBeforeLegalAcceptance(requestEvents);

  const legalResponseIndex = requestEvents.indexOf("legal-acceptance:response:200");
  const summaryRequestIndex = requestEvents.indexOf("contact-summary:request");

  assert.notEqual(legalResponseIndex, -1, "legal acceptance response exists");
  assert.notEqual(summaryRequestIndex, -1, "contact summary request exists");
  assert.equal(legalResponseIndex < summaryRequestIndex, true, "contact summary starts after legal acceptance");
}

function assertLegalAcceptanceBeforeDiagnosticDraft(requestEvents) {
  assertProfileSessionBeforeLegalAcceptance(requestEvents);

  const legalResponseIndex = requestEvents.indexOf("legal-acceptance:response:200");
  const diagnosticGetIndex = requestEvents.indexOf("diagnostic-draft:get:request");

  assert.notEqual(legalResponseIndex, -1, "legal acceptance response exists");
  assert.notEqual(diagnosticGetIndex, -1, "diagnostic draft GET request exists");
  assert.equal(legalResponseIndex < diagnosticGetIndex, true, "diagnostic draft starts after legal acceptance");
}

function assertProfileSessionLegalAndDiagnosticSubmitOrder(requestEvents) {
  assertLegalAcceptanceBeforeDiagnosticDraft(requestEvents);

  const diagnosticGetResponseIndex = requestEvents.indexOf("diagnostic-draft:get:response:200");
  const diagnosticPutRequestIndex = requestEvents.indexOf("diagnostic-draft:put:request");
  const diagnosticPutResponseIndex = requestEvents.indexOf("diagnostic-draft:put:response:200");
  const diagnosticSubmitRequestIndex = requestEvents.indexOf("diagnostic-submit:request");
  const diagnosticSubmitResponseIndex = requestEvents.indexOf("diagnostic-submit:response:200");

  assert.notEqual(diagnosticGetResponseIndex, -1, "diagnostic draft GET response exists");
  assert.notEqual(diagnosticPutRequestIndex, -1, "diagnostic draft PUT request exists");
  assert.notEqual(diagnosticPutResponseIndex, -1, "diagnostic draft PUT response exists");
  assert.notEqual(diagnosticSubmitRequestIndex, -1, "diagnostic submit request exists");
  assert.notEqual(diagnosticSubmitResponseIndex, -1, "diagnostic submit response exists");
  assert.equal(diagnosticGetResponseIndex < diagnosticPutRequestIndex, true, "diagnostic PUT starts after GET");
  assert.equal(diagnosticPutResponseIndex < diagnosticSubmitRequestIndex, true, "diagnostic submit starts after PUT");
}

function assertProfileSessionLegalDiagnosticAndLearningStartOrder(requestEvents) {
  assertProfileSessionLegalAndDiagnosticSubmitOrder(requestEvents);

  const diagnosticSubmitResponseIndex = requestEvents.indexOf("diagnostic-submit:response:200");
  const learningStartRequestIndex = requestEvents.indexOf("learning-start:request");
  const learningStartResponseIndex = requestEvents.indexOf("learning-start:response:200");

  assert.notEqual(learningStartRequestIndex, -1, "N1 learning start request exists");
  assert.notEqual(learningStartResponseIndex, -1, "N1 learning start response exists");
  assert.equal(
    diagnosticSubmitResponseIndex < learningStartRequestIndex,
    true,
    "N1 learning start happens after diagnostic submit response"
  );
}

function diagnosticAttemptFromDraftBody(body) {
  return {
    ...diagnosticAttemptBase,
    q0: {
      id: "Q0",
      selectedOptionIds: body.q0?.selectedOptionIds ?? []
    },
    selfAssessment: body.selfAssessment ?? [],
    routingAnswers: body.routingAnswers ?? [],
    updatedAt: "2026-05-14T09:12:00Z"
  };
}

function joinText(...parts) {
  return parts.join("");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
