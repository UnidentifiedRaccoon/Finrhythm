package com.finrhythm.api.tenant.service;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import com.finrhythm.api.tenant.domain.Tenant;
import com.finrhythm.api.tenant.persistence.AccessPoolRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeRepository;
import com.finrhythm.api.tenant.persistence.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InviteCodeAccessService {
    private static final int MAX_BATCH_SIZE = 500;

    private final TenantRepository tenantRepository;
    private final AccessPoolRepository accessPoolRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Transactional
    public List<IssuedInviteCode> issueBatch(
            UUID tenantId,
            UUID accessPoolId,
            int count,
            Instant issuedAt,
            Instant expiresAt
    ) {
        if (count < 1 || count > MAX_BATCH_SIZE) {
            throw new IllegalArgumentException("Invite batch size must be between 1 and 500.");
        }
        Instant issueTime = Objects.requireNonNull(issuedAt, "issuedAt");
        if (expiresAt != null && !expiresAt.isAfter(issueTime)) {
            throw new IllegalArgumentException("Invite code expiry must be after issue time.");
        }
        Tenant tenant = tenantRepository.findById(Objects.requireNonNull(tenantId, "tenantId"))
                .orElseThrow(() -> new IllegalArgumentException("Tenant does not exist."));
        AccessPool accessPool = accessPoolRepository.lockById(Objects.requireNonNull(accessPoolId, "accessPoolId"))
                .orElseThrow(() -> new IllegalArgumentException("Access pool does not exist."));
        if (!accessPool.isOwnedBy(tenant)) {
            throw new IllegalArgumentException("Access pool must belong to the same tenant.");
        }
        long existingInviteCount = inviteCodeRepository.countByTenantIdAndAccessPoolId(tenant.getId(), accessPool.getId());
        if (existingInviteCount + count > accessPool.getCapacity()) {
            throw new IllegalArgumentException("Invite batch exceeds access pool capacity.");
        }

        List<IssuedInviteCode> issuedCodes = new ArrayList<>(count);
        Set<String> batchLookupHashes = new HashSet<>(count);
        int generationAttempts = 0;
        int maxGenerationAttempts = count * 20;
        while (issuedCodes.size() < count) {
            if (generationAttempts++ >= maxGenerationAttempts) {
                throw new IllegalStateException("Could not generate a unique invite batch.");
            }
            String code = inviteCodeGenerator.generate();
            InviteCodeHash lookupHash = InviteCodeHash.fromEnteredCode(code);
            if (!batchLookupHashes.add(lookupHash.value()) || inviteCodeRepository.existsByLookupHash(lookupHash.value())) {
                continue;
            }
            InviteCode inviteCode = inviteCodeRepository.save(InviteCode.issued(
                    tenant,
                    accessPool,
                    lookupHash,
                    issueTime,
                    expiresAt
            ));
            issuedCodes.add(new IssuedInviteCode(
                    inviteCode.getId(),
                    tenant.getId(),
                    accessPool.getPilotLaunch().getId(),
                    accessPool.getId(),
                    code,
                    expiresAt
            ));
        }
        inviteCodeRepository.flush();
        return List.copyOf(issuedCodes);
    }

    @Transactional
    public InviteActivationResult activate(String submittedCode, ActivationSubjectRef subjectRef, Instant activatedAt) {
        ActivationSubjectRef activationSubjectRef = Objects.requireNonNull(subjectRef, "subjectRef");
        Instant activationTime = Objects.requireNonNull(activatedAt, "activatedAt");
        String lookupHash = lookupHashForSubmittedCode(submittedCode);

        int updatedRows = inviteCodeRepository.claimIssuedByLookupHash(
                lookupHash,
                activationSubjectRef.value(),
                activationTime,
                InviteCodeStatus.ACTIVATED,
                InviteCodeStatus.ISSUED
        );
        InviteCode inviteCode = inviteCodeRepository.findByLookupHash(lookupHash)
                .orElseThrow(() -> new InviteCodeActivationException(
                        InviteActivationFailureReason.INVALID_CODE,
                        "Invite code is invalid."
                ));
        if (updatedRows == 1) {
            return activationResult(inviteCode, activationSubjectRef, false);
        }
        if (inviteCode.isActivatedFor(activationSubjectRef)) {
            return activationResult(inviteCode, activationSubjectRef, true);
        }
        throw activationFailure(inviteCode, activationTime);
    }

    private static String lookupHashForSubmittedCode(String submittedCode) {
        try {
            return InviteCodeHash.fromEnteredCode(submittedCode).value();
        } catch (IllegalArgumentException exception) {
            throw new InviteCodeActivationException(
                    InviteActivationFailureReason.INVALID_CODE,
                    "Invite code is invalid."
            );
        }
    }

    private static InviteActivationResult activationResult(
            InviteCode inviteCode,
            ActivationSubjectRef subjectRef,
            boolean idempotentRetry
    ) {
        return new InviteActivationResult(
                inviteCode.getId(),
                inviteCode.getTenant().getId(),
                inviteCode.getAccessPool().getPilotLaunch().getId(),
                inviteCode.getAccessPool().getId(),
                subjectRef.value(),
                idempotentRetry
        );
    }

    private static InviteCodeActivationException activationFailure(InviteCode inviteCode, Instant activatedAt) {
        if (inviteCode.getStatus() == InviteCodeStatus.CREATED || inviteCode.getStatus() == InviteCodeStatus.RESERVED) {
            return new InviteCodeActivationException(
                    InviteActivationFailureReason.UNISSUED_CODE,
                    "Invite code is not ready for activation."
            );
        }
        if (inviteCode.getStatus() == InviteCodeStatus.REVOKED) {
            return new InviteCodeActivationException(
                    InviteActivationFailureReason.REVOKED_CODE,
                    "Invite code has been revoked."
            );
        }
        if (inviteCode.getStatus() == InviteCodeStatus.EXPIRED
                || (inviteCode.getStatus() == InviteCodeStatus.ISSUED
                && inviteCode.getExpiresAt() != null
                && !inviteCode.getExpiresAt().isAfter(activatedAt))) {
            return new InviteCodeActivationException(
                    InviteActivationFailureReason.EXPIRED_CODE,
                    "Invite code has expired."
            );
        }
        return new InviteCodeActivationException(
                InviteActivationFailureReason.ALREADY_ACTIVATED_BY_ANOTHER_SUBJECT,
                "Invite code is already activated by another subject."
        );
    }
}
