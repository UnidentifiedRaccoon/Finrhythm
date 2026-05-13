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
  type EmployeeProfileSessionResponse
} from "@finrhythm/api-client";
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

type EntryPhase = "entry" | "creating" | "ready";

type EntryNotice =
  | { kind: "validation"; title: string; body: string }
  | { kind: "error"; title: string; body: string };

type SessionMeta = Omit<EmployeeProfileSessionResponse, "profileSessionToken">;

const navItems = [
  { label: "Обучение", mark: "route", href: "/learning", enabled: true },
  { label: "Челленджи", mark: "challenge", enabled: false },
  { label: "Награды", mark: "reward", enabled: false },
  { label: "Профиль", mark: "profile", href: "/profile/session", enabled: true }
];

export function ProfileSessionEntryScreen() {
  const [phase, setPhase] = useState<EntryPhase>("entry");
  const [values, setValues] = useState<ProfileSessionFormValues>(() => emptyProfileSessionFormValues());
  const [validationFeedback, setValidationFeedback] = useState<ProfileSessionValidationFeedback | null>(null);
  const [notice, setNotice] = useState<EntryNotice | null>(null);
  const [profileSessionToken, setProfileSessionToken] = useState<string | null>(null);
  const [sessionMeta, setSessionMeta] = useState<SessionMeta | null>(null);

  function updateValue(field: keyof ProfileSessionFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setValidationFeedback(null);
      setNotice(null);
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
    setSessionMeta(null);

    try {
      const response = await fetchEmployeeProfileSession(getBrowserApiBaseUrl(), { body: request });
      setProfileSessionToken(response.profileSessionToken);
      setSessionMeta(stripRawToken(response));
      setValues(emptyProfileSessionFormValues());
      setPhase("ready");
    } catch (error: unknown) {
      const kind = classifyApiClientError(error);

      setPhase("entry");
      setProfileSessionToken(null);
      setSessionMeta(null);
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

  if (phase === "ready" && profileSessionToken && sessionMeta) {
    return h<ProfileContactScreenProps>(ProfileContactScreen, {
      initialProfileSessionToken: profileSessionToken,
      sessionReadyNotice: {
        title: "Профильная сессия готова",
        body:
          "Контактный профиль открыт в этой вкладке. Сессионный секрет остаётся только в памяти компонента и не переносится через адрес."
      }
    });
  }

  return h(
    "main",
    { className: "learning-page profile-contact-page" },
    h(
      "div",
      { className: "mobile-shell profile-contact-shell profile-session-shell" },
      h(ProfileSessionHeader),
      h(ProfileSessionNav),
      h(ProfileSessionHero),
      h(ProfileSessionPrivacyCard),
      phase === "creating"
        ? h(ProfileSessionCreatingPanel)
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

function ProfileSessionHeader() {
  return h(
    "header",
    { className: "app-header" },
    h(
      "a",
      { className: "brand-lockup", href: "/learning", "aria-label": "Финпульс: обучение" },
      h("span", { className: "brand-mark", "aria-hidden": "true" }, "Ф"),
      h("span", null, "Финпульс")
    ),
    h("span", { className: "demo-pill" }, "Профиль")
  );
}

function ProfileSessionNav() {
  return h(
    "nav",
    { className: "bottom-nav", "aria-label": "Разделы приложения" },
    navItems.map((item) =>
      item.enabled
        ? h(
            "a",
            {
              key: item.label,
              href: item.href,
              "aria-current": item.mark === "profile" ? "page" : undefined
            },
            h("span", { className: `nav-mark nav-mark-${item.mark}`, "aria-hidden": "true" }),
            h("span", null, item.label)
          )
        : h(
            "span",
            { key: item.label, "aria-disabled": "true" },
            h("span", { className: `nav-mark nav-mark-${item.mark}`, "aria-hidden": "true" }),
            h("span", null, item.label)
          )
    )
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

function stripRawToken(response: EmployeeProfileSessionResponse): SessionMeta {
  return {
    accessPoolId: response.accessPoolId,
    contactVerifiedByRegistrationMatch: response.contactVerifiedByRegistrationMatch,
    employeeRegistrationId: response.employeeRegistrationId,
    expiresAt: response.expiresAt,
    pilotLaunchId: response.pilotLaunchId,
    tenantId: response.tenantId
  };
}

function getBrowserApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_FINRHYTHM_API_BASE_URL ?? window.location.origin;
}
