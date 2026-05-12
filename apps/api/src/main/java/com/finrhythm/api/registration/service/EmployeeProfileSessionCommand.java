package com.finrhythm.api.registration.service;

public record EmployeeProfileSessionCommand(
        String fullName,
        String email,
        String phone,
        String inviteCode
) {
}
