"use client";

import {
  createElement as h,
  Fragment,
  useState,
  type ChangeEvent,
  type FormEvent,
  type HTMLInputTypeAttribute,
  type ReactNode
} from "react";
import {
  fetchEmployeeProfileSession,
  fetchLegalDocumentAcceptance,
  LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION,
  LEGAL_DOCUMENT_TYPES,
  type EmployeeProfileSessionResponse,
  type LegalDocumentAcceptanceRequest,
  type LegalDocumentAcceptanceResponse
} from "@finrhythm/api-client";
import { DiagnosticApiFlowScreen } from "./diagnostic-api-flow-screen.ts";
import { ProfileContactScreen, type ProfileContactScreenProps } from "./profile-contact-screen.ts";
import { classifyApiClientError } from "../lib/profile-contact-state.ts";
import {
  buildEmployeeProfileSessionRequest,
  buildInvalidProfileSessionFeedback,
  buildProfileSessionValidationFeedback,
  emptyProfileSessionFormValues,
  type ProfileSessionFormValues,
  type ProfileSessionValidationFeedback
} from "../lib/profile-session-state.ts";
import { EmployeeAppHeader, EmployeeBottomNav, SecondarySupportEntry } from "./employee-app-shell.ts";

type EntryPhase = "entry" | "creating" | "legal" | "accepting" | "diagnostic" | "contact";

type EntryNotice =
  | { kind: "validation"; title: string; body: string }
  | { kind: "error"; title: string; body: string };

export const PROFILE_SESSION_LEGAL_ACCEPTANCE_SOURCE = "web_profile_session";

export function ProfileSessionEntryScreen() {
  const [phase, setPhase] = useState<EntryPhase>("entry");
  const [values, setValues] = useState<ProfileSessionFormValues>(() => emptyProfileSessionFormValues());
  const [validationFeedback, setValidationFeedback] = useState<ProfileSessionValidationFeedback | null>(null);
  const [notice, setNotice] = useState<EntryNotice | null>(null);
  const [legalNotice, setLegalNotice] = useState<EntryNotice | null>(null);
  const [profileSessionToken, setProfileSessionToken] = useState<string | null>(null);
  const [employeeRegistrationId, setEmployeeRegistrationId] = useState<string | null>(null);

  function updateValue(field: keyof ProfileSessionFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setValidationFeedback(null);
      setNotice(null);
      setLegalNotice(null);
    };
  }

  async function submitProfileSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const feedback = buildProfileSessionValidationFeedback(values);
    if (feedback) {
      setValidationFeedback(feedback);
      setNotice({
        kind: "validation",
        title: "Заполните данные для проверки",
        body: feedback.message
      });
      return;
    }

    const request = buildEmployeeProfileSessionRequest(values);
    if (!request) {
      return;
    }

    setPhase("creating");
    setNotice(null);
    setValidationFeedback(null);
    setProfileSessionToken(null);
    setEmployeeRegistrationId(null);
    setLegalNotice(null);

    try {
      const response = await fetchEmployeeProfileSession(getBrowserApiBaseUrl(), { body: request });
      setProfileSessionToken(response.profileSessionToken);
      setEmployeeRegistrationId(getEmployeeRegistrationId(response));
      setValues(emptyProfileSessionFormValues());
      setPhase("legal");
    } catch (error: unknown) {
      const kind = classifyApiClientError(error);

      setPhase("entry");
      setProfileSessionToken(null);
      setEmployeeRegistrationId(null);
      setLegalNotice(null);
      setValues(emptyProfileSessionFormValues());

      if (kind === "validation") {
        const invalidFeedback = buildInvalidProfileSessionFeedback();
        setValidationFeedback(invalidFeedback);
        setNotice({
          kind: "validation",
          title: "Не удалось подтвердить профиль",
          body: invalidFeedback.message
        });
        return;
      }

      setNotice({
        kind: "error",
        title: "Не удалось создать профильную сессию",
        body: "Похоже, сеть или API временно недоступны. Попробуйте ещё раз позже."
      });
    }
  }

  async function submitLegalAcceptance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profileSessionToken || !employeeRegistrationId || phase === "accepting") {
      return;
    }

    setPhase("accepting");
    setLegalNotice(null);

    try {
      const response = await fetchLegalDocumentAcceptance(getBrowserApiBaseUrl(), {
        employeeRegistrationId,
        body: buildProfileSessionLegalAcceptanceRequest()
      });

      if (!acceptedAllCurrentDraftLegalDocuments(response)) {
        throw new Error("Legal acceptance response did not include all current draft documents.");
      }

      setPhase("diagnostic");
    } catch (_error: unknown) {
      setPhase("legal");
      setLegalNotice(buildLegalAcceptanceFailureNotice());
    }
  }

  if (phase === "diagnostic" && profileSessionToken) {
    return h(DiagnosticApiFlowScreen, {
      profileSessionToken,
      onContinueToContact: () => setPhase("contact")
    });
  }

  if (phase === "contact" && profileSessionToken) {
    return h<ProfileContactScreenProps>(ProfileContactScreen, {
      initialProfileSessionToken: profileSessionToken,
      sessionReadyNotice: {
        title: "Документы и диагностика зафиксированы",
        body:
          "Контактный профиль открыт в этой вкладке после legal acceptance и безопасного handoff к N1. Сессионный секрет остаётся только в памяти компонента и не переносится через адрес."
      }
    });
  }

  return h(
    "main",
    { className: "learning-page profile-contact-page" },
    h(
      "div",
      { className: "mobile-shell profile-contact-shell profile-session-shell" },
      h(EmployeeAppHeader, { pill: "Профиль" }),
      h(EmployeeBottomNav, { active: "profile" }),
      h(ProfileSessionHero),
      h(ProfileSessionPrivacyCard),
      h(SecondarySupportEntry, { compact: true }),
      phase === "creating"
        ? h(ProfileSessionCreatingPanel)
        : phase === "legal" || phase === "accepting"
          ? h(ProfileSessionLegalAcceptanceStep, {
              busy: phase === "accepting",
              notice: legalNotice,
              onSubmit: submitLegalAcceptance
            })
        : h(ProfileSessionForm, {
            notice,
            onChange: updateValue,
            onSubmit: submitProfileSession,
            validationFeedback,
            values
          })
    )
  );
}

export function buildProfileSessionLegalAcceptanceRequest(): LegalDocumentAcceptanceRequest {
  return {
    documents: LEGAL_DOCUMENT_TYPES.map((documentType) => ({
      documentType,
      documentVersion: LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION
    })),
    source: PROFILE_SESSION_LEGAL_ACCEPTANCE_SOURCE
  };
}

export function acceptedAllCurrentDraftLegalDocuments(response: LegalDocumentAcceptanceResponse): boolean {
  const acceptedVersions = new Map(
    response.acceptedDocuments.map((document) => [document.documentType, document.documentVersion])
  );

  return LEGAL_DOCUMENT_TYPES.every(
    (documentType) => acceptedVersions.get(documentType) === LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION
  );
}

function ProfileSessionHero() {
  return h(
    "section",
    { className: "profile-hero", "aria-labelledby": "profile-session-title" },
    h("p", { className: "section-label" }, "Вход в профиль"),
    h("h1", { id: "profile-session-title" }, "Подтвердите контактный профиль"),
    h(
      "p",
      null,
      "Введите код приглашения, имя, email и телефон. После проверки откроется короткая профильная сессия для просмотра и обновления контактов."
    )
  );
}

function ProfileSessionPrivacyCard() {
  return h(
    "section",
    { className: "privacy-card profile-privacy-card", "aria-labelledby": "profile-session-privacy-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
      h("h2", { id: "profile-session-privacy-title" }, "Граница приватности видна до входа"),
      h(
        "p",
        null,
        "Эта проверка нужна только для доступа к профилю и контактам. Личные ответы диагностики, слабые зоны, точные суммы и детали рефлексии по умолчанию не передаются как персональные HR-отчёты."
      )
    )
  );
}

function ProfileSessionCreatingPanel() {
  return h(ProfileStatePanel, {
    eyebrow: "Проверка",
    title: "Проверяем профиль",
    body: "Создаём короткую профильную сессию без сохранения секрета на устройстве.",
    busy: true,
    children: h(Fragment, null, h("div", { className: "skeleton-line" }), h("div", { className: "skeleton-line" }))
  });
}

function ProfileSessionLegalAcceptanceStep({
  busy,
  notice,
  onSubmit
}: {
  busy: boolean;
  notice: EntryNotice | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return h(
    "section",
    { className: "profile-form-panel profile-legal-panel", "aria-labelledby": "profile-legal-title" },
    h("p", { className: "section-label" }, "Юридический шаг"),
    h("h2", { id: "profile-legal-title" }, "Подтвердите текущие черновые документы"),
    h(
      "p",
      null,
      "Перед контактами нужно зафиксировать версии политики приватности, согласия на обработку данных, правил использования и финансового дисклеймера."
    ),
    h(
      "p",
      null,
      "Формулировки остаются черновыми и ждут проверки человеком и юристом. Этот экран не заменяет проверку юристом."
    ),
    h(
      "ul",
      { className: "privacy-list", "aria-label": "Что будет записано" },
      h("li", null, `Все текущие типы документов: ${LEGAL_DOCUMENT_TYPES.length}.`),
      h("li", null, `Версия документов: ${LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION}.`),
      h("li", null, "Технический источник отмечается без сессионного секрета.")
    ),
    h(
      "form",
      { className: "profile-contact-form profile-legal-form", onSubmit },
      notice ? h(ProfileEntryNotice, { notice }) : null,
      h(
        "button",
        { className: "primary-action profile-submit", disabled: busy, type: "submit" },
        busy ? "Записываем принятие..." : "Подтвердить принятие черновых документов"
      )
    )
  );
}

function ProfileSessionForm({
  notice,
  onChange,
  onSubmit,
  validationFeedback,
  values
}: {
  notice: EntryNotice | null;
  onChange: (field: keyof ProfileSessionFormValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  validationFeedback: ProfileSessionValidationFeedback | null;
  values: ProfileSessionFormValues;
}) {
  return h(
    "section",
    { className: "profile-form-panel profile-session-panel", "aria-labelledby": "profile-session-form-title" },
    h("p", { className: "section-label" }, "Проверка доступа"),
    h("h2", { id: "profile-session-form-title" }, "Введите данные из приглашения"),
    h(
      "form",
      { className: "profile-contact-form profile-session-form", onSubmit },
      h(ProfileSessionTextField, {
        autoComplete: "one-time-code",
        error: validationFeedback?.fieldHints.inviteCode,
        label: "Код приглашения",
        name: "inviteCode",
        onChange: onChange("inviteCode"),
        type: "text",
        value: values.inviteCode
      }),
      h(ProfileSessionTextField, {
        autoComplete: "name",
        error: validationFeedback?.fieldHints.fullName,
        label: "Имя и фамилия",
        name: "fullName",
        onChange: onChange("fullName"),
        type: "text",
        value: values.fullName
      }),
      h(ProfileSessionTextField, {
        autoComplete: "email",
        error: validationFeedback?.fieldHints.email,
        inputMode: "email",
        label: "Email",
        name: "email",
        onChange: onChange("email"),
        type: "email",
        value: values.email
      }),
      h(ProfileSessionTextField, {
        autoComplete: "tel",
        error: validationFeedback?.fieldHints.phone,
        inputMode: "tel",
        label: "Телефон",
        name: "phone",
        onChange: onChange("phone"),
        type: "tel",
        value: values.phone
      }),
      notice ? h(ProfileEntryNotice, { notice }) : null,
      h("button", { className: "primary-action profile-submit", type: "submit" }, "Открыть профиль")
    )
  );
}

function ProfileSessionTextField({
  autoComplete,
  error,
  inputMode,
  label,
  name,
  onChange,
  type,
  value
}: {
  autoComplete: string;
  error?: string;
  inputMode?: "email" | "tel" | "text";
  label: string;
  name: keyof ProfileSessionFormValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type: HTMLInputTypeAttribute;
  value: string;
}) {
  const hintId = error ? `${name}-session-hint` : undefined;

  return h(
    "label",
    { className: "profile-field" },
    h("span", null, label),
    h("input", {
      "aria-describedby": hintId,
      "aria-invalid": error ? "true" : undefined,
      autoComplete,
      inputMode,
      name,
      onChange,
      type,
      value
    }),
    error ? h("span", { className: "profile-field-error", id: hintId }, error) : null
  );
}

function ProfileEntryNotice({ notice }: { notice: EntryNotice }) {
  const className = notice.kind === "error" ? "profile-notice-error" : "profile-validation-message";

  return h(
    "div",
    { className: `profile-notice ${className}`, role: notice.kind === "error" ? "alert" : "status" },
    h("strong", null, notice.title),
    h("p", null, notice.body)
  );
}

function ProfileStatePanel({
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

function buildLegalAcceptanceFailureNotice(): EntryNotice {
  return {
    kind: "error",
    title: "Не удалось записать принятие документов",
    body:
      "Попробуйте ещё раз. В ошибке не показываются код приглашения, сессионный секрет, идентификаторы или контактные поля."
  };
}

function getEmployeeRegistrationId(response: EmployeeProfileSessionResponse): string {
  return response.employeeRegistrationId;
}

function getBrowserApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_FINRHYTHM_API_BASE_URL ?? window.location.origin;
}
