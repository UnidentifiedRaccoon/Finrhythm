package com.finrhythm.api.registration.service;

import com.finrhythm.api.registration.domain.EmployeeProfileSession;
import com.finrhythm.api.registration.domain.EmployeeRegistration;
import com.finrhythm.api.registration.domain.RegistrationContact;
import com.finrhythm.api.registration.persistence.EmployeeProfileSessionRepository;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.registration.service.EmployeeContactUpdateAuditService.ContactUpdateAuditEvent;
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
import java.util.ArrayList;
import java.util.List;
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
    private final EmployeeContactUpdateAuditService employeeContactUpdateAuditService;
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
        return toProfileSummary(authenticateProfileSession(authorizationHeader).registration());
    }

    @Transactional
    public EmployeeContactUpdateResult updateContactForSession(
            String authorizationHeader,
            EmployeeContactUpdateCommand command
    ) {
        AuthenticatedProfileSession authenticated = authenticateProfileSession(authorizationHeader);
        EmployeeRegistration registration = authenticated.registration();
        ContactUpdate contactUpdate = contactUpdateFrom(registration, command);
        Instant occurredAt = clock.instant();

        if (contactUpdate.changed()) {
            registration.updateContact(contactUpdate.newEmail(), contactUpdate.newPhone());
        }

        employeeContactUpdateAuditService.record(new ContactUpdateAuditEvent(
                occurredAt,
                registration.getId(),
                registration.getTenantId(),
                registration.getPilotLaunchId(),
                registration.getAccessPoolId(),
                contactUpdate.changedFields(),
                contactUpdate.outcome(),
                contactUpdate.oldEmail(),
                contactUpdate.newEmail(),
                contactUpdate.oldPhone(),
                contactUpdate.newPhone(),
                authenticated.session().getId()
        ));

        return new EmployeeContactUpdateResult(
                registration.getId(),
                registration.getFullName(),
                contactUpdate.newEmail(),
                contactUpdate.newPhone(),
                registration.getTenantId(),
                registration.getPilotLaunchId(),
                registration.getAccessPoolId(),
                registration.getRegisteredAt(),
                contactUpdate.changed(),
                contactUpdate.outcome(),
                contactUpdate.changedFields(),
                true
        );
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

    private AuthenticatedProfileSession authenticateProfileSession(String authorizationHeader) {
        String rawToken = profileSessionTokenFromAuthorization(authorizationHeader);
        String tokenHash = profileSessionTokenService.sha256Hex(rawToken);
        Instant asOf = clock.instant();
        EmployeeProfileSession session = employeeProfileSessionRepository.findByTokenHash(tokenHash)
                .filter(profileSession -> profileSession.isUsableAt(asOf))
                .orElseThrow(EmployeeRegistrationService::profileSessionAuthenticationRequired);
        EmployeeRegistration registration = employeeRegistrationRepository.findById(session.getEmployeeRegistrationId())
                .orElseThrow(EmployeeRegistrationService::profileLookupNotFound);
        return new AuthenticatedProfileSession(session, registration);
    }

    private static ContactUpdate contactUpdateFrom(
            EmployeeRegistration registration,
            EmployeeContactUpdateCommand command
    ) {
        if (command == null || (command.email() == null && command.phone() == null)) {
            throw validationFailed("At least one contact field must be submitted.");
        }

        String oldEmail = registration.getEmail();
        String oldPhone = registration.getPhone();
        String requestedEmail = command.email() == null ? oldEmail : command.email();
        String requestedPhone = command.phone() == null ? oldPhone : command.phone();
        RegistrationContact normalized = contactFrom(registration.getFullName(), requestedEmail, requestedPhone);

        List<String> changedFields = new ArrayList<>(2);
        if (!oldEmail.equals(normalized.email())) {
            changedFields.add("email");
        }
        if (!oldPhone.equals(normalized.phone())) {
            changedFields.add("phone");
        }
        String outcome = changedFields.isEmpty() ? "noop" : "updated";
        return new ContactUpdate(
                oldEmail,
                normalized.email(),
                oldPhone,
                normalized.phone(),
                List.copyOf(changedFields),
                outcome
        );
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

    private static EmployeeRegistrationException validationFailed(String message) {
        return new EmployeeRegistrationException(
                EmployeeRegistrationFailureReason.VALIDATION_FAILED,
                message
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

    private record AuthenticatedProfileSession(
            EmployeeProfileSession session,
            EmployeeRegistration registration
    ) {
    }

    private record ContactUpdate(
            String oldEmail,
            String newEmail,
            String oldPhone,
            String newPhone,
            List<String> changedFields,
            String outcome
    ) {
        private boolean changed() {
            return !changedFields.isEmpty();
        }
    }
}
