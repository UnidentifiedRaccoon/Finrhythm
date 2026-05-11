import { AdminCodeStatusScreen } from "../components/admin-code-status-screen";
import { getAdminCodeStatus } from "../lib/code-status-client";

type SearchValue = string | string[] | undefined;
type SearchParams = Record<string, SearchValue>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function AdminHome({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const result = await getAdminCodeStatus(resolvedSearchParams);

  return <AdminCodeStatusScreen result={result} />;
}
