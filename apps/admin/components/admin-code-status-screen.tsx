import Link from "next/link";
import { CODE_STATUSES, type AdminCodeStatusResult, type CodeStatus } from "../lib/code-status-types";
import { ACCESS_POOL_STATUS_LABELS, STATUS_HINTS, STATUS_LABELS } from "./status-labels";
import { StatusErrorView, StatusLoadingView } from "./status-states";

type ScreenProps = {
  result: AdminCodeStatusResult;
};

export function AdminCodeStatusScreen({ result }: ScreenProps) {
  if (result.state === "loading") {
    return <StatusLoadingView />;
  }
  if (result.state === "error") {
    return <StatusErrorView message={result.message} />;
  }

  const data = result.data;
  const activationRate = percent(data.summary.activatedCount, data.summary.issuedCount);
  const registrationRate = percent(data.summary.registeredCount, data.summary.issuedCount);

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="topline">
          <div>
            <p className="eyebrow">Операторский доступ</p>
            <h1>Статус кодов пула доступа</h1>
          </div>
          <div className="topline-meta">
            <span className="source-pill">
              Источник: {result.source === "fixture" ? "синтетический fixture" : "live, только чтение"}
            </span>
            <span className="privacy-note">
              Экран не показывает значения кодов, контакты сотрудников или чувствительные учебные данные.
            </span>
          </div>
        </header>

        <section className="meta-grid" aria-label="Сведения о запуске и пуле доступа">
          <MetaCell label="ID контура" value={shortId(data.tenantId)} mono />
          <MetaCell label="ID запуска" value={shortId(data.pilotLaunchId)} mono />
          <MetaCell label="Пул доступа" value={`${data.accessPoolName} · ${data.accessPoolKey}`} />
          <MetaCell label="План / статус" value={`${data.poolCapacity} · ${ACCESS_POOL_STATUS_LABELS[data.accessPoolStatus]}`} />
        </section>

        <section className="metrics-grid" aria-label="Сводка">
          <Metric label="выдано" value={data.summary.issuedCount} />
          <Metric label="активировано" value={data.summary.activatedCount} />
          <Metric label="регистраций" value={data.summary.registeredCount} />
          <Metric label="отозвано" value={data.summary.revokedCount} />
          <Metric label="истекло" value={data.summary.expiredCount} />
          <Metric label="всего записей" value={data.summary.totalCodeCount} />
          <Metric label="резерв" value={data.summary.remainingCapacity} />
        </section>

        <section className="toolbar" aria-label="Фильтр статусов">
          <p className="toolbar-title">
            <strong>Воронка: {activationRate} активировано, {registrationRate} зарегистрировано</strong>
            <span>
              Страница {data.codes.page + 1} из {Math.max(data.codes.totalPages, 1)}, размер {data.codes.size}
            </span>
          </p>
          <nav className="filter-row" aria-label="Статусы кодов">
            <FilterLink status={null} active={result.statusFilter === null} />
            {CODE_STATUSES.map((status) => (
              <FilterLink key={status} status={status} active={result.statusFilter === status} />
            ))}
          </nav>
        </section>

        <section className="status-grid" aria-label="Количество по статусам">
          {data.statusCounts.map((item) => (
            <div className="status-cell" key={item.status}>
              <span className={`status-badge status-${item.status.toLowerCase()}`}>
                {STATUS_LABELS[item.status]}
              </span>
              <strong>{formatNumber(item.count)}</strong>
              <span className="label">{STATUS_HINTS[item.status]}</span>
            </div>
          ))}
        </section>

        {result.state === "empty" ? (
          <section className="empty-band">
            <h2>Нет строк для отображения</h2>
            <p>{result.message}</p>
          </section>
        ) : (
          <CodeRows result={result} />
        )}

        <Pager
          page={data.codes.page}
          totalPages={data.codes.totalPages}
          status={result.statusFilter}
          size={data.codes.size}
        />
      </div>
    </main>
  );
}

function CodeRows({ result }: { result: Extract<AdminCodeStatusResult, { state: "success" }> }) {
  return (
    <section className="table-wrap" aria-label="Служебные строки кодов">
      <table>
        <thead>
          <tr>
            <th scope="col">ID записи</th>
            <th scope="col">Статус</th>
            <th scope="col">Выдан</th>
            <th scope="col">Срок</th>
            <th scope="col">Активация</th>
            <th scope="col">Регистрация</th>
            <th scope="col">Связь</th>
          </tr>
        </thead>
        <tbody>
          {result.data.codes.items.map((row) => (
            <tr key={row.inviteCodeId}>
              <td className="row-id mono">{shortId(row.inviteCodeId)}</td>
              <td>
                <span className={`status-badge status-${row.status.toLowerCase()}`}>
                  {STATUS_LABELS[row.status]}
                </span>
              </td>
              <td>{formatDate(row.issuedAt)}</td>
              <td>{formatDate(row.expiresAt)}</td>
              <td>{formatDate(row.activatedAt)}</td>
              <td>{formatDate(row.registeredAt)}</td>
              <td className={row.registered ? "yes" : "no"}>{row.registered ? "есть" : "нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function MetaCell({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="meta-cell">
      <span className="label">{label}</span>
      <span className={`value ${mono ? "mono" : ""}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-cell">
      <strong>{formatNumber(value)}</strong>
      <span>{label}</span>
    </div>
  );
}

function FilterLink({ status, active }: { status: CodeStatus | null; active: boolean }) {
  const label = status ? STATUS_LABELS[status] : "Все";
  const href = status ? `/?status=${status}` : "/";

  return (
    <Link className="filter-link" href={href} aria-current={active ? "true" : undefined}>
      {label}
    </Link>
  );
}

function Pager({
  page,
  totalPages,
  status,
  size
}: {
  page: number;
  totalPages: number;
  status: CodeStatus | null;
  size: number;
}) {
  const lastPage = Math.max(totalPages - 1, 0);
  const previous = Math.max(page - 1, 0);
  const next = Math.min(page + 1, lastPage);

  return (
    <nav className="pager" aria-label="Пагинация">
      {page > 0 ? (
        <Link href={pageHref(previous, status, size)}>Предыдущая</Link>
      ) : (
        <span>Предыдущая</span>
      )}
      <span>
        {page + 1} / {Math.max(totalPages, 1)}
      </span>
      {page < lastPage ? (
        <Link href={pageHref(next, status, size)}>Следующая</Link>
      ) : (
        <span>Следующая</span>
      )}
    </nav>
  );
}

function pageHref(page: number, status: CodeStatus | null, size: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(Math.min(size, 100)));
  if (status) {
    params.set("status", status);
  }
  return `/?${params.toString()}`;
}

function shortId(value: string) {
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return <span className="date-muted">не указано</span>;
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "2-digit"
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function percent(part: number, total: number) {
  if (total <= 0) {
    return "0%";
  }
  return `${Math.round((part / total) * 100)}%`;
}
