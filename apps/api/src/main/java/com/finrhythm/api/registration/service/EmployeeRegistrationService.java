package com.finrhythm.api.registration.service;

import com.finrhythm.api.registration.domain.EmployeeRegistration;
import com.finrhythm.api.registration.domain.RegistrationContact;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.service.InviteActivationFailureReason;
import com.finrhythm.api.tenant.service.InviteActivationResult;
import com.finrhythm.api.tenant.service.InviteCodeAccessService;
import com.finrhythm.api.tenant.service.InviteCodeActivationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;

@Service
public class EmployeeRegistrationService {
    private final EmployeeRegistrationRepository employeeRegistrationRepository;
    private final InviteCodeAccessService inviteCodeAccessService;
    private final RegistrationSubjectRefGenerator subjectRefGenerator;
    private final Clock clock;

    @Autowired
    public EmployeeRegistrationService(
            EmployeeRegistrationRepository employeeRegistrationRepository,
            InviteCodeAccessService inviteCodeAccessService,
            RegistrationSubjectRefGenerator subjectRefGenerator
    ) {
        this(employeeRegistrationRepository, inviteCodeAccessService, subjectRefGenerator, Clock.systemUTC());
    }

    EmployeeRegistrationService(
            EmployeeRegistrationRepository employeeRegistrationRepository,
            InviteCodeAccessService inviteCodeAccessService,
            RegistrationSubjectRefGenerator subjectRefGenerator,
            Clock clock
    ) {
        this.employeeRegistrationRepository = employeeRegistrationRepository;
        this.inviteCodeAccessService = inviteCodeAccessService;
        this.subjectRefGenerator = subjectRefGenerator;
        this.clock = clock;
    }

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
        try {
            return new RegistrationContact(command.fullName(), command.email(), command.phone());
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
}
