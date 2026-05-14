"use client";

import {
  createElement as h,
  Fragment,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  fetchDiagnosticMeDraft,
  startLearningMeLesson,
  saveDiagnosticMeDraft,
  submitDiagnosticMeDraft,
  type DiagnosticAttemptResponse,
  type DiagnosticAttemptState,
  type DiagnosticDraftUpdateRequest,
  type DiagnosticSubmitResponse,
  type LessonProgressResponse
} from "@finrhythm/api-client";
import { EmployeeAppHeader, EmployeeBottomNav, SecondarySupportEntry } from "./employee-app-shell.ts";
import { LessonRendererScreen } from "./lesson-renderer.ts";
import { syntheticN1LessonFixture } from "../lib/learning-fixtures.ts";

type DiagnosticApiPhase = "loading" | "draft" | "saving" | "submitting" | "submitted" | "error";
type DiagnosticNoticeKind = "info" | "validation" | "error" | "success";
type Q0OptionId =
  | "WHO_SEES_ANSWERS"
  | "TRAINING_TIME"
  | "ASSIGNMENTS_REQUIRED"
  | "POINTS_ACCRUAL"
  | "READY_TO_START";
type SelfAssessmentId = "SA1" | "SA2" | "SA3";
type RoutingQuestionId = "Q1" | "Q2" | "Q3";
type RoutingOptionId = "A" | "B" | "C" | "D" | "E";

export type DiagnosticApiDraftState = {
  q0SelectedOptionIds: Q0OptionId[];
  selfAssessment: Partial<Record<SelfAssessmentId, number>>;
  routingAnswers: Partial<Record<RoutingQuestionId, RoutingOptionId>>;
};

export type DiagnosticSafeHandoff = {
  state: DiagnosticAttemptState;
  routePreview: true;
  recommendedFirstLessonId: "N1";
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
};

export type DiagnosticN1LessonProgress = {
  lessonId: "N1";
  status: "STARTED";
  startedAt: string;
  lastOpenedAt: string;
  idempotentResume: boolean;
};

type DiagnosticNotice = {
  kind: DiagnosticNoticeKind;
  title: string;
  body: string;
};

export const diagnosticApiQ0Options: ReadonlyArray<{
  id: Q0OptionId;
  label: string;
  hint: string;
}> = [
  {
    id: "WHO_SEES_ANSWERS",
    label: "Кто увидит мои ответы",
    hint: "Покажем границу: личные ответы не становятся персональным HR-отчётом."
  },
  {
    id: "TRAINING_TIME",
    label: "Сколько времени займёт старт",
    hint: "Короткий вход без ежедневного экзамена."
  },
  {
    id: "ASSIGNMENTS_REQUIRED",
    label: "Будут ли задания обязательными",
    hint: "Фокус на маленьких добровольных шагах."
  },
  {
    id: "POINTS_ACCRUAL",
    label: "Как начисляются баллы",
    hint: "Баллы не являются деньгами и не обещают финансовый результат."
  },
  {
    id: "READY_TO_START",
    label: "Всё понятно, хочу начать",
    hint: "Можно перейти к самооценке и трём стартовым вопросам."
  }
];

export const diagnosticApiSelfAssessmentItems: ReadonlyArray<{
  id: SelfAssessmentId;
  prompt: string;
  meaning: string;
}> = [
  {
    id: "SA1",
    prompt: "Насколько уверенно вы чувствуете себя в бытовых финансовых решениях?",
    meaning: "личная уверенность"
  },
  {
    id: "SA2",
    prompt: "Насколько спокойно вы обычно относитесь к финансовым вопросам?",
    meaning: "личное спокойствие"
  },
  {
    id: "SA3",
    prompt: "Насколько понятно, какой следующий маленький шаг с деньгами сделать в ближайший месяц?",
    meaning: "ясность следующего шага"
  }
];

export const diagnosticApiRoutingQuestions: ReadonlyArray<{
  id: RoutingQuestionId;
  title: string;
  prompt: string;
  options: ReadonlyArray<{ id: RoutingOptionId; label: string }>;
}> = [
  {
    id: "Q1",
    title: "Финансовый резерв",
    prompt: "Что лучше всего описывает финансовый резерв?",
    options: [
      { id: "A", label: "Деньги на спонтанные покупки." },
      { id: "B", label: "Деньги на случай непредвиденной ситуации, которые можно быстро получить." },
      { id: "C", label: "Любые инвестиции с высокой доходностью." },
      { id: "D", label: "Деньги, которые остались перед зарплатой." }
    ]
  },
  {
    id: "Q2",
    title: "Текущая опора",
    prompt: "Есть ли у вас сейчас отдельный резерв?",
    options: [
      { id: "A", label: "Нет." },
      { id: "B", label: "Есть, но меньше одного месяца расходов." },
      { id: "C", label: "Есть примерно на 1-3 месяца." },
      { id: "D", label: "Есть больше 3 месяцев." },
      { id: "E", label: "Не хочу указывать." }
    ]
  },
  {
    id: "Q3",
    title: "Первый барьер",
    prompt: "Что мешает начать резерв?",
    options: [
      { id: "A", label: "Не понимаю, с какой суммы начать." },
      { id: "B", label: "Кажется, что маленькие суммы бессмысленны." },
      { id: "C", label: "Боюсь, что всё равно потрачу." },
      { id: "D", label: "У меня уже есть понятный план." }
    ]
  }
];

const scaleOptions = [
  { value: 1, label: "1", hint: "пока трудно" },
  { value: 2, label: "2", hint: "скорее трудно" },
  { value: 3, label: "3", hint: "нейтрально" },
  { value: 4, label: "4", hint: "скорее спокойно" },
  { value: 5, label: "5", hint: "уверенно" }
] as const;

const emptyDraftState: DiagnosticApiDraftState = {
  q0SelectedOptionIds: [],
  selfAssessment: {},
  routingAnswers: {}
};

export function DiagnosticApiFlowScreen({
  onContinueToContact,
  profileSessionToken
}: {
  onContinueToContact?: () => void;
  profileSessionToken: string;
}) {
  const [phase, setPhase] = useState<DiagnosticApiPhase>("loading");
  const [draft, setDraft] = useState<DiagnosticApiDraftState>(emptyDiagnosticApiDraftState);
  const [notice, setNotice] = useState<DiagnosticNotice | null>(null);
  const [handoff, setHandoff] = useState<DiagnosticSafeHandoff | null>(null);
  const [lessonProgress, setLessonProgress] = useState<DiagnosticN1LessonProgress | null>(null);
  const [lessonStartBusy, setLessonStartBusy] = useState(false);
  const [lessonStartNotice, setLessonStartNotice] = useState<DiagnosticNotice | null>(null);
  const [retryIndex, setRetryIndex] = useState(0);
  const progress = useMemo(() => buildDiagnosticApiProgress(draft, phase), [draft, phase]);
  const isBusy = phase === "saving" || phase === "submitting";
  const isComplete = isDiagnosticApiDraftComplete(draft);

  useEffect(() => {
    let cancelled = false;

    setPhase("loading");
    setDraft(emptyDiagnosticApiDraftState());
    setNotice(null);
    setHandoff(null);
    setLessonProgress(null);
    setLessonStartBusy(false);
    setLessonStartNotice(null);

    fetchDiagnosticMeDraft(getBrowserApiBaseUrl(), { profileSessionToken })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (response.state === "SUBMITTED") {
          const safeHandoff = buildSafeDiagnosticHandoff(response);
          if (!safeHandoff) {
            setPhase("error");
            setNotice(buildDiagnosticFailureNotice("API вернул неподдержанный handoff. Откройте экран позже."));
            return;
          }

          setHandoff(safeHandoff);
          setPhase("submitted");
          return;
        }

        const restoredDraft = diagnosticDraftStateFromAttempt(response);
        setDraft(restoredDraft);
        setNotice(hasDiagnosticDraftContent(restoredDraft) ? buildResumeNotice() : buildEmptyDraftNotice());
        setPhase("draft");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setPhase("error");
        setNotice(buildDiagnosticFailureNotice("Не удалось открыть черновик диагностики. Попробуйте обновить шаг."));
      });

    return () => {
      cancelled = true;
    };
  }, [profileSessionToken, retryIndex]);

  function toggleQ0Option(optionId: Q0OptionId) {
    setDraft((current) => ({
      ...current,
      q0SelectedOptionIds: current.q0SelectedOptionIds.includes(optionId)
        ? current.q0SelectedOptionIds.filter((item) => item !== optionId)
        : [...current.q0SelectedOptionIds, optionId]
    }));
    setNotice(null);
  }

  function chooseSelfAssessment(id: SelfAssessmentId, value: number) {
    setDraft((current) => ({ ...current, selfAssessment: { ...current.selfAssessment, [id]: value } }));
    setNotice(null);
  }

  function chooseRoutingAnswer(id: RoutingQuestionId, optionId: RoutingOptionId) {
    setDraft((current) => ({ ...current, routingAnswers: { ...current.routingAnswers, [id]: optionId } }));
    setNotice(null);
  }

  async function saveDraft() {
    if (isBusy) {
      return;
    }

    setPhase("saving");
    setNotice(null);

    try {
      const response = await saveDiagnosticMeDraft(getBrowserApiBaseUrl(), {
        profileSessionToken,
        body: buildDiagnosticApiDraftUpdateRequest(draft)
      });

      if (response.state === "SUBMITTED") {
        const safeHandoff = buildSafeDiagnosticHandoff(response);
        if (!safeHandoff) {
          throw new Error("Unsupported diagnostic handoff.");
        }

        setHandoff(safeHandoff);
        setPhase("submitted");
        return;
      }

      setDraft(diagnosticDraftStateFromAttempt(response));
      setNotice({
        kind: "success",
        title: "Черновик сохранён",
        body: "Ответы записаны как черновик без показа сессионного секрета, кода приглашения или служебных идентификаторов."
      });
      setPhase("draft");
    } catch (_error: unknown) {
      setNotice(buildDiagnosticFailureNotice("Не удалось сохранить черновик. Проверьте связь и попробуйте ещё раз."));
      setPhase("draft");
    }
  }

  async function submitDraft() {
    if (isBusy) {
      return;
    }

    if (!isComplete) {
      setNotice({
        kind: "validation",
        title: "Заполните короткую диагностику",
        body: "Для отправки нужны Q0, три шкалы SA1-SA3 и ответы Q1-Q3. Значения не показываются в тексте ошибки."
      });
      return;
    }

    setPhase("submitting");
    setNotice(null);

    try {
      await saveDiagnosticMeDraft(getBrowserApiBaseUrl(), {
        profileSessionToken,
        body: buildDiagnosticApiDraftUpdateRequest(draft)
      });

      const response = await submitDiagnosticMeDraft(getBrowserApiBaseUrl(), { profileSessionToken });
      const safeHandoff = buildSafeDiagnosticHandoff(response);
      if (!safeHandoff) {
        throw new Error("Unsupported diagnostic handoff.");
      }

      setHandoff(safeHandoff);
      setPhase("submitted");
      setLessonStartNotice(null);
    } catch (_error: unknown) {
      setNotice(
        buildDiagnosticFailureNotice(
          "Не удалось завершить диагностику. Черновик можно сохранить или отправить ещё раз без повторного ввода секрета."
        )
      );
      setPhase("draft");
    }
  }

  async function startFirstLesson() {
    if (!handoff || lessonStartBusy) {
      return;
    }

    setLessonStartBusy(true);
    setLessonStartNotice(null);

    try {
      const response = await startLearningMeLesson(getBrowserApiBaseUrl(), {
        profileSessionToken,
        lessonId: handoff.recommendedFirstLessonId
      });
      const safeProgress = buildSafeN1LessonProgress(response);
      if (!safeProgress) {
        throw new Error("Unsupported N1 lesson progress response.");
      }

      setLessonProgress(safeProgress);
    } catch (_error: unknown) {
      setLessonStartNotice(
        buildDiagnosticFailureNotice(
          "Не удалось открыть N1 через backend progress. Попробуйте ещё раз, пока эта вкладка открыта."
        )
      );
    } finally {
      setLessonStartBusy(false);
    }
  }

  if (lessonProgress) {
    return h(LessonRendererScreen, {
      lesson: syntheticN1LessonFixture,
      progressBanner: h(N1BackendProgressBanner, { progress: lessonProgress })
    });
  }

  return h(
    "main",
    { className: "learning-page profile-contact-page diagnostic-api-page" },
    h(
      "div",
      { className: "mobile-shell profile-contact-shell diagnostic-api-shell" },
      h(EmployeeAppHeader, { pill: "Диагностика" }),
      h(EmployeeBottomNav, { active: "profile" }),
      h(DiagnosticApiHero),
      h(DiagnosticApiPrivacyCard),
      h(SecondarySupportEntry, { compact: true }),
      phase === "loading"
        ? h(DiagnosticApiStatePanel, {
            busy: true,
            eyebrow: "Черновик",
            title: "Открываем диагностику",
            body: "Сначала проверяем текущий черновик через API. Сессионный секрет остаётся только в памяти этой вкладки.",
            children: h(Fragment, null, h("div", { className: "skeleton-line" }), h("div", { className: "skeleton-line" }))
          })
        : phase === "error"
          ? h(DiagnosticApiErrorPanel, {
              notice,
              onRetry: () => setRetryIndex((current) => current + 1)
            })
          : phase === "submitted" && handoff
            ? h(DiagnosticSubmittedHandoff, {
                handoff,
                lessonStartBusy,
                lessonStartNotice,
                onContinueToContact,
                onStartLesson: startFirstLesson
              })
            : h(DiagnosticDraftPanel, {
                draft,
                isBusy,
                isComplete,
                notice,
                onChooseRoutingAnswer: chooseRoutingAnswer,
                onChooseSelfAssessment: chooseSelfAssessment,
                onSave: saveDraft,
                onSubmit: submitDraft,
                onToggleQ0Option: toggleQ0Option,
                progress
              })
    )
  );
}

export function emptyDiagnosticApiDraftState(): DiagnosticApiDraftState {
  return {
    q0SelectedOptionIds: [],
    selfAssessment: {},
    routingAnswers: {}
  };
}

export function buildDiagnosticApiDraftUpdateRequest(draft: DiagnosticApiDraftState): DiagnosticDraftUpdateRequest {
  return {
    q0: {
      selectedOptionIds: draft.q0SelectedOptionIds
    },
    selfAssessment: diagnosticApiSelfAssessmentItems
      .map((item) => {
        const value = draft.selfAssessment[item.id];
        return typeof value === "number" ? { id: item.id, value } : null;
      })
      .filter((item): item is { id: SelfAssessmentId; value: number } => item !== null),
    routingAnswers: diagnosticApiRoutingQuestions
      .map((question) => {
        const optionId = draft.routingAnswers[question.id];
        return optionId ? { id: question.id, optionId } : null;
      })
      .filter((item): item is { id: RoutingQuestionId; optionId: RoutingOptionId } => item !== null)
  };
}

export function isDiagnosticApiDraftComplete(draft: DiagnosticApiDraftState): boolean {
  return (
    draft.q0SelectedOptionIds.length > 0 &&
    diagnosticApiSelfAssessmentItems.every((item) => typeof draft.selfAssessment[item.id] === "number") &&
    diagnosticApiRoutingQuestions.every((question) => Boolean(draft.routingAnswers[question.id]))
  );
}

export function buildSafeDiagnosticHandoff(
  response: DiagnosticAttemptResponse | DiagnosticSubmitResponse
): DiagnosticSafeHandoff | null {
  if (
    response.state !== "SUBMITTED" ||
    response.routePreview !== true ||
    response.recommendedFirstLessonId !== "N1" ||
    !response.createdAt ||
    !response.updatedAt ||
    !response.submittedAt
  ) {
    return null;
  }

  return {
    state: response.state,
    routePreview: true,
    recommendedFirstLessonId: "N1",
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    submittedAt: response.submittedAt
  };
}

export function buildSafeN1LessonProgress(response: LessonProgressResponse): DiagnosticN1LessonProgress | null {
  if (response.lessonId !== "N1" || response.status !== "STARTED" || !response.startedAt || !response.lastOpenedAt) {
    return null;
  }

  return {
    lessonId: "N1",
    status: "STARTED",
    startedAt: response.startedAt,
    lastOpenedAt: response.lastOpenedAt,
    idempotentResume: response.idempotentResume
  };
}

function DiagnosticApiHero() {
  return h(
    "section",
    { className: "diagnostic-hero", "aria-labelledby": "diagnostic-api-title" },
    h("p", { className: "section-label" }, "После согласий"),
    h("h1", { id: "diagnostic-api-title" }, "Короткая диагностика старта"),
    h(
      "p",
      null,
      "Ответьте на Q0, три шкалы самооценки и первые вопросы про резерв. Это не экзамен и не финальный профиль маршрута."
    )
  );
}

function DiagnosticApiPrivacyCard() {
  return h(
    "section",
    { className: "privacy-card diagnostic-privacy-card", "aria-labelledby": "diagnostic-api-privacy-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
      h("h2", { id: "diagnostic-api-privacy-title" }, "Граница данных сохраняется"),
      h(
        "p",
        null,
        "Личные ответы диагностики не показываются работодателю как персональный отчёт. HR видит только агрегированные данные по группе, если такой отчёт отдельно утверждён."
      )
    )
  );
}

function DiagnosticDraftPanel({
  draft,
  isBusy,
  isComplete,
  notice,
  onChooseRoutingAnswer,
  onChooseSelfAssessment,
  onSave,
  onSubmit,
  onToggleQ0Option,
  progress
}: {
  draft: DiagnosticApiDraftState;
  isBusy: boolean;
  isComplete: boolean;
  notice: DiagnosticNotice | null;
  onChooseRoutingAnswer: (id: RoutingQuestionId, optionId: RoutingOptionId) => void;
  onChooseSelfAssessment: (id: SelfAssessmentId, value: number) => void;
  onSave: () => void;
  onSubmit: () => void;
  onToggleQ0Option: (optionId: Q0OptionId) => void;
  progress: { completed: number; total: number; percent: number };
}) {
  return h(
    Fragment,
    null,
    h(DiagnosticApiProgressCard, { progress }),
    notice ? h(DiagnosticNoticePanel, { notice }) : null,
    h(Q0ApiStep, { draft, disabled: isBusy, onToggle: onToggleQ0Option }),
    h(SelfAssessmentApiStep, { draft, disabled: isBusy, onChoose: onChooseSelfAssessment }),
    h(RoutingQuestionsApiStep, { draft, disabled: isBusy, onChoose: onChooseRoutingAnswer }),
    h(
      "section",
      { className: "diagnostic-panel diagnostic-submit-panel", "aria-labelledby": "diagnostic-api-submit-title" },
      h("p", { className: "section-label" }, "Черновик и отправка"),
      h("h2", { id: "diagnostic-api-submit-title" }, "Сохраните или завершите шаг"),
      h(
        "p",
        null,
        "Сохранение отправляет только Q0, SA1-SA3 и Q1-Q3. Завершение показывает безопасный handoff к N1 без раскрытия ответов."
      ),
      h(
        "div",
        { className: "diagnostic-result-actions" },
        h(
          "button",
          { className: "secondary-action diagnostic-secondary-button", disabled: isBusy, onClick: onSave, type: "button" },
          isBusy ? "Обрабатываем..." : "Сохранить черновик"
        ),
        h(
          "button",
          {
            className: "primary-action diagnostic-action",
            disabled: isBusy || !isComplete,
            onClick: onSubmit,
            type: "button"
          },
          isBusy ? "Отправляем..." : "Завершить диагностику"
        )
      ),
      isComplete
        ? null
        : h("p", { className: "diagnostic-action-hint" }, "Для завершения выберите Q0, SA1-SA3 и ответы Q1-Q3.")
    )
  );
}

function DiagnosticApiProgressCard({ progress }: { progress: { completed: number; total: number; percent: number } }) {
  return h(
    "section",
    { className: "diagnostic-progress-card", "aria-labelledby": "diagnostic-api-progress-title" },
    h(
      "div",
      { className: "progress-copy" },
      h("span", { id: "diagnostic-api-progress-title" }, "API-backed progress"),
      h("strong", null, `${progress.completed} из ${progress.total}`)
    ),
    h(
      "div",
      { className: "diagnostic-progress-track", "aria-hidden": "true" },
      h("span", { style: { width: `${progress.percent}%` } })
    ),
    h(
      "p",
      null,
      "Q0, самооценка и маршрутные ответы хранятся раздельно. На этом шаге нет полного scoring, уровня или HR-отчёта."
    )
  );
}

function Q0ApiStep({
  disabled,
  draft,
  onToggle
}: {
  disabled: boolean;
  draft: DiagnosticApiDraftState;
  onToggle: (optionId: Q0OptionId) => void;
}) {
  return h(
    "section",
    { className: "diagnostic-panel", "aria-labelledby": "diagnostic-api-q0-title" },
    h("p", { className: "section-label" }, "Q0"),
    h("h2", { id: "diagnostic-api-q0-title" }, "Что важно знать перед стартом?"),
    h("p", null, "Можно выбрать несколько пунктов. Этот блок не входит в scoring и хранится как metadata."),
    h(
      "div",
      { className: "choice-grid", "aria-label": "Темы Q0 перед диагностикой" },
      diagnosticApiQ0Options.map((option) =>
        h(
          "button",
          {
            "aria-pressed": draft.q0SelectedOptionIds.includes(option.id),
            className: draft.q0SelectedOptionIds.includes(option.id) ? "choice-card choice-card-selected" : "choice-card",
            disabled,
            key: option.id,
            onClick: () => onToggle(option.id),
            type: "button"
          },
          h("span", null, option.label),
          h("small", null, option.hint)
        )
      )
    )
  );
}

function SelfAssessmentApiStep({
  disabled,
  draft,
  onChoose
}: {
  disabled: boolean;
  draft: DiagnosticApiDraftState;
  onChoose: (id: SelfAssessmentId, value: number) => void;
}) {
  return h(
    "section",
    { className: "diagnostic-panel", "aria-labelledby": "diagnostic-api-sa-title" },
    h("p", { className: "section-label" }, "SA1-SA3"),
    h("h2", { id: "diagnostic-api-sa-title" }, "Самооценка без scoring"),
    h(
      "p",
      null,
      "Эти шкалы нужны для личной рефлексии и агрегированной оценки пользы пилота. Они не назначают уровень."
    ),
    h(
      "div",
      { className: "self-assessment-list" },
      diagnosticApiSelfAssessmentItems.map((item) =>
        h(
          "article",
          { className: "self-assessment-item", key: item.id },
          h("p", { className: "question-code" }, `${item.id} · ${item.meaning}`),
          h("h3", null, item.prompt),
          h(
            "div",
            { className: "scale-grid", "aria-label": item.prompt },
            scaleOptions.map((option) =>
              h(
                "button",
                {
                  "aria-pressed": draft.selfAssessment[item.id] === option.value,
                  className:
                    draft.selfAssessment[item.id] === option.value ? "scale-choice scale-choice-selected" : "scale-choice",
                  disabled,
                  key: option.value,
                  onClick: () => onChoose(item.id, option.value),
                  type: "button"
                },
                h("span", null, option.label),
                h("small", null, option.hint)
              )
            )
          )
        )
      )
    )
  );
}

function RoutingQuestionsApiStep({
  disabled,
  draft,
  onChoose
}: {
  disabled: boolean;
  draft: DiagnosticApiDraftState;
  onChoose: (id: RoutingQuestionId, optionId: RoutingOptionId) => void;
}) {
  return h(
    "section",
    { className: "diagnostic-panel", "aria-labelledby": "diagnostic-api-routing-title" },
    h("p", { className: "section-label" }, "Q1-Q3"),
    h("h2", { id: "diagnostic-api-routing-title" }, "Первые вопросы про резерв"),
    h(
      "p",
      null,
      "Это только стартовый backend scope. Здесь нет расширенного блока, финального уровня, баллов или персонального отчёта."
    ),
    h(
      "div",
      { className: "preview-question-list" },
      diagnosticApiRoutingQuestions.map((question) =>
        h(
          "article",
          { className: "preview-question-item", key: question.id },
          h("p", { className: "question-code" }, `${question.id} · ${question.title}`),
          h("h3", null, question.prompt),
          h(
            "div",
            { className: "choice-grid", "aria-label": question.prompt },
            question.options.map((option) =>
              h(
                "button",
                {
                  "aria-pressed": draft.routingAnswers[question.id] === option.id,
                  className:
                    draft.routingAnswers[question.id] === option.id ? "choice-card choice-card-selected" : "choice-card",
                  disabled,
                  key: `${question.id}-${option.id}`,
                  onClick: () => onChoose(question.id, option.id),
                  type: "button"
                },
                option.label
              )
            )
          )
        )
      )
    )
  );
}

function DiagnosticSubmittedHandoff({
  handoff,
  lessonStartBusy,
  lessonStartNotice,
  onContinueToContact,
  onStartLesson
}: {
  handoff: DiagnosticSafeHandoff;
  lessonStartBusy: boolean;
  lessonStartNotice: DiagnosticNotice | null;
  onContinueToContact?: () => void;
  onStartLesson: () => void;
}) {
  return h(
    "section",
    { className: "diagnostic-result-card", "aria-labelledby": "diagnostic-api-result-title" },
    h("p", { className: "section-label" }, "Безопасный handoff"),
    h("h2", { id: "diagnostic-api-result-title" }, "Диагностика записана: начните с N1"),
    h(
      "p",
      null,
      "API вернул только routePreview для первого урока. Перед открытием N1 мы отдельно запишем start/resume progress на backend без передачи сессионного секрета через адрес."
    ),
    lessonStartNotice ? h(DiagnosticNoticePanel, { notice: lessonStartNotice }) : null,
    h(
      "dl",
      { className: "diagnostic-handoff-list", "aria-label": "Безопасные поля handoff" },
      h("div", null, h("dt", null, "Состояние"), h("dd", null, handoff.state)),
      h("div", null, h("dt", null, "Route preview"), h("dd", null, handoff.routePreview ? "включён" : "выключен")),
      h("div", null, h("dt", null, "Первый урок"), h("dd", null, handoff.recommendedFirstLessonId)),
      h("div", null, h("dt", null, "Создано"), h("dd", null, formatDiagnosticTimestamp(handoff.createdAt))),
      h("div", null, h("dt", null, "Обновлено"), h("dd", null, formatDiagnosticTimestamp(handoff.updatedAt))),
      h("div", null, h("dt", null, "Отправлено"), h("dd", null, formatDiagnosticTimestamp(handoff.submittedAt)))
    ),
    h(
      "ul",
      { className: "diagnostic-boundary-list" },
      h("li", null, "Финальный scoring, уровень и полный маршрут не назначаются в этом sprint."),
      h("li", null, "Личные ответы не показываются в handoff."),
      h("li", null, "Backend фиксирует только старт или возврат к N1, без завершения, теста, практики, баллов или наград."),
      h("li", null, "Переход к N1 не является финансовым, налоговым, кредитным или инвестиционным советом.")
    ),
    h(
      "div",
      { className: "diagnostic-result-actions" },
      h(
        "button",
        { className: "primary-action", disabled: lessonStartBusy, onClick: onStartLesson, type: "button" },
        lessonStartBusy ? "Открываем N1..." : "Начать или продолжить N1"
      ),
      onContinueToContact
        ? h(
            "button",
            { className: "secondary-action diagnostic-secondary-button", onClick: onContinueToContact, type: "button" },
            "Перейти к контактам"
          )
        : null
    )
  );
}

function N1BackendProgressBanner({ progress }: { progress: DiagnosticN1LessonProgress }) {
  return h(
    "section",
    { className: "lesson-progress-card", "aria-labelledby": "n1-backend-progress-title" },
    h(
      "div",
      null,
      h("p", { className: "section-label" }, "Backend progress"),
      h("h2", { id: "n1-backend-progress-title" }, progress.idempotentResume ? "N1 продолжен" : "N1 начат"),
      h(
        "p",
        null,
        "Записан только старт или возврат к уроку. Прохождение блоков, мини-тест, практика, баллы и награды в этом sprint не фиксируются."
      )
    ),
    h(
      "dl",
      { className: "diagnostic-handoff-list", "aria-label": "Поля прогресса N1" },
      h("div", null, h("dt", null, "Урок"), h("dd", null, progress.lessonId)),
      h("div", null, h("dt", null, "Статус"), h("dd", null, progress.status)),
      h("div", null, h("dt", null, "Старт"), h("dd", null, formatDiagnosticTimestamp(progress.startedAt))),
      h("div", null, h("dt", null, "Открыто"), h("dd", null, formatDiagnosticTimestamp(progress.lastOpenedAt)))
    )
  );
}

function DiagnosticApiErrorPanel({
  notice,
  onRetry
}: {
  notice: DiagnosticNotice | null;
  onRetry: () => void;
}) {
  return h(
    DiagnosticApiStatePanel,
    {
      eyebrow: "Ошибка",
      title: notice?.title ?? "Диагностика временно недоступна",
      body: notice?.body ?? "Попробуйте открыть шаг ещё раз.",
      children: h(
        "button",
        { className: "primary-action diagnostic-action", onClick: onRetry, type: "button" },
        "Повторить загрузку"
      )
    }
  );
}

function DiagnosticNoticePanel({ notice }: { notice: DiagnosticNotice }) {
  return h(
    "section",
    { className: `profile-notice diagnostic-notice diagnostic-notice-${notice.kind}`, role: notice.kind === "error" ? "alert" : "status" },
    h("strong", null, notice.title),
    h("p", null, notice.body)
  );
}

function DiagnosticApiStatePanel({
  body,
  busy = false,
  children,
  eyebrow,
  title
}: {
  body: string;
  busy?: boolean;
  children?: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return h(
    "section",
    { className: "state-panel profile-state-panel", "aria-busy": busy ? "true" : undefined },
    h("p", { className: "section-label" }, eyebrow),
    h("h2", null, title),
    h("p", null, body),
    children
  );
}

function buildDiagnosticApiProgress(draft: DiagnosticApiDraftState, phase: DiagnosticApiPhase) {
  if (phase === "submitted") {
    return { completed: 7, total: 7, percent: 100 };
  }

  const completed =
    (draft.q0SelectedOptionIds.length > 0 ? 1 : 0) +
    diagnosticApiSelfAssessmentItems.filter((item) => typeof draft.selfAssessment[item.id] === "number").length +
    diagnosticApiRoutingQuestions.filter((question) => Boolean(draft.routingAnswers[question.id])).length;

  return {
    completed,
    total: 7,
    percent: Math.round((completed / 7) * 100)
  };
}

function diagnosticDraftStateFromAttempt(response: DiagnosticAttemptResponse): DiagnosticApiDraftState {
  const selfAssessment: DiagnosticApiDraftState["selfAssessment"] = {};
  const routingAnswers: DiagnosticApiDraftState["routingAnswers"] = {};

  for (const answer of response.selfAssessment) {
    if (isSelfAssessmentId(answer.id) && answer.value >= 1 && answer.value <= 5) {
      selfAssessment[answer.id] = answer.value;
    }
  }

  for (const answer of response.routingAnswers) {
    if (isRoutingQuestionId(answer.id) && isAllowedRoutingOption(answer.id, answer.optionId)) {
      routingAnswers[answer.id] = answer.optionId;
    }
  }

  return {
    q0SelectedOptionIds: response.q0.selectedOptionIds.filter(isQ0OptionId),
    selfAssessment,
    routingAnswers
  };
}

function hasDiagnosticDraftContent(draft: DiagnosticApiDraftState): boolean {
  return (
    draft.q0SelectedOptionIds.length > 0 ||
    Object.keys(draft.selfAssessment).length > 0 ||
    Object.keys(draft.routingAnswers).length > 0
  );
}

function buildResumeNotice(): DiagnosticNotice {
  return {
    kind: "info",
    title: "Черновик восстановлен",
    body: "Мы загрузили сохранённый черновик диагностики. Ответы можно проверить без показа служебных идентификаторов."
  };
}

function buildEmptyDraftNotice(): DiagnosticNotice {
  return {
    kind: "info",
    title: "Черновик открыт",
    body: "Пока нет сохранённых ответов. Начните с Q0, затем заполните SA1-SA3 и Q1-Q3."
  };
}

function buildDiagnosticFailureNotice(body: string): DiagnosticNotice {
  return {
    kind: "error",
    title: "Не удалось выполнить шаг диагностики",
    body
  };
}

function isQ0OptionId(value: string): value is Q0OptionId {
  return diagnosticApiQ0Options.some((option) => option.id === value);
}

function isSelfAssessmentId(value: string): value is SelfAssessmentId {
  return diagnosticApiSelfAssessmentItems.some((item) => item.id === value);
}

function isRoutingQuestionId(value: string): value is RoutingQuestionId {
  return diagnosticApiRoutingQuestions.some((question) => question.id === value);
}

function isAllowedRoutingOption(questionId: RoutingQuestionId, optionId: string): optionId is RoutingOptionId {
  return diagnosticApiRoutingQuestions
    .find((question) => question.id === questionId)
    ?.options.some((option) => option.id === optionId) === true;
}

function formatDiagnosticTimestamp(value: string): string {
  return value.replace("T", " ").replace("Z", " UTC");
}

function getBrowserApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_FINRHYTHM_API_BASE_URL ?? window.location.origin;
}
