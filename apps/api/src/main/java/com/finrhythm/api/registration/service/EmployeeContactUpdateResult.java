package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EmployeeContactUpdateResult(
        UUID employeeRegistrationId,
        String fullName,
        String email,
        String phone,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        Instant registeredAt,
        boolean changed,
        String outcome,
        List<String> changedFields,
        boolean contactVerifiedByProfileSession
) {
    public EmployeeContactUpdateResult {
        changedFields = List.copyOf(changedFields);
    }
}
