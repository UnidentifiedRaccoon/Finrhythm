"use client";

import { StatusErrorView } from "../components/status-states";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusErrorView
      message={error.message || "Не удалось открыть статус пула доступа."}
      onRetry={reset}
    />
  );
}
