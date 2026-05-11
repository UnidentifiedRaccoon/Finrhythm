import Link from "next/link";

export function StatusLoadingView() {
  return (
    <main className="state-page">
      <section className="state-panel" aria-busy="true">
        <p className="eyebrow">Операторская проверка</p>
        <h1>Загружаем статус пула доступа</h1>
        <p>Экран показывает только агрегированные счетчики и служебные ID записей.</p>
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </section>
    </main>
  );
}

export function StatusErrorView({
  message,
  onRetry
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <main className="state-page">
      <section className="state-panel" role="alert">
        <p className="eyebrow">Статус недоступен</p>
        <h1>Не удалось открыть статус пула доступа</h1>
        <p>{message}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Повторить
          </button>
        ) : (
          <Link className="state-link" href="/">
            Вернуться к списку
          </Link>
        )}
      </section>
    </main>
  );
}
