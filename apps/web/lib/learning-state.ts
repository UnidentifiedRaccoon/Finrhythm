import { noviceLearningFixture } from "./learning-fixtures.ts";
import type { LearningShellResult, LearningState } from "./learning-types";

type SearchValue = string | string[] | undefined;
export type LearningSearchParams = Record<string, SearchValue>;

export function getLearningShellState(params: LearningSearchParams): LearningShellResult {
  const forcedState = normalizeState(first(params.state));

  if (forcedState === "loading") {
    return { state: "loading" };
  }

  if (forcedState === "error") {
    return {
      state: "error",
      message: "Синтетическая ошибка: демо-экран не смог открыть учебный маршрут."
    };
  }

  if (forcedState === "empty") {
    return {
      state: "empty",
      message: "Для демо-режима пока не добавлены уроки. Вернитесь к учебному входу позже."
    };
  }

  return {
    state: "ready",
    fixture: noviceLearningFixture
  };
}

function normalizeState(value: string | undefined): LearningState {
  if (value === "loading" || value === "empty" || value === "error") {
    return value;
  }
  return "ready";
}

function first(value: SearchValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
