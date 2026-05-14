package com.finrhythm.api.learning.service;

import com.finrhythm.api.common.web.ApiFieldError;
import com.finrhythm.api.learning.domain.LessonProgress;
import com.finrhythm.api.learning.persistence.LessonProgressRepository;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningProgressService {
    public static final String SUPPORTED_N1_LESSON_ID = "N1";

    private final EmployeeRegistrationService employeeRegistrationService;
    private final LessonProgressRepository lessonProgressRepository;
    private final Clock clock;

    @Transactional
    public LessonProgress startOrResume(String authorizationHeader, String lessonId) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
        requireSupportedLesson(lessonId);
        return lessonProgressRepository.startOrResume(authenticated, lessonId, clock.instant());
    }

    private static void requireSupportedLesson(String lessonId) {
        if (!SUPPORTED_N1_LESSON_ID.equals(lessonId)) {
            throw new LearningProgressException(
                    HttpStatus.BAD_REQUEST,
                    LearningProgressFailureReason.UNSUPPORTED_LESSON_ID,
                    "Only N1 lesson progress is supported in this MVP slice.",
                    List.of(new ApiFieldError("lessonId", "ALLOWLIST", "Only N1 is supported."))
            );
        }
    }
}
