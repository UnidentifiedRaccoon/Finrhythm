"use client";

import {
  createElement as h,
  Fragment,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from "react";
import {
  fetchEmployeeMeContactUpdate,
  fetchEmployeeMeProfileSummary,
  type EmployeeContactUpdateResponse,
  type EmployeeProfileSummaryResponse
} from "@finrhythm/api-client";
import {
  buildChangedContactRequest,
  buildSafeValidationFeedback,
  classifyApiClientError,
  type ContactValues,
  type SafeValidationFeedback
} from "../lib/profile-contact-state.ts";

type ScreenState = "missing" | "loading" | "ready" | "auth" | "error";

type SaveNotice =
  | { kind: "updated"; title: string; body: string }
  | { kind: "noop"; title: string; body: string }
  | { kind: "error"; title: string; body: string };

const navItems = [
  { label: "Обучение", mark: "route", href: "/learning", enabled: true },
  { label: "Челленджи", mark: "challenge", enabled: false },
  { label: "Награды", mark: "reward", enabled: false },
  { label: "Профиль", mark: "profile", href: "/profile/session", enabled: true }
];

export type ProfileSessionReadyNotice = {
  title: string;
  body: string;
};

export type ProfileContactScreenProps = {
  initialProfileSessionToken?: string | null;
  sessionReadyNotice?: ProfileSessionReadyNotice | null;
};

export function ProfileContactScreen(props?: ProfileContactScreenProps) {
  const { initialProfileSessionToken = null, sessionReadyNotice = null } = props ?? {};
  const [screenState, setScreenState] = useState<ScreenState>("missing");
  const [profileSessionToken, setProfileSessionToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<EmployeeProfileSummaryResponse | null>(null);
  const [draft, setDraft] = useState<ContactValues>({ email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<SaveNotice | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<SafeValidationFeedback | null>(null);

  useEffect(() => {
    let cancelled = false;
    const memoryToken = initialProfileSessionToken?.trim() ?? "";

    if (memoryToken) {
      openProfileSession(memoryToken);
      return () => {
        cancelled = true;
      };
    }

    resetMissingState();
    return () => {
      cancelled = true;
    };

    function resetMissingState() {
      setProfileSessionToken(null);
      setProfile(null);
      setDraft({ email: "", phone: "" });
      setIsSaving(false);
      setSaveNotice(null);
      setValidationFeedback(null);
      setScreenState("missing");
    }

    function openProfileSession(token: string) {
      setProfileSessionToken(token);
      setProfile(null);
      setDraft({ email: "", phone: "" });
      setIsSaving(false);
      setSaveNotice(null);
      setValidationFeedback(null);
      setScreenState("loading");

      fetchEmployeeMeProfileSummary(getBrowserApiBaseUrl(), { profileSessionToken: token })
        .then((summary) => {
          if (cancelled) {
            return;
          }

          setProfile(summary);
          setDraft({ email: summary.email, phone: summary.phone });
          setScreenState("ready");
        })
        .catch((error: unknown) => {
          if (cancelled) {
            return;
          }

          if (classifyApiClientError(error) === "auth") {
            setProfileSessionToken(null);
            setScreenState("auth");
            return;
          }

          setScreenState("error");
        });
    }
  }, [initialProfileSessionToken]);

  function updateDraft(field: keyof ContactValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setDraft((current) => ({ ...current, [field]: event.target.value }));
      setValidationFeedback(null);
      setSaveNotice(null);
    };
  }

  async function submitContactUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile || !profileSessionToken || isSaving) {
      return;
    }

    const request = buildChangedContactRequest(profile, draft);
    setValidationFeedback(null);

    if (!request) {
      setSaveNotice({
        kind: "noop",
        title: "Контакты уже актуальны",
        body: "На этом экране нет новых изменений для отправки."
      });
      return;
    }

    setIsSaving(true);
    setSaveNotice(null);

    try {
      const response = await fetchEmployeeMeContactUpdate(getBrowserApiBaseUrl(), {
        profileSessionToken,
        body: request
      });
      setProfile(profileFromContactUpdate(response));
      setDraft({ email: response.email, phone: response.phone });
      setSaveNotice(buildSuccessNotice(response));
    } catch (error: unknown) {
      const kind = classifyApiClientError(error);

      if (kind === "validation") {
        setValidationFeedback(buildSafeValidationFeedback(request));
        setSaveNotice(null);
      } else if (kind === "auth") {
        setProfileSessionToken(null);
        setScreenState("auth");
      } else {
        setSaveNotice({
          kind: "error",
          title: "Не удалось сохранить контакты",
          body: "Похоже, сеть или API временно недоступны. Попробуйте ещё раз позже."
        });
      }
    } finally {
      setIsSaving(false);
    }
  }

  return h(
    "main",
    { className: "learning-page profile-contact-page" },
    h(
      "div",
      { className: "mobile-shell profile-contact-shell" },
      h(ProfileHeader),
      h(ProfileNav),
      h(ProfileHero),
      h(ProfilePrivacyCard),
      sessionReadyNotice ? h(ProfileSessionReadyBanner, { notice: sessionReadyNotice }) : null,
      h(ProfileContent, {
        draft,
        isSaving,
        profile,
        screenState,
        saveNotice,
        validationFeedback,
        onDraftChange: updateDraft,
        onSubmit: submitContactUpdate
      })
    )
  );
}

function ProfileHeader() {
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

function ProfileNav() {
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

function ProfileHero() {
  return h(
    "section",
    { className: "profile-hero", "aria-labelledby": "profile-contact-title" },
    h("p", { className: "section-label" }, "Профиль"),
    h("h1", { id: "profile-contact-title" }, "Контакты для связи"),
    h(
      "p",
      null,
      "Проверьте email и телефон, чтобы команда могла связаться с вами по профилю. Имя здесь только для чтения."
    )
  );
}

function ProfilePrivacyCard() {
  return h(
    "section",
    { className: "privacy-card profile-privacy-card", "aria-labelledby": "profile-privacy-title" },
    h("span", { className: "privacy-icon", "aria-hidden": "true" }),
    h(
      "div",
      null,
      h("h2", { id: "profile-privacy-title" }, "Граница приватности сохраняется"),
      h(
        "p",
        null,
        "Этот экран меняет только email и телефон. Личные ответы диагностики, слабые зоны, точные суммы и детали рефлексии по умолчанию не передаются как персональные HR-отчёты."
      )
    )
  );
}

function ProfileContent({
  draft,
  isSaving,
  onDraftChange,
  onSubmit,
  profile,
  saveNotice,
  screenState,
  validationFeedback
}: {
  draft: ContactValues;
  isSaving: boolean;
  onDraftChange: (field: keyof ContactValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  profile: EmployeeProfileSummaryResponse | null;
  saveNotice: SaveNotice | null;
  screenState: ScreenState;
  validationFeedback: SafeValidationFeedback | null;
}) {
  if (screenState === "loading") {
    return h(ProfileStatePanel, {
      eyebrow: "Загрузка",
      title: "Открываем профиль",
      body: "Проверяем короткую профильную сессию и загружаем текущие контакты.",
      busy: true,
      children: h(Fragment, null, h("div", { className: "skeleton-line" }), h("div", { className: "skeleton-line" }))
    });
  }

  if (screenState === "auth") {
    return h(ProfileStatePanel, {
      eyebrow: "Сессия истекла",
      title: "Нужна новая профильная сессия",
      body: "Вернитесь к входу по коду и запросите новую короткую сессию. Пароль или постоянный вход здесь не создаются.",
      action: h("a", { className: "state-link", href: "/profile/session" }, "Открыть вход в профиль")
    });
  }

  if (screenState === "error") {
    return h(ProfileStatePanel, {
      eyebrow: "Ошибка",
      title: "Не удалось загрузить контакты",
      body: "Похоже, API временно недоступен. Данные не сохранены на устройстве, попробуйте открыть экран позже.",
      action: h("a", { className: "state-link", href: "/profile/session" }, "Начать заново")
    });
  }

  if (!profile) {
    return h(ProfileStatePanel, {
      eyebrow: "Вход в профиль",
      title: "Нужна профильная сессия",
      body:
        "Откройте вход в профиль, подтвердите код приглашения, имя, email и телефон. Короткая сессия останется только в памяти текущей вкладки.",
      action: h("a", { className: "state-link", href: "/profile/session" }, "Открыть вход в профиль")
    });
  }

  return h(
    "section",
    { className: "profile-form-panel", "aria-labelledby": "profile-form-title" },
    h("p", { className: "section-label" }, "Текущие данные"),
    h("h2", { id: "profile-form-title" }, "Проверьте контактные поля"),
    h(
      "dl",
      { className: "profile-readonly-list", "aria-label": "Данные только для чтения" },
      h("div", null, h("dt", null, "Имя"), h("dd", null, profile.fullName || "Не указано"))
    ),
    h(
      "form",
      { className: "profile-contact-form", onSubmit },
      h(ProfileTextField, {
        autoComplete: "email",
        error: validationFeedback?.fieldHints.email,
        inputMode: "email",
        label: "Email",
        name: "email",
        onChange: onDraftChange("email"),
        type: "email",
        value: draft.email
      }),
      h(ProfileTextField, {
        autoComplete: "tel",
        error: validationFeedback?.fieldHints.phone,
        inputMode: "tel",
        label: "Телефон",
        name: "phone",
        onChange: onDraftChange("phone"),
        type: "tel",
        value: draft.phone
      }),
      validationFeedback
        ? h(
            "div",
            { className: "profile-validation-message", role: "alert" },
            h("strong", null, "Проверьте контактные данные"),
            h("p", null, validationFeedback.message)
          )
        : null,
      saveNotice ? h(ProfileNotice, { notice: saveNotice }) : null,
      h(
        "button",
        { className: "primary-action profile-submit", disabled: isSaving, type: "submit" },
        isSaving ? "Сохраняем..." : "Сохранить контакты"
      )
    )
  );
}

function ProfileTextField({
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
  inputMode: "email" | "tel";
  label: string;
  name: keyof ContactValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type: "email" | "tel";
  value: string;
}) {
  const hintId = error ? `${name}-hint` : undefined;

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

function ProfileNotice({ notice }: { notice: SaveNotice }) {
  return h(
    "div",
    { className: `profile-notice profile-notice-${notice.kind}`, role: notice.kind === "error" ? "alert" : "status" },
    h("strong", null, notice.title),
    h("p", null, notice.body)
  );
}

function ProfileSessionReadyBanner({ notice }: { notice: ProfileSessionReadyNotice }) {
  return h(
    "section",
    { className: "profile-session-ready", role: "status", "aria-live": "polite" },
    h("p", { className: "section-label" }, "Сессия"),
    h("h2", null, notice.title),
    h("p", null, notice.body)
  );
}

function ProfileStatePanel({
  action,
  body,
  busy = false,
  children,
  eyebrow,
  title
}: {
  action?: ReactNode;
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
    children,
    action
  );
}

function buildSuccessNotice(response: EmployeeContactUpdateResponse): SaveNotice {
  if (response.outcome === "noop" || !response.changed) {
    return {
      kind: "noop",
      title: "Контакты уже совпадали",
      body: "API принял запрос, но после нормализации email и телефон уже были такими же."
    };
  }

  return {
    kind: "updated",
    title: "Контакты обновлены",
    body: "Email и телефон сохранены в профиле. Имя осталось без изменений."
  };
}

function profileFromContactUpdate(response: EmployeeContactUpdateResponse): EmployeeProfileSummaryResponse {
  return {
    accessPoolId: response.accessPoolId,
    contactVerifiedByRegistrationMatch: response.contactVerifiedByProfileSession,
    email: response.email,
    employeeRegistrationId: response.employeeRegistrationId,
    fullName: response.fullName,
    phone: response.phone,
    pilotLaunchId: response.pilotLaunchId,
    registeredAt: response.registeredAt,
    tenantId: response.tenantId
  };
}

function getBrowserApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_FINRHYTHM_API_BASE_URL ?? window.location.origin;
}
