package com.finrhythm.api.learning.service;

import com.finrhythm.api.learning.domain.LearningRouteDiagnosticState;
import com.finrhythm.api.learning.domain.LearningRouteN1Progress;
import com.finrhythm.api.learning.domain.LearningRouteN1Status;
import com.finrhythm.api.learning.domain.LearningRouteNextAction;
import com.finrhythm.api.learning.domain.LearningRouteProgressSummary;
import com.finrhythm.api.learning.persistence.LearningRouteProgressRepository;
import com.finrhythm.api.learning.persistence.LearningRouteProgressRepository.DiagnosticRouteSnapshot;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LearningRouteProgressService {
    private final EmployeeRegistrationService employeeRegistrationService;
    private final LearningRouteProgressRepository learningRouteProgressRepository;

    @Transactional(readOnly = true)
    public LearningRouteProgressSummary currentSummary(String authorizationHeader) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
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

        boolean submittedN1Handoff = diagnostic.state() == LearningRouteDiagnosticState.SUBMITTED
                && diagnostic.routePreview()
                && LearningProgressService.SUPPORTED_N1_LESSON_ID.equals(diagnostic.recommendedFirstLessonId());
        LearningRouteNextAction nextAction = nextAction(submittedN1Handoff, n1);

        return new LearningRouteProgressSummary(
                diagnostic.state(),
                submittedN1Handoff,
                submittedN1Handoff ? diagnostic.recommendedFirstLessonId() : null,
                n1,
                nextAction
        );
    }

    private static LearningRouteNextAction nextAction(
            boolean submittedN1Handoff,
            LearningRouteN1Progress n1
    ) {
        if (!submittedN1Handoff) {
            return LearningRouteNextAction.COMPLETE_DIAGNOSTIC;
        }
        if (n1.status() == LearningRouteN1Status.STARTED) {
            return LearningRouteNextAction.RESUME_N1;
        }
        return LearningRouteNextAction.START_N1;
    }
}
