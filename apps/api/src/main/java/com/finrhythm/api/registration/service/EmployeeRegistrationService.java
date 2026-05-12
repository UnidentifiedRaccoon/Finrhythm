package com.finrhythm.api.registration.service;

import com.finrhythm.api.registration.domain.EmployeeProfileSession;
import com.finrhythm.api.registration.domain.EmployeeRegistration;
import com.finrhythm.api.registration.domain.RegistrationContact;
import com.finrhythm.api.registration.persistence.EmployeeProfileSessionRepository;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.service.InviteActivationFailureReason;
import com.finrhythm.api.tenant.service.InviteActivationResult;
import com.finrhythm.api.tenant.service.InviteCodeAccessService;
import com.finrhythm.api.tenant.service.InviteCodeActivationException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EmployeeRegistrationService {
    private static final Duration PROFILE_SESSION_TTL = Duration.ofMinutes(15);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final Pattern PROFILE_SESSION_TOKEN = Pattern.compile("^[A-Za-z0-9_-]{32,256}$");

    private final EmployeeRegistrationRepository employeeRegistrationRepository;
    private final EmployeeProfileSessionRepository employeeProfileSessionRepository;
    private final InviteCodeAccessService inviteCodeAccessService;
    private final RegistrationSubjectRefGenerator subjectRefGenerator;
    private final EmployeeProfileSessionTokenService profileSessionTokenService;
    private final Clock clock;

    @Transactional
    public EmployeeRegistrationResult register(EmployeeRegistrationCommand command) {
        RegistrationContact contact = contactFrom(command);
        String inviteLookupHash = inviteLookupHash(command.inviteCode());
        Instant registeredAt = clock.instant();

        return employeeRegistrationRepository.findByInviteLookupHash(inviteLookupHash)
                .map(existingRegistration -> retryExistingRegistration(
                        existingRegistration,
                        contact,
                        command.inviteCode(),
                        registeredAt
                ))
                .orElseGet(() -> createRegistration(command.inviteCode(), contact, registeredAt));
    }

    @Transactional(readOnly = true)
    public EmployeeProfileSummaryResult profileSummary(EmployeeProfileSummaryCommand command) {
        RegistrationContact contact = contactFrom(command);
        String inviteLookupHash = inviteLookupHash(command.inviteCode());
        EmployeeRegistration registration = employeeRegistrationRepository.findByInviteLookupHash(inviteLookupHash)
                .filter(existingRegistration -> existingRegistration.matchesContact(contact))
                .orElseThrow(EmployeeRegistrationService::profileLookupNotFound);
        return toProfileSummary(registration);
    }

    @Transactional
    public EmployeeProfileSessionResult createProfileSession(EmployeeProfileSessionCommand command) {
        RegistrationContact contact = contactFrom(command);
        String inviteLookupHash = inviteLookupHash(command.inviteCode());
        EmployeeRegistration registration = employeeRegistrationRepository.findByInviteLookupHash(inviteLookupHash)
                .filter(existingRegistration -> existingRegistration.matchesContact(contact))
                .orElseThrow(EmployeeRegistrationService::profileLookupNotFound);
        Instant createdAt = clock.instant();
        String rawToken = profileSessionTokenService.generateRawToken();
        EmployeeProfileSession session = EmployeeProfileSession.create(
                registration.getId(),
                profileSessionTokenService.sha256Hex(rawToken),
                createdAt.plus(PROFILE_SESSION_TTL)
        );

        employeeProfileSessionRepository.revokeActiveForRegistration(registration.getId(), createdAt, createdAt);
        employeeProfileSessionRepository.saveAndFlush(session);
        return new EmployeeProfileSessionResult(
                rawToken,
                session.getExpiresAt(),
                registration.getId(),
                registration.getTenantId(),
                registration.getPilotLaunchId(),
                registration.getAccessPoolId(),
                true
        );
    }

    @Transactional(readOnly = true)
    public EmployeeProfileSummaryResult profileSummaryForSession(String authorizationHeader) {
        String rawToken = profileSessionTokenFromAuthorization(authorizationHeader);
        String tokenHash = profileSessionTokenService.sha256Hex(rawToken);
        Instant asOf = clock.instant();
        EmployeeProfileSession session = employeeProfileSessionRepository.findByTokenHash(tokenHash)
                .filter(profileSession -> profileSession.isUsableAt(asOf))
                .orElseThrow(EmployeeRegistrationService::profileSessionAuthenticationRequired);
        EmployeeRegistration registration = employeeRegistrationRepository.findById(session.getEmployeeRegistrationId())
                .orElseThrow(EmployeeRegistrationService::profileLookupNotFound);
        return toProfileSummary(registration);
    }

    private EmployeeRegistrationResult retryExistingRegistration(
            EmployeeRegistration existingRegistration,
            RegistrationContact contact,
            String inviteCode,
            Instant activatedAt
    ) {
        if (!existingRegistration.matchesContact(contact)) {
            throw duplicateInviteCode();
        }
        try {
            inviteCodeAccessService.activate(
                    inviteCode,
                    ActivationSubjectRef.fromSha256Hex(existingRegistration.getActivationSubjectRef()),
                    activatedAt
            );
        } catch (InviteCodeActivationException exception) {
            throw mapInviteFailure(exception);
        }
        return toResult(existingRegistration, true);
    }

    private EmployeeRegistrationResult createRegistration(
            String inviteCode,
            RegistrationContact contact,
            Instant registeredAt
    ) {
        ActivationSubjectRef subjectRef = subjectRefGenerator.generate();
        InviteActivationResult activation = activateInvite(inviteCode, subjectRef, registeredAt);
        EmployeeRegistration registration = EmployeeRegistration.register(
                activation.tenantId(),
                activation.pilotLaunchId(),
                activation.accessPoolId(),
                activation.inviteCodeId(),
                subjectRef,
                contact,
                registeredAt
        );
        try {
            return toResult(employeeRegistrationRepository.saveAndFlush(registration), false);
        } catch (DataIntegrityViolationException exception) {
            throw new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.DUPLICATE_INVITE_CODE,
                    "Invite code is already registered.",
                    exception
            );
        }
    }

    private InviteActivationResult activateInvite(String inviteCode, ActivationSubjectRef subjectRef, Instant activatedAt) {
        try {
            return inviteCodeAccessService.activate(inviteCode, subjectRef, activatedAt);
        } catch (InviteCodeActivationException exception) {
            throw mapInviteFailure(exception);
        }
    }

    private static RegistrationContact contactFrom(EmployeeRegistrationCommand command) {
        return contactFrom(command.fullName(), command.email(), command.phone());
    }

    private static RegistrationContact contactFrom(EmployeeProfileSummaryCommand command) {
        return contactFrom(command.fullName(), command.email(), command.phone());
    }

    private static RegistrationContact contactFrom(EmployeeProfileSessionCommand command) {
        return contactFrom(command.fullName(), command.email(), command.phone());
    }

    private static RegistrationContact contactFrom(String fullName, String email, String phone) {
        try {
            return new RegistrationContact(fullName, email, phone);
        } catch (IllegalArgumentException exception) {
            throw new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.VALIDATION_FAILED,
                    "Registration contact fields are invalid.",
                    exception
            );
        }
    }

    private static String inviteLookupHash(String inviteCode) {
        try {
            return InviteCodeHash.fromEnteredCode(inviteCode).value();
        } catch (IllegalArgumentException exception) {
            throw new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.INVALID_INVITE_CODE,
                    "Invite code is invalid.",
                    exception
            );
        }
    }

    private static EmployeeRegistrationException mapInviteFailure(InviteCodeActivationException exception) {
        return switch (exception.getReason()) {
            case INVALID_CODE -> new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.INVALID_INVITE_CODE,
                    "Invite code is invalid.",
                    exception
            );
            case EXPIRED_CODE -> new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.EXPIRED_INVITE_CODE,
                    "Invite code has expired.",
                    exception
            );
            case REVOKED_CODE -> new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.REVOKED_INVITE_CODE,
                    "Invite code has been revoked.",
                    exception
            );
            case UNISSUED_CODE -> new EmployeeRegistrationException(
                    EmployeeRegistrationFailureReason.UNISSUED_INVITE_CODE,
                    "Invite code is not ready for activation.",
                    exception
            );
            case ALREADY_ACTIVATED_BY_ANOTHER_SUBJECT -> duplicateInviteCode();
        };
    }

    private static EmployeeRegistrationException duplicateInviteCode() {
        return new EmployeeRegistrationException(
                EmployeeRegistrationFailureReason.DUPLICATE_INVITE_CODE,
                "Invite code is already registered."
        );
    }

    private static EmployeeRegistrationException profileLookupNotFound() {
        return new EmployeeRegistrationException(
                HttpStatus.NOT_FOUND,
                EmployeeRegistrationFailureReason.PROFILE_LOOKUP_NOT_FOUND,
                "Registration profile was not found."
        );
    }

    private static EmployeeRegistrationException profileSessionAuthenticationRequired() {
        return new EmployeeRegistrationException(
                HttpStatus.UNAUTHORIZED,
                EmployeeRegistrationFailureReason.PROFILE_SESSION_AUTHENTICATION_REQUIRED,
                "Employee profile session authentication is required."
        );
    }

    private static String profileSessionTokenFromAuthorization(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw profileSessionAuthenticationRequired();
        }
        String rawToken = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        if (!PROFILE_SESSION_TOKEN.matcher(rawToken).matches()) {
            throw profileSessionAuthenticationRequired();
        }
        return rawToken;
    }

    private static EmployeeRegistrationResult toResult(
            EmployeeRegistration registration,
            boolean idempotentRetry
    ) {
        return new EmployeeRegistrationResult(
                registration.getId(),
                registration.getTenantId(),
                registration.getPilotLaunchId(),
                registration.getAccessPoolId(),
                registration.getInviteCodeId(),
                registration.getRegisteredAt(),
                idempotentRetry
        );
    }

    private static EmployeeProfileSummaryResult toProfileSummary(EmployeeRegistration registration) {
        return new EmployeeProfileSummaryResult(
                registration.getId(),
                registration.getFullName(),
                registration.getEmail(),
                registration.getPhone(),
                registration.getTenantId(),
                registration.getPilotLaunchId(),
                registration.getAccessPoolId(),
                registration.getRegisteredAt(),
                true
        );
    }
}
