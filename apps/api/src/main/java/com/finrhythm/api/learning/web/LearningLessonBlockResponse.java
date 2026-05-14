package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LearningLessonBlockResponse", description = "Display-only lesson block without submissions, scoring or answer keys.")
public record LearningLessonBlockResponse(
        @Schema(description = "Stable display block id.", example = "N1-SITUATION")
        String blockId,
        @Schema(description = "Display block type.", example = "situation")
        String blockType,
        @Schema(description = "Block title shown in the mounted lesson continuation.")
        String title,
        @Schema(description = "Safe educational display copy.")
        String body,
        @Schema(description = "True because lesson detail reads never submit or score block interactions.")
        boolean displayOnly,
        @Schema(description = "True when the block repeats the no-exact-sensitive-data boundary.")
        boolean sensitiveDataNotice,
        @Schema(description = "Optional disabled/display CTA label.", nullable = true)
        String ctaLabel
) {
}
