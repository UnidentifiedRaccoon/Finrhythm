package com.finrhythm.api.learning.domain;

import java.util.List;

public final class LearningN1LessonDetailDraft {
    private LearningN1LessonDetailDraft() {
    }

    public static LearningLessonDetail detail() {
        return new LearningLessonDetail(
                "N1",
                "N1: первый резерв",
                "Первый резерв",
                "Новичок: финансовая опора",
                "После урока вы сможете выбрать маленький первый шаг для резерва и правило пополнения без раскрытия точных сумм.",
                "7-9 минут",
                List.of("C1", "C2", "C8", "C9"),
                "education",
                review(),
                provenance(),
                sensitiveDataPolicy(),
                blocks()
        );
    }

    private static LearningLessonReview review() {
        return new LearningLessonReview(
                "method_adapted",
                true,
                false,
                "required",
                "required",
                "required",
                "required",
                List.of(
                        "Черновик адаптирован под mobile microlearning и требует human review до production-ready публикации.",
                        "Финансовые формулировки, юридические границы и HR wording остаются открытыми human gates.",
                        "Материал используется только как образовательная N1 continuation после безопасной диагностики и старта урока."
                )
        );
    }

    private static LearningLessonProvenance provenance() {
        return new LearningLessonProvenance(
                "docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md#n1",
                "content/getcourse-finstrategy/",
                "content/getcourse-finstrategy/CONTENT_BRIEF.md",
                "content/getcourse-finstrategy/content-baseline.manifest.json",
                List.of(new LearningLessonSourceRef(
                        "content/getcourse-finstrategy/24-lesson-235010163.md",
                        "04.02 Формирование резервного фонда",
                        "required"
                ))
        );
    }

    private static LearningLessonSensitiveDataPolicy sensitiveDataPolicy() {
        return new LearningLessonSensitiveDataPolicy(
                List.of(
                        "точные доходы, долги, остатки на счетах и номера счетов",
                        "фото, документы и банковские скриншоты",
                        "названия финансовых сервисов, которыми вы пользуетесь",
                        "свободный отчёт о личной финансовой ситуации"
                ),
                "Личные ответы диагностики и учебные выборы не становятся персональным HR-отчётом.",
                "Материал является образовательным и не заменяет финансовую, налоговую, кредитную, инвестиционную или юридическую консультацию."
        );
    }

    private static List<LearningLessonBlock> blocks() {
        return List.of(
                new LearningLessonBlock(
                        "N1-SITUATION",
                        "situation",
                        "Почему резерв начинается с маленького шага",
                        "Резерв нужен не для идеальной финансовой картины, а для спокойного первого запаса на неожиданную ситуацию. В MVP достаточно выбрать понятный старт и не превращать урок в отчёт о личных деньгах.",
                        true,
                        false,
                        null
                ),
                new LearningLessonBlock(
                        "N1-WHY",
                        "why",
                        "Что даёт первый резерв",
                        "Даже небольшой отдельный запас помогает не принимать срочные решения под давлением. Цель урока - выбрать реалистичное правило, которое можно повторять.",
                        true,
                        false,
                        null
                ),
                new LearningLessonBlock(
                        "N1-RULE",
                        "rule",
                        "Правило: доступность важнее доходности",
                        "Резерв должен быть понятным, доступным и безопасным. На этом шаге мы не выбираем продукты и не сравниваем ставки: пользователь фиксирует только принцип и первый удобный ритм.",
                        true,
                        false,
                        null
                ),
                new LearningLessonBlock(
                        "N1-EXAMPLE",
                        "example",
                        "Два рабочих примера",
                        "Офисный сотрудник может настроить небольшой перевод после зарплаты. Сотрудник со сменным графиком может выбрать еженедельный ритм или пополнение после дополнительной смены.",
                        true,
                        false,
                        null
                ),
                new LearningLessonBlock(
                        "N1-PRACTICE-PREVIEW",
                        "practice",
                        "Практический шаг без точных данных",
                        "Выберите категорию стартового резерва и правило пополнения. Точный доход, долг, банк, выписка или скриншот не нужны для этого урока.",
                        true,
                        true,
                        "Выбрать правило позже"
                )
        );
    }
}
