import type { EmployeeProfileSessionRequest } from "@finrhythm/api-client";

export type ProfileSessionFormValues = {
  inviteCode: string;
  fullName: string;
  email: string;
  phone: string;
};

export type ProfileSessionValidationFeedback = {
  message: string;
  fieldHints: Partial<Record<keyof ProfileSessionFormValues, string>>;
};

const requiredHints: Record<keyof ProfileSessionFormValues, string> = {
  inviteCode: "Введите код приглашения.",
  fullName: "Введите имя так, как оно указано при регистрации.",
  email: "Введите email.",
  phone: "Введите телефон."
};

export function emptyProfileSessionFormValues(): ProfileSessionFormValues {
  return {
    inviteCode: "",
    fullName: "",
    email: "",
    phone: ""
  };
}

export function buildEmployeeProfileSessionRequest(
  values: ProfileSessionFormValues
): EmployeeProfileSessionRequest | null {
  const normalized = trimProfileSessionValues(values);

  if (Object.values(normalized).some((value) => value.length === 0)) {
    return null;
  }

  return normalized;
}

export function buildProfileSessionValidationFeedback(
  values: ProfileSessionFormValues
): ProfileSessionValidationFeedback | null {
  const normalized = trimProfileSessionValues(values);
  const fieldHints: ProfileSessionValidationFeedback["fieldHints"] = {};

  for (const [field, value] of Object.entries(normalized) as Array<[keyof ProfileSessionFormValues, string]>) {
    if (value.length === 0) {
      fieldHints[field] = requiredHints[field];
    }
  }

  if (Object.keys(fieldHints).length === 0) {
    return null;
  }

  return {
    message: "Заполните код приглашения, имя, email и телефон. Мы не показываем введённые значения в ошибке.",
    fieldHints
  };
}

export function buildInvalidProfileSessionFeedback(): ProfileSessionValidationFeedback {
  return {
    message:
      "Не удалось подтвердить профиль. Проверьте код приглашения, имя, email и телефон. Мы не показываем введённые значения в ошибке.",
    fieldHints: {
      inviteCode: "Введите код заново. В ошибке он не отображается.",
      fullName: "Проверьте написание имени.",
      email: "Проверьте email.",
      phone: "Проверьте телефон."
    }
  };
}

function trimProfileSessionValues(values: ProfileSessionFormValues): EmployeeProfileSessionRequest {
  return {
    inviteCode: values.inviteCode.trim(),
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim()
  };
}
