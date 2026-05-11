package com.finrhythm.api.admin.service;

import com.finrhythm.api.admin.readmodel.AdminCodeStatusCount;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusPage;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusQuery;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusResponse;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusRow;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusSummary;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.tenant.domain.Cohort;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import com.finrhythm.api.tenant.persistence.CohortRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeStatusCountProjection;
import com.finrhythm.api.tenant.persistence.InviteCodeStatusRowProjection;
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
public class AdminCodeStatusService {
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_SIZE = 50;
    public static final int MAX_SIZE = 100;

    private final CohortRepository cohortRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final EmployeeRegistrationRepository employeeRegistrationRepository;

    public AdminCodeStatusService(
            CohortRepository cohortRepository,
            InviteCodeRepository inviteCodeRepository,
            EmployeeRegistrationRepository employeeRegistrationRepository
    ) {
        this.cohortRepository = cohortRepository;
        this.inviteCodeRepository = inviteCodeRepository;
        this.employeeRegistrationRepository = employeeRegistrationRepository;
    }

    @Transactional(readOnly = true)
    public AdminCodeStatusResponse getCodeStatus(
            UUID tenantId,
            UUID cohortId,
            AdminCodeStatusQuery query
    ) {
        int page = normalizePage(query.page());
        int size = normalizeSize(query.size());
        InviteCodeStatus statusFilter = parseStatus(query.status());
        Cohort cohort = cohortRepository.findByTenantIdAndId(tenantId, cohortId)
                .orElseThrow(AdminCodeStatusException::notFound);

        Map<InviteCodeStatus, Long> statusCounts = statusCounts(tenantId, cohortId);
        long totalCodeCount = inviteCodeRepository.countByTenantIdAndCohortId(tenantId, cohortId);
        long issuedCount = inviteCodeRepository.countIssuedByTenantIdAndCohortId(tenantId, cohortId);
        long registeredCount = employeeRegistrationRepository.countByTenantIdAndCohortId(tenantId, cohortId);
        Page<InviteCodeStatusRowProjection> codeRows = inviteCodeRepository.findCodeStatusRows(
                tenantId,
                cohortId,
                statusFilter,
                PageRequest.of(page, size)
        );

        return new AdminCodeStatusResponse(
                tenantId,
                cohortId,
                cohort.getKey(),
                cohort.getName(),
                cohort.getKind(),
                cohort.getStatus(),
                cohort.getTargetSize(),
                summary(cohort, statusCounts, totalCodeCount, issuedCount, registeredCount),
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

    private Map<InviteCodeStatus, Long> statusCounts(UUID tenantId, UUID cohortId) {
        Map<InviteCodeStatus, Long> counts = new EnumMap<>(InviteCodeStatus.class);
        Arrays.stream(InviteCodeStatus.values()).forEach(status -> counts.put(status, 0L));
        for (InviteCodeStatusCountProjection projection
                : inviteCodeRepository.countStatusesByTenantIdAndCohortId(tenantId, cohortId)) {
            counts.put(projection.getStatus(), projection.getCount());
        }
        return counts;
    }

    private static AdminCodeStatusSummary summary(
            Cohort cohort,
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
                Math.max(0L, cohort.getTargetSize() - totalCodeCount)
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
