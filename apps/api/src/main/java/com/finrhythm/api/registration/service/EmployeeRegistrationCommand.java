package com.finrhythm.api.registration.service;

public record EmployeeRegistrationCommand(
        String fullName,
        String email,
        String phone,
        String inviteCode
) {
}
