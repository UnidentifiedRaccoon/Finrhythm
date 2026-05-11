package com.finrhythm.api.registration.service;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.HexFormat;

@Component
public class RegistrationSubjectRefGenerator {
    private final SecureRandom secureRandom;

    public RegistrationSubjectRefGenerator() {
        this(new SecureRandom());
    }

    RegistrationSubjectRefGenerator(SecureRandom secureRandom) {
        this.secureRandom = secureRandom;
    }

    public ActivationSubjectRef generate() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return ActivationSubjectRef.fromSha256Hex(HexFormat.of().formatHex(bytes));
    }
}
