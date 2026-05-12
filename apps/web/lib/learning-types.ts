export type LessonStatus = "available" | "next" | "later";

export type NoviceLesson = {
  id: `N${number}`;
  title: string;
  shortTitle: string;
  focus: string;
  time: string;
  competencyCodes: string[];
  status: LessonStatus;
};

export type LessonPreview = {
  lessonId: string;
  title: string;
  time: string;
  promise: string;
  situation: string;
  rule: string;
  practice: string;
  examples: {
    office: string;
    store: string;
  };
  safetyNotes: string[];
};

export type LessonBlockType = "situation" | "why" | "rule" | "example" | "mini_test" | "practice" | "reward";

export type LessonBlock = {
  blockId: string;
  blockType: LessonBlockType;
  title: string;
  body: string;
  ctaLabel?: string;
  sensitiveFlag: boolean;
};

export type LessonExampleVariant = {
  variant: "office" | "store";
  title: string;
  body: string;
};

export type LessonQuizOption = {
  id: string;
  label: string;
};

export type LessonQuizItem = {
  quizId: string;
  prompt: string;
  options: LessonQuizOption[];
  correctOptionId: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  displayOnly: true;
};

export type LessonPracticeTask = {
  taskId: string;
  taskType: "choice" | "checklist" | "simple_calculation_range" | "reflection";
  prompt: string;
  completionCriteria: string;
  allowedInputs: string[];
  forbiddenInputs: string[];
  privacyCopy: string;
  userCanSkipExactValues: true;
  storesExactSum: false;
  requiresPhoto: false;
  requiresDocument: false;
  requiresBankScreenshot: false;
};

export type LessonReward = {
  title: string;
  body: string;
  pointsLabel: string;
  noMoneyEquivalentCopy: string;
};

export type LessonReviewStatusValue =
  | "raw_imported"
  | "method_adapted"
  | "editorial_review"
  | "financial_review"
  | "legal_review"
  | "hr_wording_review"
  | "pilot_ready";

export type LessonReviewStatus = {
  reviewStatus: LessonReviewStatusValue;
  humanReviewRequired: true;
  notes: string[];
};

export type FixtureLesson = {
  source: "synthetic";
  routeId: `N${number}`;
  lessonId: string;
  version: string;
  level: "novice";
  title: string;
  shortTitle: string;
  userPromise: string;
  estimatedTime: string;
  disclaimerType: "education";
  primaryCompetency: string;
  secondaryCompetencies: string[];
  blocks: LessonBlock[];
  examples: LessonExampleVariant[];
  quizItems: LessonQuizItem[];
  practiceTask: LessonPracticeTask;
  reward: LessonReward;
  sensitiveDataPolicy: string[];
  review: LessonReviewStatus;
};

export type LearningFixture = {
  source: "synthetic";
  trackTitle: string;
  trackSubtitle: string;
  lessons: NoviceLesson[];
  preview: LessonPreview;
};

export type LearningState = "ready" | "loading" | "empty" | "error";

export type LearningShellResult =
  | {
      state: "ready";
      fixture: LearningFixture;
    }
  | {
      state: "empty";
      message: string;
    }
  | {
      state: "loading";
    }
  | {
      state: "error";
      message: string;
    };

export type LessonRendererResult =
  | {
      state: "ready";
      lesson: FixtureLesson;
    }
  | {
      state: "empty";
      message: string;
    };
