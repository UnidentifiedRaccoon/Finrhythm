import { getSyntheticLessonFixture } from "./learning-fixtures.ts";
import type { LessonRendererResult } from "./learning-types";

export function getLessonRendererState(lessonId: string | undefined): LessonRendererResult {
  if (!lessonId) {
    return {
      state: "empty",
      message: "Для демо-режима не выбран синтетический урок."
    };
  }

  const lesson = getSyntheticLessonFixture(lessonId);

  if (!lesson) {
    return {
      state: "empty",
      message: "Такого синтетического урока пока нет в fixture-наборе."
    };
  }

  return {
    state: "ready",
    lesson
  };
}
