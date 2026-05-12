import demoNoviceLessonsSource from "../../../content/fixtures/learning/novice-demo-lessons.v0.1.json" with { type: "json" };
import type { FixtureLesson, LearningFixture } from "./learning-types";

type DemoContentReviewStatus =
  | "raw_imported"
  | "method_adapted"
  | "editorial_review"
  | "financial_review"
  | "legal_review"
  | "hr_wording_review"
  | "pilot_ready"
  | "production_ready";

type DemoLearningFixtureSource = {
  profile: "demo_learning_fixture_v0.1";
  version: string;
  generatedAt: string;
  runtimeBoundary: {
    fixtureRole: "demo_importable_content_fixture";
    productionContentSourceOfTruth: "CMS/PostgreSQL";
    webRuntimeRole: "renderer_adapter_consumer";
    uiCodeOwnsLessonPayload: false;
    publishableFromFixture: false;
  };
  review: {
    reviewStatus: DemoContentReviewStatus;
    productionReady: boolean;
    humanReviewRequired: boolean;
    wordingReviewStatus: "DONE_WITH_HUMAN_PENDING" | "WAITING_HUMAN";
    financialReviewRequired: boolean;
    legalReviewRequired: boolean;
    rewardRulesReviewRequired: boolean;
    notes: string[];
  };
  provenance: {
    activeCourse: string;
    activeSourceRoot: string;
    sourceBriefPath: string;
    sourceManifestPath: string;
    methodologyPath: string;
    sourceInventory: {
      lessonUrls: number;
      markdownLessons: number;
      exportedLessons: number;
      blockedLessons: number;
      humanReviewRequiredLessons: number;
      downloadedAssets: number;
    };
    blockedLessons: string[];
    inactiveSourcesNotUsed: string[];
    lessonSources: Array<{
      routeId: FixtureLesson["routeId"];
      lessonId: string;
      methodologyId: string;
      competencies: string[];
      sourceMaterials: string[];
      sourceHumanReview: "required";
      adaptationStatus: DemoContentReviewStatus;
      adaptationNotes?: string[];
    }>;
  };
  learningFixture: LearningFixture;
  lessons: FixtureLesson[];
};

const importedFixtureSource = demoNoviceLessonsSource as DemoLearningFixtureSource;

assertDemoLearningFixtureSource(importedFixtureSource);

export const learningFixtureSourceBoundary = importedFixtureSource.runtimeBoundary;
export const learningFixtureSourceReview = importedFixtureSource.review;
export const learningFixtureSourceProvenance = importedFixtureSource.provenance;

export const noviceLearningFixture: LearningFixture = importedFixtureSource.learningFixture;

const syntheticLessonFixtures = importedFixtureSource.lessons;

export const syntheticN1LessonFixture = requireSyntheticFixture("N1");
export const syntheticN2LessonFixture = requireSyntheticFixture("N2");
export const syntheticN3LessonFixture = requireSyntheticFixture("N3");

export function getSyntheticLessonFixture(routeId: string): FixtureLesson | undefined {
  const normalizedRouteId = routeId.toUpperCase();

  return syntheticLessonFixtures.find(
    (lesson) => normalizedRouteId === lesson.routeId || normalizedRouteId === lesson.lessonId
  );
}

function requireSyntheticFixture(routeId: FixtureLesson["routeId"]): FixtureLesson {
  const lesson = getSyntheticLessonFixture(routeId);

  if (!lesson) {
    throw new Error(`Missing imported demo lesson fixture: ${routeId}`);
  }

  return lesson;
}

function assertDemoLearningFixtureSource(source: DemoLearningFixtureSource) {
  if (source.runtimeBoundary.productionContentSourceOfTruth !== "CMS/PostgreSQL") {
    throw new Error("Demo learning fixtures must not replace CMS/PostgreSQL as production content source of truth.");
  }

  if (source.runtimeBoundary.webRuntimeRole !== "renderer_adapter_consumer") {
    throw new Error("Web learning fixtures must be consumed through renderer/adapter boundary only.");
  }

  if (source.runtimeBoundary.uiCodeOwnsLessonPayload || source.runtimeBoundary.publishableFromFixture) {
    throw new Error("Demo learning fixtures must not be owned or published from UI runtime code.");
  }

  if (source.review.productionReady || source.review.reviewStatus === "production_ready") {
    throw new Error("Imported demo learning fixtures must not be marked production_ready.");
  }

  if (!source.review.humanReviewRequired) {
    throw new Error("Imported demo learning fixtures require human review.");
  }

  if (source.lessons.length === 0) {
    throw new Error("Imported demo learning fixtures must include at least one lesson.");
  }

  for (const lesson of source.lessons) {
    if (String(lesson.review.reviewStatus) === "production_ready" || !lesson.review.humanReviewRequired) {
      throw new Error(`Imported demo lesson ${lesson.lessonId} must remain human-gated and not production_ready.`);
    }
  }
}
