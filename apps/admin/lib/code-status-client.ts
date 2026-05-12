import fixture from "./code-status-fixture.json";
import { fetchAdminCodeStatus } from "@finrhythm/api-client";
import {
  CODE_STATUSES,
  type AdminCodeStatusResponse,
  type AdminCodeStatusResult,
  type AdminStatusSource,
  type CodeStatus
} from "./code-status-types";

type SearchValue = string | string[] | undefined;
type SearchParams = Record<string, SearchValue>;

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
const ADMIN_STATUS_SOURCE_ENV = "FINRHYTHM_ADMIN_CODE_STATUS_SOURCE";

export async function getAdminCodeStatus(
  params: SearchParams
): Promise<AdminCodeStatusResult> {
  const source = resolveSource();
  const statusFilter = normalizeStatus(first(params.status));
  const forcedState = source === "fixture" ? first(params.state) : undefined;

  if (forcedState === "loading") {
    return { state: "loading", source, statusFilter };
  }
  if (forcedState === "error") {
    return {
      state: "error",
      source,
      statusFilter,
      message: "Синтетическая ошибка: операторский экран показывает безопасное сообщение без исходных параметров."
    };
  }

  const data =
    source === "live"
      ? await fetchLiveCodeStatus(params, statusFilter)
      : paginateFixture(params, statusFilter);

  if (forcedState === "empty") {
    return {
      state: "empty",
      source,
      statusFilter,
      data: emptyResponse(data),
      message: "По текущему фильтру нет записей. Проверьте статус или вернитесь к общему списку."
    };
  }

  if (data.codes.items.length === 0) {
    return {
      state: "empty",
      source,
      statusFilter,
      data,
      message: "Для выбранной страницы не найдено строк."
    };
  }

  return { state: "success", source, statusFilter, data };
}

function resolveSource(): AdminStatusSource {
  const configuredSource = process.env[ADMIN_STATUS_SOURCE_ENV]?.trim().toLowerCase();
  if (!configuredSource || configuredSource === "fixture") {
    return "fixture";
  }
  if (configuredSource === "live") {
    return "live";
  }
  throw new Error(`${ADMIN_STATUS_SOURCE_ENV} must be "fixture" or "live".`);
}

async function fetchLiveCodeStatus(
  params: SearchParams,
  statusFilter: CodeStatus | null
): Promise<AdminCodeStatusResponse> {
  const baseUrl = process.env.FINRHYTHM_ADMIN_API_BASE_URL;
  const tenantId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_TENANT_ID;
  const pilotLaunchId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID;
  const accessPoolId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID;
  const adminApiToken = process.env.FINRHYTHM_ADMIN_API_TOKEN;

  if (!baseUrl || !tenantId || !pilotLaunchId || !accessPoolId || !adminApiToken) {
    throw new Error(
      "Live-режим требует server-side API base URL, admin token и синтетические ID контура, запуска и пула доступа."
    );
  }

  const page = normalizeInteger(first(params.page), DEFAULT_PAGE, 0);
  const size = normalizeInteger(first(params.size), DEFAULT_SIZE, 1, MAX_PAGE_SIZE);
  return fetchAdminCodeStatus(
    baseUrl,
    {
      accessPoolId,
      page,
      pilotLaunchId,
      size,
      status: statusFilter ?? undefined,
      tenantId
    },
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${adminApiToken}`
      }
    }
  ).catch(() => {
    throw new Error("Backend вернул безопасную ошибку при чтении статуса пула доступа.");
  });
}

function paginateFixture(
  params: SearchParams,
  statusFilter: CodeStatus | null
): AdminCodeStatusResponse {
  const base = structuredClone(fixture) as AdminCodeStatusResponse;
  const page = normalizeInteger(first(params.page), DEFAULT_PAGE, 0);
  const size = normalizeInteger(first(params.size), DEFAULT_SIZE, 1, MAX_PAGE_SIZE);
  const filteredItems = statusFilter
    ? base.codes.items.filter((item) => item.status === statusFilter)
    : base.codes.items;
  const totalItems = statusFilter
    ? (base.statusCounts.find((item) => item.status === statusFilter)?.count ?? 0)
    : base.codes.totalItems;
  const visibleItems = filteredItems.slice(page * size, page * size + size);

  return {
    ...base,
    codes: {
      page,
      size,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / size)),
      items: visibleItems
    }
  };
}

function emptyResponse(data: AdminCodeStatusResponse): AdminCodeStatusResponse {
  return {
    ...data,
    codes: {
      ...data.codes,
      totalItems: 0,
      totalPages: 0,
      items: []
    }
  };
}

function normalizeStatus(value: string | undefined): CodeStatus | null {
  if (!value) {
    return null;
  }
  const normalized = value.toUpperCase();
  return CODE_STATUSES.includes(normalized as CodeStatus)
    ? (normalized as CodeStatus)
    : null;
}

function normalizeInteger(
  value: string | undefined,
  fallback: number,
  min: number,
  max?: number
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max ?? parsed, Math.max(min, parsed));
}

function first(value: SearchValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
