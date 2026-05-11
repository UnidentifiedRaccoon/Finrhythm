import { LearningEmptyView } from "../../../../components/learning-shell";
import { LessonRendererScreen } from "../../../../components/lesson-renderer";
import { getLessonRendererState } from "../../../../lib/lesson-state";

type PageProps = {
  params?: Promise<{
    lessonId?: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const resolvedParams = (await params) ?? {};
  const result = getLessonRendererState(resolvedParams.lessonId);

  if (result.state === "empty") {
    return <LearningEmptyView message={result.message} />;
  }

  return <LessonRendererScreen lesson={result.lesson} />;
}
