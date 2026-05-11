package com.finrhythm.api.admin.readmodel;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "AdminCodeStatusPage")
public record AdminCodeStatusPage(
        @Schema(example = "0")
        int page,

        @Schema(example = "50")
        int size,

        @Schema(example = "500")
        long totalItems,

        @Schema(example = "10")
        int totalPages,

        List<AdminCodeStatusRow> items
) {
}
