package com.finrhythm.api.admin.readmodel;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "AdminCodeStatusPage", description = "Page of privacy-safe invite-code status rows.")
public record AdminCodeStatusPage(
        @Schema(description = "Zero-based page index.", example = "0")
        int page,

        @Schema(description = "Page size.", example = "50")
        int size,

        @Schema(description = "Total rows matching the request.", example = "500")
        long totalItems,

        @Schema(description = "Total pages matching the request.", example = "10")
        int totalPages,

        @ArraySchema(
                schema = @Schema(implementation = AdminCodeStatusRow.class),
                arraySchema = @Schema(description = "Invite-code rows without lookup hashes, raw codes or employee PII.")
        )
        List<AdminCodeStatusRow> items
) {
}
