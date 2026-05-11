import fixture from "./code-status-fixture.json";
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

export async function getAdminCodeStatus(
  params: SearchParams
): Promise<AdminCodeStatusResult> {
  const source = resolveSource(params);
  const statusFilter = normalizeStatus(first(params.status));
  const forcedState = first(params.state);

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

function resolveSource(params: SearchParams): AdminStatusSource {
  const requested = first(params.mode);
  if (requested === "live") {
    return "live";
  }
  return "fixture";
}

async function fetchLiveCodeStatus(
  params: SearchParams,
  statusFilter: CodeStatus | null
): Promise<AdminCodeStatusResponse> {
  const baseUrl = process.env.FINRHYTHM_ADMIN_API_BASE_URL;
  const tenantId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_TENANT_ID;
  const pilotLaunchId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID;
  const accessPoolId = process.env.FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID;

  if (!baseUrl || !tenantId || !pilotLaunchId || !accessPoolId) {
    throw new Error(
      "Live-режим требует FINRHYTHM_ADMIN_API_BASE_URL и синтетические ID контура, запуска и пула доступа."
    );
  }

  const page = normalizeInteger(first(params.page), DEFAULT_PAGE, 0);
  const size = normalizeInteger(first(params.size), DEFAULT_SIZE, 1, MAX_PAGE_SIZE);
  const url = new URL(
    `/api/v1/admin/tenants/${tenantId}/pilot-launches/${pilotLaunchId}/access-pools/${accessPoolId}/code-status`,
    baseUrl
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));
  if (statusFilter) {
    url.searchParams.set("status", statusFilter);
  }

  const response = await fetch(url, {
    cache: "no-store",
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("Backend вернул безопасную ошибку при чтении статуса пула доступа.");
  }

  return (await response.json()) as AdminCodeStatusResponse;
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
