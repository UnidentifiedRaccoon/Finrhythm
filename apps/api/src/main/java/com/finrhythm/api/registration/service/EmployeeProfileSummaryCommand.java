package com.finrhythm.api.registration.service;

public record EmployeeProfileSummaryCommand(
        String fullName,
        String email,
        String phone,
        String inviteCode
) {
}
