"use client";

import { LearningErrorView } from "../components/learning-shell";

export default function Error({
  error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <LearningErrorView message={error.message || "Не удалось открыть обучение."} />;
}
