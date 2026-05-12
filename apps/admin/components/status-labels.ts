import type { AdminCodeStatusResponse, CodeStatus } from "../lib/code-status-types";

export const STATUS_LABELS: Record<CodeStatus, string> = {
  CREATED: "Создан",
  ISSUED: "Выдан",
  RESERVED: "Зарезервирован",
  ACTIVATED: "Активирован",
  REVOKED: "Отозван",
  EXPIRED: "Истек"
};

export const STATUS_HINTS: Record<CodeStatus, string> = {
  CREATED: "создано",
  ISSUED: "выдано",
  RESERVED: "в резерве",
  ACTIVATED: "активировано",
  REVOKED: "отозвано",
  EXPIRED: "истекло"
};

export const ACCESS_POOL_STATUS_LABELS: Record<AdminCodeStatusResponse["accessPoolStatus"], string> = {
  PLANNED: "Запланирован",
  ACTIVE: "Активен",
  CLOSED: "Закрыт",
  ARCHIVED: "Архивирован"
};
