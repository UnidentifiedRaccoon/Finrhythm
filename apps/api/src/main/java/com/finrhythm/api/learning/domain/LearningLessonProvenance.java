package com.finrhythm.api.learning.domain;

import java.util.List;

public record LearningLessonProvenance(
        String methodologyRef,
        String activeSourceRoot,
        String contentBriefRef,
        String sourceManifestRef,
        List<LearningLessonSourceRef> sourceRefs
) {
    public LearningLessonProvenance {
        sourceRefs = List.copyOf(sourceRefs);
    }
}
