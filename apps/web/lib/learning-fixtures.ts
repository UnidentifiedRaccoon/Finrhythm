import type { FixtureLesson, LearningFixture } from "./learning-types";

export const noviceLearningFixture: LearningFixture = {
  source: "synthetic",
  trackTitle: "Новичок",
  trackSubtitle: "Семь коротких шагов, чтобы собрать финансовую опору без давления и сравнения.",
  lessons: [
    {
      id: "N1",
      title: "Финансовая опора",
      shortTitle: "Резерв",
      focus: "Выбрать стартовую категорию резерва и правило пополнения.",
      time: "7-9 мин",
      competencyCodes: ["C1", "C2", "C8", "C9"],
      status: "available"
    },
    {
      id: "N2",
      title: "Челлендж накоплений",
      shortTitle: "Регулярность",
      focus: "Выбрать мягкий ритм накоплений на 6 недель.",
      time: "6-8 мин",
      competencyCodes: ["C3", "C8", "C2"],
      status: "next"
    },
    {
      id: "N3",
      title: "Расхламление и безопасная продажа",
      shortTitle: "Ресурсы",
      focus: "Составить короткий список вещей без фото и адресов.",
      time: "6-8 мин",
      competencyCodes: ["C4", "C3", "C9"],
      status: "later"
    },
    {
      id: "N4",
      title: "Одна финансовая цель",
      shortTitle: "Цель",
      focus: "Сформулировать одну цель через тип, срок и первый шаг.",
      time: "8-10 мин",
      competencyCodes: ["C5", "C2", "C3"],
      status: "later"
    },
    {
      id: "N5",
      title: "Налоговые возможности",
      shortTitle: "Чек-лист",
      focus: "Отметить направления, которые стоит проверить на официальных ресурсах.",
      time: "7-9 мин",
      competencyCodes: ["C6", "C9"],
      status: "later"
    },
    {
      id: "N6",
      title: "Психология денег",
      shortTitle: "Спокойное правило",
      focus: "Выбрать один триггер и поддерживающее правило поведения.",
      time: "7-9 мин",
      competencyCodes: ["C7", "C8", "C9"],
      status: "later"
    },
    {
      id: "N7",
      title: "План финансовых привычек",
      shortTitle: "30 дней",
      focus: "Выбрать 1-2 привычки и первую дату check-in.",
      time: "8-10 мин",
      competencyCodes: ["C8", "C1", "C2", "C3", "C5"],
      status: "later"
    }
  ],
  preview: {
    lessonId: "N1",
    title: "Финансовая опора: первый резерв",
    time: "7-9 мин",
    promise: "После превью можно открыть синтетический урок и увидеть безопасный первый шаг без точных личных сумм.",
    situation:
      "Непредвиденный расход появляется не по расписанию. Резерв нужен не для идеальной жизни, а чтобы спокойно выбрать следующий шаг.",
    rule:
      "Начать можно с категории и правила: где будет лежать запас, когда вы вернетесь к нему и как поймете, что шаг посилен.",
    practice:
      "Выберите стартовую категорию резерва и правило пополнения. Точные суммы, фото, документы и банковские скриншоты не нужны.",
    examples: {
      office:
        "Офис: после выплаты я проверяю, какую небольшую часть могу отложить без давления, и отмечаю правило.",
      store:
        "Сменный график: выбираю не дату, а событие - после выплаты или после ближайшей спокойной смены."
    },
    safetyNotes: [
      "Это образовательный демо-материал, а не индивидуальная финансовая рекомендация.",
      "Личные точные суммы и документы не требуются для этого шага.",
      "Прогресс не сравнивается с другими участниками."
    ]
  }
};

export const syntheticN1LessonFixture: FixtureLesson = {
  source: "synthetic",
  routeId: "N1",
  lessonId: "N1_RESERVE_START",
  version: "0.1-synthetic",
  level: "novice",
  title: "Финансовая опора: первый резерв",
  shortTitle: "Резерв",
  userPromise: "Вы выберете стартовую категорию резерва и правило пополнения без точных личных сумм.",
  estimatedTime: "7-9 мин",
  disclaimerType: "education",
  primaryCompetency: "C1",
  secondaryCompetencies: ["C2", "C8", "C9"],
  blocks: [
    {
      blockId: "n1-situation",
      blockType: "situation",
      title: "Ситуация",
      body:
        "Непредвиденный расход появляется не по расписанию: техника ломается, поездка меняется, счет оказывается выше обычного. Резерв нужен не для идеальной жизни, а для спокойного первого шага.",
      sensitiveFlag: false
    },
    {
      blockId: "n1-why",
      blockType: "why",
      title: "Зачем это нужно",
      body:
        "Когда есть небольшой запас, решение не приходится принимать на панике. Можно выбрать понятный вариант и не сравнивать себя с коллегами или знакомыми.",
      sensitiveFlag: false
    },
    {
      blockId: "n1-rule",
      blockType: "rule",
      title: "Правило урока",
      body:
        "Начать можно с категории и правила: где будет лежать запас, в какой момент вы вернетесь к нему и какой шаг сейчас выглядит посильным.",
      sensitiveFlag: false
    },
    {
      blockId: "n1-example",
      blockType: "example",
      title: "Примеры",
      body: "Один принцип можно применить в разном рабочем ритме. Ниже два синтетических варианта без личных данных.",
      sensitiveFlag: false
    },
    {
      blockId: "n1-mini-test",
      blockType: "mini_test",
      title: "Мини-тест",
      body:
        "В этом slice вопросы показаны как локальное превью. Ответы не сохраняются, баллы не начисляются, завершение урока не фиксируется.",
      sensitiveFlag: false
    },
    {
      blockId: "n1-practice",
      blockType: "practice",
      title: "Практика",
      body:
        "Выберите стартовую категорию резерва и правило пополнения. Личные точные суммы, финансовые организации, фото, документы и скриншоты приложений не нужны.",
      ctaLabel: "Выбрать вариант без сохранения",
      sensitiveFlag: true
    },
    {
      blockId: "n1-reward",
      blockType: "reward",
      title: "Награда",
      body:
        "После будущего полноценного прохождения приложение сможет показать учебный прогресс. В этом демо нет начисления points и нет денежного эквивалента.",
      sensitiveFlag: false
    }
  ],
  examples: [
    {
      variant: "office",
      title: "Офис",
      body:
        "После выплаты я выбираю небольшой повторяемый шаг: например, проверить копилку и отметить правило пополнения без давления."
    },
    {
      variant: "store",
      title: "Сменный график",
      body:
        "Если даты плавают, выбираю событие: после выплаты или после ближайшей спокойной смены. Главное - повторяемый момент, а не идеальный календарь."
    }
  ],
  quizItems: [
    {
      quizId: "N1-Q1",
      prompt: "Что лучше всего описывает резерв?",
      options: [
        { id: "a", label: "Деньги на непредвиденную ситуацию, которые можно быстро получить" },
        { id: "b", label: "Любая покупка со скидкой" },
        { id: "c", label: "Дальняя цель без понятного первого шага" }
      ],
      correctOptionId: "a",
      feedbackCorrect: "Да. Для резерва важны доступность и спокойный первый шаг.",
      feedbackIncorrect: "Подумайте о ситуации, где деньги нужны быстро и без лишнего давления.",
      displayOnly: true
    },
    {
      quizId: "N1-Q2",
      prompt: "Что безопасно указать в демо-практике?",
      options: [
        { id: "a", label: "Точные личные поступления и финансовая организация" },
        { id: "b", label: "Категорию суммы или правило пополнения" },
        { id: "c", label: "Скриншот банковского приложения" }
      ],
      correctOptionId: "b",
      feedbackCorrect: "Верно. Для учебного шага достаточно категории или правила.",
      feedbackIncorrect: "В этом MVP точные суммы и скриншоты приложений не нужны.",
      displayOnly: true
    },
    {
      quizId: "N1-Q3",
      prompt: "Почему резерв не стоит смешивать с целью на отпуск?",
      options: [
        { id: "a", label: "Резерв нужен для неожиданностей, цель - для запланированной покупки" },
        { id: "b", label: "Так можно гарантировать любой результат" },
        { id: "c", label: "Работодатель должен видеть обе суммы" }
      ],
      correctOptionId: "a",
      feedbackCorrect: "Верно. Разные задачи лучше не смешивать.",
      feedbackIncorrect: "Резерв не обещает результата и не является отчетом работодателю.",
      displayOnly: true
    }
  ],
  practiceTask: {
    taskId: "N1-PRACTICE-START-RESERVE",
    taskType: "simple_calculation_range",
    prompt: "Выберите категорию стартового резерва и одно правило пополнения.",
    completionCriteria: "Для демо достаточно выбрать вариант в голове или на экране; данные не сохраняются.",
    allowedInputs: [
      "категория стартовой суммы",
      "правило пополнения",
      "вариант: пока выберу только правило"
    ],
    forbiddenInputs: [
      "точные личные поступления",
      "точный размер обязательства",
      "остаток личного счета",
      "название финансовой организации",
      "фото",
      "документ",
      "скриншот приложения"
    ],
    privacyCopy:
      "Это не отчет работодателю. В этом демо не сохраняются личные суммы, документы, фото или данные финансового сервиса.",
    userCanSkipExactValues: true,
    storesExactSum: false,
    requiresPhoto: false,
    requiresDocument: false,
    requiresBankScreenshot: false
  },
  reward: {
    title: "Что будет дальше",
    body:
      "В будущей полной версии здесь появится учебная отметка прогресса после проверки правил завершения. В этом демо прогресс и баллы не сохраняются.",
    pointsLabel: "Демо без начисления баллов",
    noMoneyEquivalentCopy: "Баллы не являются деньгами, зарплатой, выплатой или обязательным призом."
  },
  sensitiveDataPolicy: [
    "Синтетический урок не использует реальные данные сотрудников или заказчиков.",
    "Личные точные суммы, финансовые организации, фото, документы и скриншоты приложений не требуются.",
    "Личные ответы и слабые зоны не показываются HR как персональный отчет."
  ],
  review: {
    reviewStatus: "editorial_draft",
    humanReviewRequired: true,
    notes: [
      "Финальная финансовая корректность урока остается human gate.",
      "Это renderer fixture, а не production_ready публикация контента.",
      "Налоговые, кредитные и инвестиционные рекомендации не входят в этот урок."
    ]
  }
};

export const syntheticN2LessonFixture: FixtureLesson = {
  source: "synthetic",
  routeId: "N2",
  lessonId: "N2_SAVINGS_CHALLENGE_START",
  version: "0.1-synthetic",
  level: "novice",
  title: "Челлендж накоплений: начните копить играючи",
  shortTitle: "Регулярность",
  userPromise:
    "Вы выберете реалистичный формат 6-недельного накопительного challenge и первый check-in без точных личных сумм.",
  estimatedTime: "6-8 мин",
  disclaimerType: "education",
  primaryCompetency: "C3",
  secondaryCompetencies: ["C8", "C2"],
  blocks: [
    {
      blockId: "n2-situation",
      blockType: "situation",
      title: "Ситуация",
      body:
        "Копить с понедельника легко начать и легко бросить. Поэтому в MVP мы делаем не идеальный план, а 6 недель маленьких check-in в своем ритме.",
      sensitiveFlag: false
    },
    {
      blockId: "n2-why",
      blockType: "why",
      title: "Зачем это нужно",
      body:
        "Регулярность помогает увидеть движение и не ждать идеального дохода. Маленький повторяемый шаг снижает давление и помогает вернуться после пропуска.",
      sensitiveFlag: false
    },
    {
      blockId: "n2-rule",
      blockType: "rule",
      title: "Правило урока",
      body:
        "Выберите формат, который реально повторять: одинаковый еженедельный шаг, растущий шаг, округление трат или пополнение после дохода.",
      sensitiveFlag: false
    },
    {
      blockId: "n2-example",
      blockType: "example",
      title: "Примеры",
      body:
        "Один challenge может жить в разном рабочем ритме. Важно выбрать повторяемый момент, а не идеальный календарь.",
      sensitiveFlag: false
    },
    {
      blockId: "n2-mini-test",
      blockType: "mini_test",
      title: "Мини-тест",
      body:
        "В этом slice вопросы показаны как локальное превью. Ответы не сохраняются, баллы не начисляются, запуск challenge не фиксируется.",
      sensitiveFlag: false
    },
    {
      blockId: "n2-practice",
      blockType: "practice",
      title: "Практика",
      body:
        "Выберите формат накоплений, категорию цели и первый check-in. Точные суммы, доход, остатки на счетах, фото, документы и банковские скриншоты не нужны.",
      ctaLabel: "Выбрать формат без сохранения",
      sensitiveFlag: true
    },
    {
      blockId: "n2-reward",
      blockType: "reward",
      title: "Награда",
      body:
        "В будущей полной версии старт challenge сможет показать учебный прогресс. В этом демо нет начисления points, обещания накопить сумму или денежного эквивалента.",
      sensitiveFlag: false
    }
  ],
  examples: [
    {
      variant: "office",
      title: "Офис",
      body:
        "Каждую пятницу после обеда я проверяю копилку и отмечаю check-in. Если выплаты два раза в месяц, можно выбрать пополнение после каждой выплаты."
    },
    {
      variant: "store",
      title: "Сменный график",
      body:
        "Если смены плавают, выбираю событие: после первой выплаты недели или после последней спокойной смены. Главное - повторяемый момент."
    }
  ],
  quizItems: [
    {
      quizId: "N2-Q1",
      prompt: "Почему маленькие регулярные накопления могут работать?",
      options: [
        { id: "a", label: "Они снижают барьер старта и тренируют повторение" },
        { id: "b", label: "Они гарантируют одинаковый результат всем участникам" },
        { id: "c", label: "Они заменяют финансовую цель" }
      ],
      correctOptionId: "a",
      feedbackCorrect: "Да. Маленький шаг легче повторить, чем ждать идеального момента.",
      feedbackIncorrect: "Challenge помогает ритму, но не обещает одинаковый результат для всех.",
      displayOnly: true
    },
    {
      quizId: "N2-Q2",
      prompt: "Что делать, если пропустили неделю?",
      options: [
        { id: "a", label: "Считать прошлые шаги бесполезными" },
        { id: "b", label: "Вернуться к следующему check-in или выбрать догоняющий шаг" },
        { id: "c", label: "Загрузить банковский скриншот как доказательство" }
      ],
      correctOptionId: "b",
      feedbackCorrect: "Верно. Пропуск - не провал, а точка возврата.",
      feedbackIncorrect: "В этом MVP не нужны доказательства и скриншоты. Достаточно мягко вернуться.",
      displayOnly: true
    },
    {
      quizId: "N2-Q3",
      prompt: "Какой формат накоплений лучше выбрать?",
      options: [
        { id: "a", label: "Тот, который реально повторять в своем ритме" },
        { id: "b", label: "Самый жесткий, даже если он вызывает давление" },
        { id: "c", label: "Тот, который виден работодателю персонально" }
      ],
      correctOptionId: "a",
      feedbackCorrect: "Да. Лучший формат - повторяемый и спокойный.",
      feedbackIncorrect: "Маршрут не должен превращаться в контроль или гонку.",
      displayOnly: true
    },
    {
      quizId: "N2-Q4",
      prompt: "Что нельзя считать гарантией результата?",
      options: [
        { id: "a", label: "Учебный challenge и внутренние баллы" },
        { id: "b", label: "Выбранный формат check-in" },
        { id: "c", label: "Напоминание в приложении" }
      ],
      correctOptionId: "a",
      feedbackCorrect: "Верно. Challenge поддерживает ритм, но не гарантирует сумму или приз.",
      feedbackIncorrect: "Баллы и challenge - учебные механики без денежного эквивалента.",
      displayOnly: true
    }
  ],
  practiceTask: {
    taskId: "N2-PRACTICE-SAVINGS-CHALLENGE-START",
    taskType: "choice",
    prompt: "Выберите формат 6-недельного challenge и первую категорию check-in.",
    completionCriteria: "Для демо достаточно выбрать вариант в голове или на экране; данные не сохраняются.",
    allowedInputs: [
      "формат накоплений",
      "категория цели",
      "первый check-in",
      "вариант: пока просто копилка"
    ],
    forbiddenInputs: [
      "точный доход",
      "точный размер долга",
      "остаток личного счета",
      "название финансовой организации",
      "фото",
      "документ",
      "банковский скриншот"
    ],
    privacyCopy:
      "Это не отчет работодателю. В этом демо не сохраняются суммы, выбранная цель, напоминание, документы, фото или данные финансового сервиса.",
    userCanSkipExactValues: true,
    storesExactSum: false,
    requiresPhoto: false,
    requiresDocument: false,
    requiresBankScreenshot: false
  },
  reward: {
    title: "Что будет дальше",
    body:
      "В будущей полной версии здесь появится отметка старта challenge после проверки правил завершения. В этом демо старт, прогресс и баллы не сохраняются.",
    pointsLabel: "Демо без начисления баллов",
    noMoneyEquivalentCopy: "Баллы не являются деньгами, зарплатой, выплатой, гарантией накоплений или обязательным призом."
  },
  sensitiveDataPolicy: [
    "Синтетический урок не использует реальные данные сотрудников или заказчиков.",
    "Точные суммы накоплений, доход, остатки на счетах, фото, документы и банковские скриншоты не требуются.",
    "Выбранная цель, check-in и слабые зоны не показываются HR как персональный отчет."
  ],
  review: {
    reviewStatus: "editorial_draft",
    humanReviewRequired: true,
    notes: [
      "Финальная финансовая корректность урока остается human gate.",
      "Это renderer fixture, а не production_ready публикация контента.",
      "Reward economy, challenge rules and fulfillment remain human-gated."
    ]
  }
};

const syntheticLessonFixtures = [syntheticN1LessonFixture, syntheticN2LessonFixture];

export function getSyntheticLessonFixture(routeId: string): FixtureLesson | undefined {
  const normalizedRouteId = routeId.toUpperCase();

  return syntheticLessonFixtures.find(
    (lesson) => normalizedRouteId === lesson.routeId || normalizedRouteId === lesson.lessonId
  );
}
