package com.finrhythm.api.admin.service;

import com.finrhythm.api.admin.readmodel.AdminCodeStatusCount;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusPage;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusQuery;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusResponse;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusRow;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusSummary;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import com.finrhythm.api.tenant.persistence.AccessPoolRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeStatusCountProjection;
import com.finrhythm.api.tenant.persistence.InviteCodeStatusRowProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminCodeStatusService {
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_SIZE = 50;
    public static final int MAX_SIZE = 100;

    private final AccessPoolRepository accessPoolRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final EmployeeRegistrationRepository employeeRegistrationRepository;

    @Transactional(readOnly = true)
    public AdminCodeStatusResponse getCodeStatus(
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            AdminCodeStatusQuery query
    ) {
        int page = normalizePage(query.page());
        int size = normalizeSize(query.size());
        InviteCodeStatus statusFilter = parseStatus(query.status());
        AccessPool accessPool = accessPoolRepository.findByTenantIdAndPilotLaunchIdAndId(
                tenantId,
                pilotLaunchId,
                accessPoolId
        )
                .orElseThrow(AdminCodeStatusException::notFound);

        Map<InviteCodeStatus, Long> statusCounts = statusCounts(tenantId, accessPoolId);
        long totalCodeCount = inviteCodeRepository.countByTenantIdAndAccessPoolId(tenantId, accessPoolId);
        long issuedCount = inviteCodeRepository.countIssuedByTenantIdAndAccessPoolId(tenantId, accessPoolId);
        long registeredCount = employeeRegistrationRepository.countByTenantIdAndAccessPoolId(tenantId, accessPoolId);
        Page<InviteCodeStatusRowProjection> codeRows = inviteCodeRepository.findCodeStatusRows(
                tenantId,
                accessPoolId,
                statusFilter,
                PageRequest.of(page, size)
        );

        return new AdminCodeStatusResponse(
                tenantId,
                accessPool.getPilotLaunch().getId(),
                accessPool.getPilotLaunch().getKey(),
                accessPool.getPilotLaunch().getName(),
                accessPool.getPilotLaunch().getStatus(),
                accessPoolId,
                accessPool.getKey(),
                accessPool.getName(),
                accessPool.getStatus(),
                accessPool.getCapacity(),
                summary(accessPool, statusCounts, totalCodeCount, issuedCount, registeredCount),
                statusCounts(statusCounts),
                codesPage(codeRows)
        );
    }

    private static int normalizePage(Integer value) {
        int page = value == null ? DEFAULT_PAGE : value;
        if (page < 0) {
            throw AdminCodeStatusException.invalidParameter(
                    "page",
                    "MIN",
                    "Page must be zero or greater."
            );
        }
        return page;
    }

    private static int normalizeSize(Integer value) {
        int size = value == null ? DEFAULT_SIZE : value;
        if (size < 1 || size > MAX_SIZE) {
            throw AdminCodeStatusException.invalidParameter(
                    "size",
                    "RANGE",
                    "Size must be between 1 and 100."
            );
        }
        return size;
    }

    private static InviteCodeStatus parseStatus(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return InviteCodeStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw AdminCodeStatusException.invalidParameter(
                    "status",
                    "ENUM",
                    "Status must be a known invite-code status."
            );
        }
    }

    private Map<InviteCodeStatus, Long> statusCounts(UUID tenantId, UUID accessPoolId) {
        Map<InviteCodeStatus, Long> counts = new EnumMap<>(InviteCodeStatus.class);
        Arrays.stream(InviteCodeStatus.values()).forEach(status -> counts.put(status, 0L));
        for (InviteCodeStatusCountProjection projection
                : inviteCodeRepository.countStatusesByTenantIdAndAccessPoolId(tenantId, accessPoolId)) {
            counts.put(projection.getStatus(), projection.getCount());
        }
        return counts;
    }

    private static AdminCodeStatusSummary summary(
            AccessPool accessPool,
            Map<InviteCodeStatus, Long> statusCounts,
            long totalCodeCount,
            long issuedCount,
            long registeredCount
    ) {
        return new AdminCodeStatusSummary(
                issuedCount,
                statusCounts.get(InviteCodeStatus.ACTIVATED),
                registeredCount,
                statusCounts.get(InviteCodeStatus.REVOKED),
                statusCounts.get(InviteCodeStatus.EXPIRED),
                totalCodeCount,
                Math.max(0L, accessPool.getCapacity() - totalCodeCount)
        );
    }

    private static List<AdminCodeStatusCount> statusCounts(Map<InviteCodeStatus, Long> counts) {
        return Arrays.stream(InviteCodeStatus.values())
                .map(status -> new AdminCodeStatusCount(status, counts.get(status)))
                .toList();
    }

    private static AdminCodeStatusPage codesPage(Page<InviteCodeStatusRowProjection> page) {
        return new AdminCodeStatusPage(
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getContent().stream()
                        .map(AdminCodeStatusService::row)
                        .toList()
        );
    }

    private static AdminCodeStatusRow row(InviteCodeStatusRowProjection projection) {
        return new AdminCodeStatusRow(
                projection.getInviteCodeId(),
                projection.getStatus(),
                projection.getIssuedAt(),
                projection.getExpiresAt(),
                projection.getActivatedAt(),
                projection.getRegisteredAt(),
                projection.getRegisteredAt() != null
        );
    }
}
