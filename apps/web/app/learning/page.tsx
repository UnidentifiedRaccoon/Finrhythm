import { LearningShellScreen } from "../../components/learning-shell";
import { getLearningShellState, type LearningSearchParams } from "../../lib/learning-state";

type PageProps = {
  searchParams?: Promise<LearningSearchParams>;
};

export default async function LearningPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const result = getLearningShellState(resolvedSearchParams);

  return <LearningShellScreen result={result} />;
}
