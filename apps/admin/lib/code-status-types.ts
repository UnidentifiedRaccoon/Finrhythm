import type { AdminCodeStatusResponse, InviteCodeStatus } from "@finrhythm/api-client";

export {
  INVITE_CODE_STATUSES as CODE_STATUSES
} from "@finrhythm/api-client";

export type {
  AdminCodeStatusCount,
  AdminCodeStatusPage,
  AdminCodeStatusRow,
  AdminCodeStatusSummary
} from "@finrhythm/api-client";

export type { AdminCodeStatusResponse };
export type CodeStatus = InviteCodeStatus;

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
