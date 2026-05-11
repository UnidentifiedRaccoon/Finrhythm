export const CODE_STATUSES = [
  "CREATED",
  "ISSUED",
  "RESERVED",
  "ACTIVATED",
  "REVOKED",
  "EXPIRED"
] as const;

export type CodeStatus = (typeof CODE_STATUSES)[number];

export type AdminCodeStatusSummary = {
  issuedCount: number;
  activatedCount: number;
  registeredCount: number;
  revokedCount: number;
  expiredCount: number;
  totalCodeCount: number;
  remainingCapacity: number;
};

export type AdminCodeStatusCount = {
  status: CodeStatus;
  count: number;
};

export type AdminCodeStatusRow = {
  inviteCodeId: string;
  status: CodeStatus;
  issuedAt: string | null;
  expiresAt: string | null;
  activatedAt: string | null;
  registeredAt: string | null;
  registered: boolean;
};

export type AdminCodeStatusPage = {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  items: AdminCodeStatusRow[];
};

export type AdminCodeStatusResponse = {
  tenantId: string;
  pilotLaunchId: string;
  pilotLaunchKey: string;
  pilotLaunchName: string;
  pilotLaunchStatus: "PLANNED" | "ACTIVE" | "CLOSED";
  accessPoolId: string;
  accessPoolKey: string;
  accessPoolName: string;
  accessPoolStatus: "PLANNED" | "ACTIVE" | "CLOSED";
  poolCapacity: number;
  summary: AdminCodeStatusSummary;
  statusCounts: AdminCodeStatusCount[];
  codes: AdminCodeStatusPage;
};

export type AdminStatusSource = "fixture" | "live";

export type AdminCodeStatusResult =
  | {
      state: "success";
      source: AdminStatusSource;
      statusFilter: CodeStatus | null;
      data: AdminCodeStatusResponse;
    }
  | {
      state: "empty";
      source: AdminStatusSource;
      statusFilter: CodeStatus | null;
      data: AdminCodeStatusResponse;
      message: string;
    }
  | {
      state: "loading";
      source: AdminStatusSource;
      statusFilter: CodeStatus | null;
    }
  | {
      state: "error";
      source: AdminStatusSource;
      statusFilter: CodeStatus | null;
      message: string;
    };
