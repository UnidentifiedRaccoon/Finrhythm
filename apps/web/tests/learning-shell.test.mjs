import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION,
  LEGAL_DOCUMENT_TYPES,
  startLearningMeLesson
} from "@finrhythm/api-client";
import { EmployeeHomeScreen } from "../components/employee-home-screen.ts";
import {
  buildDiagnosticApiDraftUpdateRequest,
  buildSafeN1LessonProgress,
  buildSafeDiagnosticHandoff,
  DiagnosticApiFlowScreen,
  diagnosticApiQ0Options,
  diagnosticApiRoutingQuestions,
  diagnosticApiSelfAssessmentItems,
  isDiagnosticApiDraftComplete
} from "../components/diagnostic-api-flow-screen.ts";
import {
  buildDiagnosticPreviewProgress,
  DiagnosticPreviewScreen,
  diagnosticPreviewPhases,
  diagnosticPreviewQuestions,
  diagnosticQ0Options,
  diagnosticSelfAssessmentItems
} from "../components/diagnostic-preview-screen.ts";
import { employeeBottomNavItems, EmployeeBottomNav } from "../components/employee-app-shell.ts";
import {
  ChallengesPlaceholderScreen,
  RewardsPlaceholderScreen,
  SupportPlaceholderScreen
} from "../components/employee-placeholder-screen.ts";
import { LessonRendererScreen } from "../components/lesson-renderer.ts";
import { getLessonRendererState } from "../lib/lesson-state.ts";
import { EmployeeStartScreen } from "../components/employee-start-screen.ts";
import { LearningShellScreen } from "../components/learning-shell.ts";
import { OnboardingPrivacyScreen } from "../components/onboarding-privacy-screen.ts";
import { ProfileContactScreen } from "../components/profile-contact-screen.ts";
import {
  acceptedAllCurrentDraftLegalDocuments,
  buildProfileSessionLegalAcceptanceRequest,
  ProfileSessionEntryScreen,
  PROFILE_SESSION_LEGAL_ACCEPTANCE_SOURCE
} from "../components/profile-session-entry-screen.ts";
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
import {
  buildChangedContactRequest,
  buildSafeValidationFeedback,
  classifyApiClientError
} from "../lib/profile-contact-state.ts";
import {
  buildEmployeeProfileSessionRequest,
  buildInvalidProfileSessionFeedback,
  buildProfileSessionValidationFeedback
} from "../lib/profile-session-state.ts";

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
    assert.match(html, /href="\/diagnostics"/);
    assert.match(html, /Открыть диагностику/);
    assert.match(html, /href="\/learning\/lessons\/N2"/);
    assert.match(html, /Открыть N2/);
    assert.match(html, /href="\/learning\/lessons\/N3"/);
    assert.match(html, /Открыть N3/);
    assert.match(html, /href="\/onboarding\/privacy"/);
    assert.match(html, /Подробнее о приватности/);
    assert.match(html, /href="\/profile\/session"/);
    assert.match(html, /Пример: офис/);
    assert.match(html, /Пример: сменный график/);
    assert.match(html, /href="\/learning\/lessons\/N1"/);
  });

  it("defines a five-item employee bottom nav with reachable core sections", () => {
    const html = renderToStaticMarkup(h(EmployeeBottomNav, { active: "home" }));

    assert.equal(employeeBottomNavItems.length, 5);
    assert.deepEqual(
      employeeBottomNavItems.map((item) => item.label),
      ["Главная", "Обучение", "Челлендж", "Награды", "Профиль"]
    );
    assert.deepEqual(
      employeeBottomNavItems.map((item) => item.href),
      ["/", "/learning", "/challenges", "/rewards", "/profile/session"]
    );
    assert.match(html, /aria-current="page"/);
    assert.doesNotMatch(html, /aria-disabled/);
    assert.equal((html.match(/<a /g) ?? []).length, 5);
    assert.equal((html.match(/Поддержка/g) ?? []).length, 0);
  });

  it("renders the employee home hub with support as secondary IA", () => {
    const html = renderToStaticMarkup(EmployeeHomeScreen());

    assert.match(html, /Ваш спокойный маршрут/);
    assert.match(html, /href="\/diagnostics"/);
    assert.match(html, /Открыть preview/);
    assert.match(html, /href="\/learning"/);
    assert.match(html, /Открыть обучение/);
    assert.match(html, /href="\/profile\/session"/);
    assert.match(html, /Открыть профиль/);
    assert.match(html, /href="\/challenges"/);
    assert.match(html, /href="\/rewards"/);
    assert.match(html, /Помощь по доступу и навигации/);
    assert.match(html, /href="\/support"/);
    assert.equal((html.match(/Основные разделы приложения/g) ?? []).length, 1);
  });

  it("renders honest placeholder routes for challenges, rewards and support", () => {
    const challenges = renderToStaticMarkup(ChallengesPlaceholderScreen());
    const rewards = renderToStaticMarkup(RewardsPlaceholderScreen());
    const support = renderToStaticMarkup(SupportPlaceholderScreen());

    assert.match(challenges, /Челлендж пока в подготовке/);
    assert.match(challenges, /навигационная заглушка/);
    assert.match(challenges, /Нельзя присоединиться к активности/);
    assert.doesNotMatch(
      challenges,
      new RegExp(
        `<form|type="submit"|${joinText("Получить", " ", "ба", "ллы")}|${joinText("зачис", "лено")}|${joinText("чек", "-", "ин")}`,
        "i"
      )
    );

    assert.match(rewards, /Награды появятся позже/);
    assert.match(rewards, /место раздела в навигации/);
    assert.match(rewards, /не обещает получение награды/);
    assert.doesNotMatch(
      rewards,
      new RegExp(
        `<form|type="submit"|${joinText("кош", "ел[её]к")}|${joinText("ру", "бл")}|${joinText("ден", "ежн")}|${joinText("вы", "куп")}|${joinText("за", "каз")}`,
        "i"
      )
    );

    assert.match(support, /Помощь по приложению/);
    assert.match(support, /доступом, маршрутом обучения, профилем и навигацией/);
    assert.match(support, /не даются личные финансовые, юридические, налоговые, кредитные или инвестиционные рекомендации/);
    assert.doesNotMatch(
      support,
      new RegExp(`<form|type="submit"|${joinText("тик", "ет")}|${joinText("S", "LA")}|${joinText("отправить", " ", "заявку")}`, "i")
    );
  });

  it("renders diagnostic preview with Q0 privacy before any SA or routing-preview question", () => {
    const html = renderToStaticMarkup(h(DiagnosticPreviewScreen));

    assert.match(html, /Спокойный вход в preview/);
    assert.match(html, /Q0 сначала: кто что видит/);
    assert.match(html, /Личные ответы, слабые зоны, точные суммы и детали рефлексии/);
    assert.match(html, /Что важно знать перед стартом/);
    assert.match(html, /Продолжить к самооценке/);
    assert.doesNotMatch(html, /SA1/);
    assert.doesNotMatch(html, /SA2/);
    assert.doesNotMatch(html, /SA3/);
    assert.doesNotMatch(html, /Q1 ·/);
    assert.doesNotMatch(html, /Q2 ·/);
    assert.doesNotMatch(html, /Q3 ·/);
    assert.doesNotMatch(html, /Черновой preview: начните с N1/);
  });

  it("defines the diagnostic preview sequence without full routing, scoring or final route assignment", () => {
    assert.deepEqual(diagnosticPreviewPhases, ["q0", "self_assessment", "preview_questions", "route_preview"]);
    assert.equal(diagnosticQ0Options.includes("кто увидит мои ответы"), true);
    assert.deepEqual(
      diagnosticSelfAssessmentItems.map((item) => item.id),
      ["SA1", "SA2", "SA3"]
    );
    assert.deepEqual(
      diagnosticPreviewQuestions.map((question) => question.id),
      ["Q1", "Q2", "Q3"]
    );
    assert.equal(diagnosticPreviewQuestions.length, 3);

    const questionText = JSON.stringify(diagnosticPreviewQuestions);
    for (const token of ["Q4", "Q7", "Q27", "Q28", "R1", "R2", "R3", "R4", "R5", "R6"]) {
      assert.equal(questionText.includes(token), false, `diagnostic preview includes forbidden full-routing token: ${token}`);
    }

    assert.deepEqual(buildDiagnosticPreviewProgress("q0"), {
      current: 1,
      total: 4,
      label: "Приватность до вопросов",
      percent: 25
    });
    assert.equal(buildDiagnosticPreviewProgress("route_preview").percent, 100);
  });

  it("keeps diagnostic preview state memory-only and outside backend/API/generated-client scope", async () => {
    const pageSource = await readFile(join(appRoot, "app", "diagnostics", "page.tsx"), "utf8");
    const componentSource = await readFile(join(appRoot, "components", "diagnostic-preview-screen.ts"), "utf8");
    const source = `${pageSource}\n${componentSource}`;

    assert.match(pageSource, /DiagnosticPreviewScreen/);
    assert.match(componentSource, /useState/);
    assert.match(componentSource, /diagnosticPreviewPhases/);
    assert.match(componentSource, /diagnosticSelfAssessmentItems/);
    assert.match(componentSource, /diagnosticPreviewQuestions/);
    assert.doesNotMatch(source, /@finrhythm\/api-client|fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    assert.doesNotMatch(source, /useSearchParams|searchParams|window\.location|location\.hash|history\.replaceState/);
    assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore/);
    assert.doesNotMatch(source, /Q27|Q28|R1\.|R2\.|R3\.|R4\.|R5\.|R6\./);
    assert.doesNotMatch(
      source,
      new RegExp(
        `${joinText("точный", " ", "доход")}|${joinText("точный", " ", "долг")}|${joinText("номер", " ", "сч[её]та")}|${joinText("банк", "овский", " ", "скриншот")}|${joinText("загрузите", " ", "фото")}|${joinText("приложите", " ", "документ")}`,
        "i"
      )
    );
    assert.doesNotMatch(
      source,
      new RegExp(
        `${joinText("персональный", " ", "финансовый", " ", "совет")}|${joinText("инвестиционная", " ", "рекомендация")}|${joinText("налоговая", " ", "рекомендация")}|${joinText("кредитная", " ", "рекомендация")}`,
        "i"
      )
    );
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
    assert.match(html, /Перед будущей диагностикой можно открыть профиль по коду приглашения/);
    assert.match(html, /Короткая профильная сессия нужна только для контактных данных/);
    assert.match(html, /href="\/profile\/session"/);
    assert.match(html, /Открыть вход в профиль/);
    assert.match(html, /href="\/learning"/);
    assert.match(html, /Посмотреть демо-обучение/);
    assert.doesNotMatch(html, /href="\/diagnostics"/);
    assert.doesNotMatch(html, /type="checkbox"/);
    assert.equal(html.includes(joinText("финально", " ", "утвержд")), false);
  });

  it("renders the employee start screen with privacy-first profile order", () => {
    const html = renderToStaticMarkup(EmployeeStartScreen());

    assert.match(html, /Начните с приватности/);
    assert.match(html, /Секрет сессии не идёт через адрес/);
    assert.match(html, /На этом экране нет полей и нет создания сессии/);
    assert.match(html, /Безопасный порядок/);
    assert.match(html, /Сначала граница приватности/);
    assert.match(html, /Затем временная профильная сессия/);
    assert.match(html, /Контакты только после сессии/);
    assert.match(html, /Контактные данные появятся только после временной профильной сессии/);
    assert.match(html, /href="\/onboarding\/privacy"/);
    assert.match(html, /Перейти к приватности/);
    assert.match(html, /href="\/profile\/session"/);
    assert.match(html, /Уже прочитали про приватность: продолжить вход в профиль/);
    assert.doesNotMatch(html, /href="\/profile\/contact"/);
    assert.doesNotMatch(html, /<input/);
    assert.doesNotMatch(html, /name="inviteCode"/);
    assert.doesNotMatch(html, /name="email"/);
    assert.doesNotMatch(html, /name="phone"/);
  });

  it("keeps the employee start route as a no-API privacy-first entry", async () => {
    const pageSource = await readFile(join(appRoot, "app", "start", "page.tsx"), "utf8");
    const componentSource = await readFile(join(appRoot, "components", "employee-start-screen.ts"), "utf8");
    const source = `${pageSource}\n${componentSource}`;

    assert.match(pageSource, /EmployeeStartScreen/);
    assert.match(componentSource, /href: "\/onboarding\/privacy"/);
    assert.match(componentSource, /className: "primary-action"/);
    assert.match(componentSource, /href: "\/profile\/session"/);
    assert.match(componentSource, /className: "secondary-action"/);
    assert.doesNotMatch(source, /\/profile\/contact/);
    assert.doesNotMatch(source, /@finrhythm\/api-client|fetchEmployee|fetch\(/);
    assert.doesNotMatch(source, /useState|useEffect|useSearchParams|searchParams/);
    assert.doesNotMatch(source, /<input|name: "inviteCode"|name: "email"|name: "phone"/);
    assert.equal(source.includes(joinText("profile", "Session", "Token")), false);
    assert.doesNotMatch(
      source,
      new RegExp(`${joinText("local", "Storage")}|${joinText("session", "Storage")}|indexedDB`)
    );
    assert.doesNotMatch(source, new RegExp(`${joinText("document", "\\.", "cookie")}|${joinText("cookie", "Store")}`));
  });

  it("renders the employee profile/contact start limitation without persisting a token", () => {
    const html = renderToStaticMarkup(h(ProfileContactScreen));

    assert.match(html, /Контакты для связи/);
    assert.match(html, /Нужна профильная сессия/);
    assert.match(html, /Откройте вход в профиль/);
    assert.match(html, /Короткая сессия останется только в памяти/);
    assert.match(html, /href="\/profile\/session"/);
    assert.match(html, /Личные ответы диагностики/);
    assert.match(html, /слабые зоны/);
    assert.match(html, /точные суммы/);
    assert.match(html, /детали рефлексии/);
    assert.doesNotMatch(html, /name="fullName"/);
    assert.doesNotMatch(html, /password/i);
  });

  it("renders the employee profile session entry flow with privacy copy", () => {
    const html = renderToStaticMarkup(h(ProfileSessionEntryScreen));

    assert.match(html, /Подтвердите контактный профиль/);
    assert.match(html, /Код приглашения/);
    assert.match(html, /Имя и фамилия/);
    assert.match(html, /Email/);
    assert.match(html, /Телефон/);
    assert.match(html, /Граница приватности видна до входа/);
    assert.match(html, /Личные ответы диагностики/);
    assert.match(html, /слабые зоны/);
    assert.match(html, /точные суммы/);
    assert.match(html, /детали рефлексии/);
    assert.match(html, /href="\/profile\/session"/);
    assert.doesNotMatch(html, /password/i);
  });

  it("renders the diagnostic API flow as a mounted memory-token loading step", () => {
    const profileSessionToken = "memory-only-profile-session-token";
    const html = renderToStaticMarkup(h(DiagnosticApiFlowScreen, { profileSessionToken }));

    assert.match(html, /Короткая диагностика старта/);
    assert.match(html, /Граница данных сохраняется/);
    assert.match(html, /Открываем диагностику/);
    assert.match(html, /Сначала проверяем текущий черновик через API/);
    assert.doesNotMatch(html, new RegExp(profileSessionToken));
    assert.doesNotMatch(html, /name="inviteCode"/);
    assert.doesNotMatch(html, /name="email"/);
    assert.doesNotMatch(html, /name="phone"/);
  });

  it("builds legal acceptance POST payloads from generated current draft constants", () => {
    const request = buildProfileSessionLegalAcceptanceRequest();

    assert.equal(request.source, PROFILE_SESSION_LEGAL_ACCEPTANCE_SOURCE);
    assert.equal(request.source, "web_profile_session");
    assert.deepEqual(
      request.documents,
      LEGAL_DOCUMENT_TYPES.map((documentType) => ({
        documentType,
        documentVersion: LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION
      }))
    );

    const acceptedResponse = {
      employeeRegistrationId: "10000000-0000-4000-8000-000000000001",
      tenantId: "20000000-0000-4000-8000-000000000001",
      pilotLaunchId: "30000000-0000-4000-8000-000000000001",
      accessPoolId: "40000000-0000-4000-8000-000000000001",
      acceptedDocuments: request.documents.map((document) => ({
        ...document,
        acceptedAt: "2026-05-13T09:00:00Z",
        source: PROFILE_SESSION_LEGAL_ACCEPTANCE_SOURCE
      })),
      createdCount: request.documents.length,
      idempotentRetry: false
    };

    assert.equal(acceptedAllCurrentDraftLegalDocuments(acceptedResponse), true);
    assert.equal(
      acceptedAllCurrentDraftLegalDocuments({
        ...acceptedResponse,
        acceptedDocuments: acceptedResponse.acceptedDocuments.slice(1)
      }),
      false
    );
  });

  it("builds diagnostic API draft payloads with separated Q0, SA and routing sections", () => {
    const completeDraft = {
      q0SelectedOptionIds: ["WHO_SEES_ANSWERS", "READY_TO_START"],
      selfAssessment: {
        SA1: 3,
        SA2: 4,
        SA3: 5
      },
      routingAnswers: {
        Q1: "B",
        Q2: "E",
        Q3: "A"
      }
    };

    assert.deepEqual(
      diagnosticApiQ0Options.map((option) => option.id),
      ["WHO_SEES_ANSWERS", "TRAINING_TIME", "ASSIGNMENTS_REQUIRED", "POINTS_ACCRUAL", "READY_TO_START"]
    );
    assert.deepEqual(
      diagnosticApiSelfAssessmentItems.map((item) => item.id),
      ["SA1", "SA2", "SA3"]
    );
    assert.deepEqual(
      diagnosticApiRoutingQuestions.map((question) => [question.id, question.options.map((option) => option.id)]),
      [
        ["Q1", ["A", "B", "C", "D"]],
        ["Q2", ["A", "B", "C", "D", "E"]],
        ["Q3", ["A", "B", "C", "D"]]
      ]
    );
    assert.equal(isDiagnosticApiDraftComplete(completeDraft), true);
    assert.deepEqual(buildDiagnosticApiDraftUpdateRequest(completeDraft), {
      q0: {
        selectedOptionIds: ["WHO_SEES_ANSWERS", "READY_TO_START"]
      },
      selfAssessment: [
        { id: "SA1", value: 3 },
        { id: "SA2", value: 4 },
        { id: "SA3", value: 5 }
      ],
      routingAnswers: [
        { id: "Q1", optionId: "B" },
        { id: "Q2", optionId: "E" },
        { id: "Q3", optionId: "A" }
      ]
    });

    assert.equal(
      isDiagnosticApiDraftComplete({
        ...completeDraft,
        q0SelectedOptionIds: []
      }),
      false
    );
  });

  it("accepts only the safe N1 diagnostic handoff fields", () => {
    const response = {
      state: "SUBMITTED",
      routePreview: true,
      recommendedFirstLessonId: "N1",
      createdAt: "2026-05-14T09:00:00Z",
      updatedAt: "2026-05-14T09:01:00Z",
      submittedAt: "2026-05-14T09:02:00Z"
    };

    assert.deepEqual(buildSafeDiagnosticHandoff(response), {
      state: "SUBMITTED",
      routePreview: true,
      recommendedFirstLessonId: "N1",
      createdAt: "2026-05-14T09:00:00Z",
      updatedAt: "2026-05-14T09:01:00Z",
      submittedAt: "2026-05-14T09:02:00Z"
    });
    assert.equal(buildSafeDiagnosticHandoff({ ...response, recommendedFirstLessonId: "N2" }), null);
    assert.equal(buildSafeDiagnosticHandoff({ ...response, routePreview: false }), null);
  });

  it("accepts only safe N1 backend progress before rendering the lesson continuation", () => {
    assert.equal(typeof startLearningMeLesson, "function");

    const response = {
      lessonId: "N1",
      status: "STARTED",
      startedAt: "2026-05-14T09:03:00Z",
      lastOpenedAt: "2026-05-14T09:04:00Z",
      idempotentResume: false
    };

    assert.deepEqual(buildSafeN1LessonProgress(response), response);
    assert.equal(buildSafeN1LessonProgress({ ...response, lessonId: "N2" }), null);
    assert.equal(buildSafeN1LessonProgress({ ...response, status: "COMPLETED" }), null);
  });

  it("builds profile-session POST payloads through generated request types without echoing invalid proof", () => {
    const syntheticInviteCode = joinText("INVITE", "-", "LOCAL", "-", "001");
    const request = buildEmployeeProfileSessionRequest({
      inviteCode: ` ${syntheticInviteCode} `,
      fullName: " Синтетический Участник ",
      email: " synthetic.profile@example.test ",
      phone: " +70000000000 "
    });

    assert.deepEqual(request, {
      inviteCode: syntheticInviteCode,
      fullName: "Синтетический Участник",
      email: "synthetic.profile@example.test",
      phone: "+70000000000"
    });

    const missing = buildProfileSessionValidationFeedback({
      inviteCode: "",
      fullName: "",
      email: "synthetic.profile@example.test",
      phone: ""
    });
    assert.match(missing?.message, /Мы не показываем введённые значения/);
    assert.equal(missing?.fieldHints.inviteCode, "Введите код приглашения.");
    assert.equal(missing?.fieldHints.fullName, "Введите имя так, как оно указано при регистрации.");
    assert.equal(missing?.fieldHints.phone, "Введите телефон.");
    assert.equal(missing?.fieldHints.email, undefined);

    const invalid = buildInvalidProfileSessionFeedback();
    assert.match(invalid.message, /Не удалось подтвердить профиль/);
    assert.equal(JSON.stringify(invalid).includes(syntheticInviteCode), false);
    assert.doesNotMatch(JSON.stringify(invalid), /synthetic\.profile/);
  });

  it("builds contact update payloads only from changed email and phone fields", () => {
    const request = buildChangedContactRequest(
      { email: "employee@example.test", phone: "+70000000000" },
      { email: "EMPLOYEE@example.test", phone: "+70000000000" }
    );
    assert.deepEqual(request, { email: "EMPLOYEE@example.test" });
    assert.equal(Object.hasOwn(request, "fullName"), false);

    const phoneRequest = buildChangedContactRequest(
      { email: "employee@example.test", phone: "+70000000000" },
      { email: " employee@example.test ", phone: "+7 000 000 00 01" }
    );
    assert.deepEqual(phoneRequest, { phone: "+7 000 000 00 01" });

    const noop = buildChangedContactRequest(
      { email: "employee@example.test", phone: "+70000000000" },
      { email: " employee@example.test ", phone: "+70000000000" }
    );
    assert.equal(noop, null);
  });

  it("keeps profile/contact validation and API failure handling safe", () => {
    assert.equal(classifyApiClientError(new Error("PATCH /api/v1/employee-registrations/me/contact failed with HTTP 400.")), "validation");
    assert.equal(classifyApiClientError(new Error("GET /api/v1/employee-registrations/me/profile-summary failed with HTTP 401.")), "auth");
    assert.equal(classifyApiClientError(new Error("fetch failed")), "network");

    const feedback = buildSafeValidationFeedback({ email: "bad-value@example", phone: "123" });
    assert.match(feedback.message, /Проверьте email и телефон/);
    assert.match(feedback.fieldHints.email, /не показываем введённое значение/);
    assert.match(feedback.fieldHints.phone, /не показываем введённое значение/);
    assert.doesNotMatch(JSON.stringify(feedback), /bad-value/);
    assert.doesNotMatch(JSON.stringify(feedback), /123/);
  });

  it("uses generated profile-session client helpers and avoids unsafe browser token storage", async () => {
    const profileSource = await readFile(join(appRoot, "components", "profile-contact-screen.ts"), "utf8");
    const profileContactPageSource = await readFile(join(appRoot, "app", "profile", "contact", "page.tsx"), "utf8");
    const profileSessionSource = await readFile(join(appRoot, "components", "profile-session-entry-screen.ts"), "utf8");
    const profileStateSource = await readFile(join(appRoot, "lib", "profile-contact-state.ts"), "utf8");
    const profileSessionStateSource = await readFile(join(appRoot, "lib", "profile-session-state.ts"), "utf8");
    const webPackage = JSON.parse(await readFile(join(appRoot, "package.json"), "utf8"));

    assert.equal(webPackage.dependencies["@finrhythm/api-client"], "workspace:*");
    assert.match(profileSessionSource, /fetchEmployeeProfileSession/);
    assert.match(profileSessionSource, /EmployeeProfileSessionResponse/);
    assert.match(profileSessionSource, /fetchLegalDocumentAcceptance/);
    assert.match(profileSessionSource, /LEGAL_DOCUMENT_TYPES/);
    assert.match(profileSessionSource, /LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION/);
    assert.match(profileSessionSource, /LegalDocumentAcceptanceRequest/);
    assert.match(profileSessionSource, /LegalDocumentAcceptanceResponse/);
    assert.match(profileSessionStateSource, /EmployeeProfileSessionRequest/);
    assert.match(profileSource, /fetchEmployeeMeProfileSummary/);
    assert.match(profileSource, /fetchEmployeeMeContactUpdate/);
    assert.match(profileSource, /EmployeeContactUpdateResponse/);
    assert.match(profileStateSource, /EmployeeContactUpdateRequest/);
    assert.match(profileStateSource, /ApiErrorResponse/);
    assert.match(profileSource, /initialProfileSessionToken/);
    assert.match(profileSessionSource, /initialProfileSessionToken/);
    assert.match(profileSessionSource, /DiagnosticApiFlowScreen/);
    assert.match(profileSessionSource, /setPhase\("legal"\)/);
    assert.match(profileSessionSource, /setPhase\("diagnostic"\)/);
    assert.match(profileSessionSource, /setPhase\("contact"\)/);
    assert.equal(profileSessionSource.includes(joinText("/", "legal", "-", "acceptances")), false);
    const profileSessionSuccessBlock = profileSessionSource.slice(
      profileSessionSource.indexOf("const response = await fetchEmployeeProfileSession"),
      profileSessionSource.indexOf("} catch (error: unknown)")
    );
    assert.match(profileSessionSuccessBlock, /setPhase\("legal"\)/);
    assert.doesNotMatch(profileSessionSuccessBlock, /setPhase\("diagnostic"\)/);
    const legalAcceptanceBlock = profileSessionSource.slice(
      profileSessionSource.indexOf("const response = await fetchLegalDocumentAcceptance"),
      profileSessionSource.indexOf("function ProfileSessionHero")
    );
    const legalAcceptanceFetchBlock = profileSessionSource.slice(
      profileSessionSource.indexOf("const response = await fetchLegalDocumentAcceptance"),
      profileSessionSource.indexOf("if (!acceptedAllCurrentDraftLegalDocuments")
    );
    assert.match(legalAcceptanceBlock, /employeeRegistrationId/);
    assert.match(legalAcceptanceBlock, /body: buildProfileSessionLegalAcceptanceRequest\(\)/);
    assert.match(legalAcceptanceBlock, /setPhase\("diagnostic"\)/);
    assert.match(legalAcceptanceBlock, /profileSessionToken/);
    assert.match(legalAcceptanceBlock, /onContinueToContact/);
    assert.match(legalAcceptanceBlock, /ProfileContactScreen/);
    assert.doesNotMatch(legalAcceptanceFetchBlock, /profileSessionToken/);
    assert.match(profileSessionSource, /Не удалось записать принятие документов/);
    assert.match(profileSessionSource, /не показываются код приглашения, сессионный секрет, идентификаторы или контактные поля/);
    const finalLegalApprovalClaims = [
      joinText("финально", " ", "утвержд"),
      joinText("юридическое", " ", "утверждение"),
      joinText("юридически", " ", "утвержд"),
      joinText("final", " ", "legal", " ", "approval")
    ];
    for (const claim of finalLegalApprovalClaims) {
      assert.equal(profileSessionSource.toLowerCase().includes(claim), false);
    }
    assert.equal(
      `${profileSource}\n${profileContactPageSource}\n${profileStateSource}`.includes(joinText("allow", "Query", "Token")),
      false
    );
    assert.equal(
      `${profileSource}\n${profileContactPageSource}\n${profileStateSource}`.includes(
        joinText("PROFILE_SESSION", "_TOKEN_QUERY", "_PARAM")
      ),
      false
    );
    assert.doesNotMatch(`${profileSource}\n${profileContactPageSource}`, /history\.replaceState/);
    assert.doesNotMatch(
      `${profileSource}\n${profileContactPageSource}`,
      /window\.location\.search|searchParams\.get/
    );
    assert.equal(`${profileSource}\n${profileContactPageSource}`.includes(joinText("profile", "Session", "Token", "=")), false);
    assert.doesNotMatch(
      `${profileSource}\n${profileSessionSource}`,
      new RegExp(`${joinText("set", "Item")}|${joinText("get", "Item")}|${joinText("remove", "Item")}`)
    );
    assert.doesNotMatch(
      `${profileSource}\n${profileSessionSource}`,
      new RegExp(`${joinText("document", "\\.", "cookie")}|${joinText("cookie", "Store")}`)
    );
  });

  it("uses generated diagnostic client helpers and avoids unsafe diagnostic token transport", async () => {
    const profileSessionSource = await readFile(join(appRoot, "components", "profile-session-entry-screen.ts"), "utf8");
    const diagnosticSource = await readFile(join(appRoot, "components", "diagnostic-api-flow-screen.ts"), "utf8");

    assert.match(profileSessionSource, /DiagnosticApiFlowScreen/);
    assert.match(profileSessionSource, /profileSessionToken,/);
    assert.match(profileSessionSource, /onContinueToContact/);
    assert.match(diagnosticSource, /fetchDiagnosticMeDraft/);
    assert.match(diagnosticSource, /saveDiagnosticMeDraft/);
    assert.match(diagnosticSource, /submitDiagnosticMeDraft/);
    assert.match(diagnosticSource, /startLearningMeLesson/);
    assert.match(diagnosticSource, /DiagnosticDraftUpdateRequest/);
    assert.match(diagnosticSource, /DiagnosticAttemptResponse/);
    assert.match(diagnosticSource, /DiagnosticSubmitResponse/);
    assert.match(diagnosticSource, /LessonProgressResponse/);
    assert.match(diagnosticSource, /buildSafeN1LessonProgress/);
    assert.match(diagnosticSource, /syntheticN1LessonFixture/);
    assert.match(diagnosticSource, /LessonRendererScreen/);
    assert.match(diagnosticSource, /q0SelectedOptionIds/);
    assert.match(diagnosticSource, /selfAssessment/);
    assert.match(diagnosticSource, /routingAnswers/);
    assert.match(diagnosticSource, /recommendedFirstLessonId: "N1"/);
    assert.doesNotMatch(
      diagnosticSource,
      /DIAGNOSTIC_ME_DRAFT_PATH|DIAGNOSTIC_ME_SUBMIT_PATH|LEARNING_ME_LESSON_START_PATH_TEMPLATE/
    );
    assert.doesNotMatch(diagnosticSource, /\/api\/v1\/diagnostics|\/api\/v1\/learning/);
    assert.doesNotMatch(diagnosticSource, /XMLHttpRequest|navigator\.sendBeacon|console\./);
    assert.doesNotMatch(diagnosticSource, /useSearchParams|searchParams|window\.location\.search|location\.hash/);
    assert.doesNotMatch(diagnosticSource, /history\.replaceState|history\.pushState/);
    assert.doesNotMatch(
      diagnosticSource,
      new RegExp(`${joinText("local", "Storage")}|${joinText("session", "Storage")}|indexedDB`)
    );
    assert.doesNotMatch(diagnosticSource, new RegExp(`${joinText("document", "\\.", "cookie")}|${joinText("cookie", "Store")}`));
    assert.doesNotMatch(
      diagnosticSource,
      /attemptId|employeeRegistrationId|tenantId|pilotLaunchId|accessPoolId|allowedAnswerIds/
    );
    assert.doesNotMatch(
      diagnosticSource,
      /Q4|Q27|Q28|R1\.|R2\.|R3\.|R4\.|R5\.|R6\.|COMPLETED|lessonCompleted|quizSubmission|practiceSubmission|pointsLedger|rewardGranted/
    );
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
      joinText("худшие", " ", "сотрудники"),
      joinText("local", "Storage"),
      joinText("session", "Storage"),
      joinText("document", ".", "cookie"),
      joinText("cookie", "Store")
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
      joinText("загрузите", " ", "фото"),
      joinText("приложите", " ", "фото"),
      joinText("укажите", " ", "адрес"),
      joinText("укажите", " ", "ссылку на объявление"),
      joinText("укажите", " ", "сумму сделки"),
      joinText("отправьте", " ", "переписку с покупателем"),
      joinText("загрузите", " ", "скриншот оплаты"),
      joinText("банковский", " ", "скриншот требуется"),
      joinText("точные", " ", "личные суммы обязательны"),
      joinText("обязательный", " ", "мерч"),
      joinText("гарантир", "ованный", " ", "результат"),
      joinText("случайный", " ", "приз")
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
    assert.doesNotMatch(html, new RegExp(joinText("банковский", " ", "скриншот требуется")));
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
    assert.doesNotMatch(html, new RegExp(joinText("загрузите", " ", "фото")));
    assert.doesNotMatch(html, new RegExp(joinText("укажите", " ", "адрес")));
    assert.doesNotMatch(html, new RegExp(joinText("загрузите", " ", "скриншот оплаты")));
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
