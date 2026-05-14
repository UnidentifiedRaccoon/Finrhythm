package com.finrhythm.api.learning.service;

import com.finrhythm.api.common.web.ApiFieldError;
import com.finrhythm.api.learning.domain.LearningLessonDetail;
import com.finrhythm.api.learning.domain.LearningN1LessonDetailDraft;
import com.finrhythm.api.learning.domain.LearningRouteDiagnosticState;
import com.finrhythm.api.learning.domain.LearningRouteN1Progress;
import com.finrhythm.api.learning.domain.LearningRouteN1Status;
import com.finrhythm.api.learning.persistence.LearningRouteProgressRepository;
import com.finrhythm.api.learning.persistence.LearningRouteProgressRepository.DiagnosticRouteSnapshot;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningLessonDetailService {
    private final EmployeeRegistrationService employeeRegistrationService;
    private final LearningRouteProgressRepository learningRouteProgressRepository;

    @Transactional(readOnly = true)
    public LearningLessonDetail currentDetail(String authorizationHeader, String lessonId) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
        requireSupportedLesson(lessonId);

        DiagnosticRouteSnapshot diagnostic = learningRouteProgressRepository
                .findDiagnosticSnapshot(authenticated.employeeRegistrationId())
                .orElseGet(() -> new DiagnosticRouteSnapshot(
                        LearningRouteDiagnosticState.NOT_STARTED,
                        false,
                        null
                ));
        LearningRouteN1Progress n1 = learningRouteProgressRepository
                .findN1Progress(authenticated.employeeRegistrationId())
                .orElseGet(LearningRouteN1Progress::notStarted);

        if (!hasSubmittedN1Handoff(diagnostic) || n1.status() != LearningRouteN1Status.STARTED) {
            throw new LearningProgressException(
                    HttpStatus.CONFLICT,
                    LearningProgressFailureReason.LESSON_DETAIL_NOT_READY,
                    "N1 lesson detail is available only after submitted diagnostic handoff and started N1 progress.",
                    List.of()
            );
        }

        return LearningN1LessonDetailDraft.detail();
    }

    private static boolean hasSubmittedN1Handoff(DiagnosticRouteSnapshot diagnostic) {
        return diagnostic.state() == LearningRouteDiagnosticState.SUBMITTED
                && diagnostic.routePreview()
                && LearningProgressService.SUPPORTED_N1_LESSON_ID.equals(diagnostic.recommendedFirstLessonId());
    }

    private static void requireSupportedLesson(String lessonId) {
        if (!LearningProgressService.SUPPORTED_N1_LESSON_ID.equals(lessonId)) {
            throw new LearningProgressException(
                    HttpStatus.BAD_REQUEST,
                    LearningProgressFailureReason.UNSUPPORTED_LESSON_ID,
                    "Only N1 lesson detail is supported in this MVP slice.",
                    List.of(new ApiFieldError("lessonId", "ALLOWLIST", "Only N1 is supported."))
            );
        }
    }
}
