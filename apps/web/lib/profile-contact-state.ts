import type { ApiErrorResponse, EmployeeContactUpdateRequest } from "@finrhythm/api-client";

export type ContactValues = {
  email: string;
  phone: string;
};

export type ApiFailureKind = "validation" | "auth" | "network";

export type SafeValidationFeedback = {
  message: string;
  fieldHints: Partial<Record<keyof ContactValues, string>>;
};

type SafeApiErrorShape = Pick<ApiErrorResponse, "fieldErrors">;

export function buildChangedContactRequest(
  current: ContactValues,
  draft: ContactValues
): EmployeeContactUpdateRequest | null {
  const email = draft.email.trim();
  const phone = draft.phone.trim();
  const request: EmployeeContactUpdateRequest = {};

  if (email !== current.email.trim()) {
    request.email = email;
  }

  if (phone !== current.phone.trim()) {
    request.phone = phone;
  }

  return Object.keys(request).length > 0 ? request : null;
}

export function classifyApiClientError(error: unknown): ApiFailureKind {
  const status = extractHttpStatus(error);

  if (status === 400) {
    return "validation";
  }

  if (status === 401) {
    return "auth";
  }

  return "network";
}

export function buildSafeValidationFeedback(
  request: EmployeeContactUpdateRequest,
  apiError?: SafeApiErrorShape
): SafeValidationFeedback {
  const fieldHints: SafeValidationFeedback["fieldHints"] = {};
  const apiFields = new Set(apiError?.fieldErrors.map((item) => item.field));

  if (request.email !== undefined || apiFields.has("email")) {
    fieldHints.email = "Проверьте формат email. Мы не показываем введённое значение в ошибке.";
  }

  if (request.phone !== undefined || apiFields.has("phone")) {
    fieldHints.phone = "Проверьте телефон. Мы не показываем введённое значение в ошибке.";
  }

  return {
    message: "Не получилось сохранить контакты. Проверьте email и телефон, затем попробуйте ещё раз.",
    fieldHints
  };
}

export function extractHttpStatus(error: unknown): number | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const match = error.message.match(/HTTP\s+(\d{3})/);
  return match ? Number(match[1]) : null;
}
