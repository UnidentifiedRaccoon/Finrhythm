"use client";

import { createElement as h, Fragment, useMemo, useState } from "react";
import { EmployeePageFrame } from "./employee-app-shell.ts";

type DiagnosticPhase = "q0" | "self_assessment" | "preview_questions" | "route_preview";
type SelfAssessmentId = "SA1" | "SA2" | "SA3";
type PreviewQuestionId = "Q1" | "Q2" | "Q3";

type DiagnosticProgress = {
  current: number;
  total: number;
  label: string;
  percent: number;
};

export const diagnosticPreviewPhases: readonly DiagnosticPhase[] = [
  "q0",
  "self_assessment",
  "preview_questions",
  "route_preview"
];

export const diagnosticQ0Options = [
  "кто увидит мои ответы",
  "сколько времени занимает старт",
  "можно ли не указывать точные суммы",
  "что будет после preview",
  "всё понятно, хочу начать"
] as const;

export const diagnosticSelfAssessmentItems: ReadonlyArray<{
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

export const diagnosticPreviewQuestions: ReadonlyArray<{
  id: PreviewQuestionId;
  title: string;
  prompt: string;
  options: readonly string[];
}> = [
  {
    id: "Q1",
    title: "Финансовый резерв",
    prompt: "Что лучше всего описывает резерв на непредвиденную ситуацию?",
    options: [
      "доступная подушка на случай неожиданного расхода",
      "остаток после всех трат",
      "любая сложная финансовая идея",
      "не хочу отвечать"
    ]
  },
  {
    id: "Q2",
    title: "Текущая опора",
    prompt: "Есть ли у вас отдельный резерв, если отвечать только диапазоном?",
    options: [
      "пока нет",
      "есть небольшой запас",
      "есть запас на несколько месяцев",
      "не хочу указывать"
    ]
  },
  {
    id: "Q3",
    title: "Первый барьер",
    prompt: "Что чаще всего мешает начать резерв?",
    options: [
      "не ясно, с какого маленького шага начать",
      "кажется, что небольшой шаг не поможет",
      "сложно удержать запас отдельно",
      "уже есть понятный план"
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

const phaseLabels: Record<DiagnosticPhase, string> = {
  q0: "Приватность до вопросов",
  self_assessment: "Самооценка без scoring",
  preview_questions: "Preview-вопросы",
  route_preview: "Черновой preview"
};

export function buildDiagnosticPreviewProgress(phase: DiagnosticPhase): DiagnosticProgress {
  const current = diagnosticPreviewPhases.indexOf(phase) + 1;
  const total = diagnosticPreviewPhases.length;

  return {
    current,
    total,
    label: phaseLabels[phase],
    percent: Math.round((current / total) * 100)
  };
}

export function DiagnosticPreviewScreen() {
  const [phase, setPhase] = useState<DiagnosticPhase>("q0");
  const [q0Selections, setQ0Selections] = useState<string[]>([]);
  const [selfAssessmentAnswers, setSelfAssessmentAnswers] = useState<Partial<Record<SelfAssessmentId, number>>>({});
  const [previewAnswers, setPreviewAnswers] = useState<Partial<Record<PreviewQuestionId, string>>>({});
  const progress = useMemo(() => buildDiagnosticPreviewProgress(phase), [phase]);
  const selfAssessmentComplete = diagnosticSelfAssessmentItems.every((item) => selfAssessmentAnswers[item.id]);
  const previewQuestionsComplete = diagnosticPreviewQuestions.every((question) => previewAnswers[question.id]);

  function toggleQ0Option(option: string) {
    setQ0Selections((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    );
  }

  function chooseSelfAssessment(id: SelfAssessmentId, value: number) {
    setSelfAssessmentAnswers((current) => ({ ...current, [id]: value }));
  }

  function choosePreviewAnswer(id: PreviewQuestionId, option: string) {
    setPreviewAnswers((current) => ({ ...current, [id]: option }));
  }

  function restartPreview() {
    setPhase("q0");
    setQ0Selections([]);
    setSelfAssessmentAnswers({});
    setPreviewAnswers({});
  }

  return h(
    EmployeePageFrame,
    { active: "home", className: "diagnostic-page", pill: "Диагностика preview" },
    h(DiagnosticHero),
    h(DiagnosticProgressCard, { progress }),
    phase === "q0"
      ? h(Q0PrivacyStep, {
          onContinue: () => setPhase("self_assessment"),
          onToggle: toggleQ0Option,
          selections: q0Selections
        })
      : phase === "self_assessment"
        ? h(SelfAssessmentStep, {
            answers: selfAssessmentAnswers,
            canContinue: selfAssessmentComplete,
            onBack: () => setPhase("q0"),
            onChoose: chooseSelfAssessment,
            onContinue: () => setPhase("preview_questions")
          })
        : phase === "preview_questions"
          ? h(PreviewQuestionsStep, {
              answers: previewAnswers,
              canContinue: previewQuestionsComplete,
              onBack: () => setPhase("self_assessment"),
              onChoose: choosePreviewAnswer,
              onContinue: () => setPhase("route_preview")
            })
          : h(RoutePreviewStep, {
              onBack: () => setPhase("preview_questions"),
              onRestart: restartPreview
            })
  );
}

function DiagnosticHero() {
  return h(
    "section",
    { className: "diagnostic-hero", "aria-labelledby": "diagnostic-title" },
    h("p", { className: "section-label" }, "Диагностика"),
    h("h1", { id: "diagnostic-title" }, "Спокойный вход в preview"),
    h(
      "p",
      null,
      "Этот экран показывает безопасный черновик входной диагностики: сначала Q0 про ожидания и приватность, затем самооценка и несколько методологических карточек."
    )
  );
}

function DiagnosticProgressCard({ progress }: { progress: DiagnosticProgress }) {
  return h(
    "section",
    { className: "diagnostic-progress-card", "aria-labelledby": "diagnostic-progress-title" },
    h(
      "div",
      { className: "progress-copy" },
      h("span", { id: "diagnostic-progress-title" }, "Локальный progress preview"),
      h("strong", null, `${progress.current} из ${progress.total}`)
    ),
    h(
      "div",
      { className: "diagnostic-progress-track", "aria-hidden": "true" },
      h("span", { style: { width: `${progress.percent}%` } })
    ),
    h(
      "p",
      null,
      `${progress.label}. Ответы живут только в памяти открытого экрана и не означают завершение production-диагностики.`
    )
  );
}

function Q0PrivacyStep({
  onContinue,
  onToggle,
  selections
}: {
  onContinue: () => void;
  onToggle: (option: string) => void;
  selections: readonly string[];
}) {
  return h(
    Fragment,
    null,
    h(
      "section",
      { className: "privacy-card diagnostic-privacy-card", "aria-labelledby": "diagnostic-q0-privacy-title" },
      h("span", { className: "privacy-icon", "aria-hidden": "true" }),
      h(
        "div",
        null,
        h("h2", { id: "diagnostic-q0-privacy-title" }, "Q0 сначала: кто что видит"),
        h(
          "p",
          null,
          "Личные ответы, слабые зоны, точные суммы и детали рефлексии не становятся персональным HR-отчётом по умолчанию. В этом preview ничего не отправляется и не сохраняется."
        )
      )
    ),
    h(
      "section",
      { className: "diagnostic-panel", "aria-labelledby": "diagnostic-q0-title" },
      h("p", { className: "section-label" }, "Q0"),
      h("h2", { id: "diagnostic-q0-title" }, "Что важно знать перед стартом?"),
      h("p", null, "Можно выбрать один или несколько пунктов. Это не маршрутный вопрос и не scoring."),
      h(
        "div",
        { className: "choice-grid", "aria-label": "Темы ожиданий перед диагностикой" },
        diagnosticQ0Options.map((option) =>
          h(
            "button",
            {
              "aria-pressed": selections.includes(option),
              className: selections.includes(option) ? "choice-card choice-card-selected" : "choice-card",
              key: option,
              onClick: () => onToggle(option),
              type: "button"
            },
            option
          )
        )
      ),
      h(
        "button",
        { className: "primary-action diagnostic-action", onClick: onContinue, type: "button" },
        "Продолжить к самооценке"
      )
    )
  );
}

function SelfAssessmentStep({
  answers,
  canContinue,
  onBack,
  onChoose,
  onContinue
}: {
  answers: Partial<Record<SelfAssessmentId, number>>;
  canContinue: boolean;
  onBack: () => void;
  onChoose: (id: SelfAssessmentId, value: number) => void;
  onContinue: () => void;
}) {
  return h(
    "section",
    { className: "diagnostic-panel", "aria-labelledby": "diagnostic-sa-title" },
    h("p", { className: "section-label" }, "SA1-SA3"),
    h("h2", { id: "diagnostic-sa-title" }, "Самооценка без scoring"),
    h(
      "p",
      null,
      "Эти три шкалы нужны для личной рефлексии. Они не определяют маршрут, не назначают уровень и не сравнивают сотрудников."
    ),
    h(
      "div",
      { className: "self-assessment-list" },
      diagnosticSelfAssessmentItems.map((item) =>
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
                  "aria-pressed": answers[item.id] === option.value,
                  className: answers[item.id] === option.value ? "scale-choice scale-choice-selected" : "scale-choice",
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
    ),
    h(DiagnosticActionRow, {
      canContinue,
      continueLabel: "Перейти к preview-вопросам",
      disabledHint: "Выберите оценку по SA1, SA2 и SA3.",
      onBack,
      onContinue
    })
  );
}

function PreviewQuestionsStep({
  answers,
  canContinue,
  onBack,
  onChoose,
  onContinue
}: {
  answers: Partial<Record<PreviewQuestionId, string>>;
  canContinue: boolean;
  onBack: () => void;
  onChoose: (id: PreviewQuestionId, option: string) => void;
  onContinue: () => void;
}) {
  return h(
    "section",
    { className: "diagnostic-panel", "aria-labelledby": "diagnostic-preview-questions-title" },
    h("p", { className: "section-label" }, "Методологический preview"),
    h("h2", { id: "diagnostic-preview-questions-title" }, "Только несколько карточек Q1-Q3"),
    h(
      "p",
      null,
      "Это synthetic preview будущего routing-блока. Здесь нет полного набора вопросов, финального scoring и production-маршрутизации."
    ),
    h(
      "div",
      { className: "preview-question-list" },
      diagnosticPreviewQuestions.map((question) =>
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
                  "aria-pressed": answers[question.id] === option,
                  className: answers[question.id] === option ? "choice-card choice-card-selected" : "choice-card",
                  key: option,
                  onClick: () => onChoose(question.id, option),
                  type: "button"
                },
                option
              )
            )
          )
        )
      )
    ),
    h(DiagnosticActionRow, {
      canContinue,
      continueLabel: "Показать черновой preview",
      disabledHint: "Выберите вариант в Q1, Q2 и Q3.",
      onBack,
      onContinue
    })
  );
}

function RoutePreviewStep({ onBack, onRestart }: { onBack: () => void; onRestart: () => void }) {
  return h(
    "section",
    { className: "diagnostic-result-card", "aria-labelledby": "diagnostic-result-title" },
    h("p", { className: "section-label" }, "Предварительный маршрут"),
    h("h2", { id: "diagnostic-result-title" }, "Черновой preview: начните с N1"),
    h(
      "p",
      null,
      "Для демонстрации безопасный handoff ведёт к уроку N1 про первую финансовую опору. Это не финальный результат диагностики, не назначение уровня и не персональный совет."
    ),
    h(
      "ul",
      { className: "diagnostic-boundary-list" },
      h("li", null, "Ответы не отправлялись в API и не сохранялись в браузере."),
      h("li", null, "Карточка не раскрывает личные ответы работодателю и не является персональным отчётом."),
      h("li", null, "Preview не обещает баллы, награды, прогресс урока или готовый маршрут.")
    ),
    h(
      "div",
      { className: "diagnostic-result-actions" },
      h("a", { className: "primary-action", href: "/learning/lessons/N1" }, "Открыть N1"),
      h("a", { className: "secondary-action", href: "/learning" }, "Вернуться к обучению")
    ),
    h(
      "div",
      { className: "diagnostic-action-row" },
      h("button", { className: "secondary-action", onClick: onBack, type: "button" }, "Назад"),
      h("button", { className: "secondary-action", onClick: onRestart, type: "button" }, "Начать preview заново")
    )
  );
}

function DiagnosticActionRow({
  canContinue,
  continueLabel,
  disabledHint,
  onBack,
  onContinue
}: {
  canContinue: boolean;
  continueLabel: string;
  disabledHint: string;
  onBack: () => void;
  onContinue: () => void;
}) {
  return h(
    "div",
    { className: "diagnostic-action-row" },
    h("button", { className: "secondary-action", onClick: onBack, type: "button" }, "Назад"),
    h(
      "div",
      null,
      h(
        "button",
        {
          className: "primary-action diagnostic-action",
          disabled: !canContinue,
          onClick: onContinue,
          type: "button"
        },
        continueLabel
      ),
      canContinue ? null : h("p", { className: "diagnostic-action-hint" }, disabledHint)
    )
  );
}
