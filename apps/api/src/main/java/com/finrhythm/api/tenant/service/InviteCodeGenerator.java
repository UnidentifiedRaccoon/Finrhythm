package com.finrhythm.api.tenant.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class InviteCodeGenerator {
    private static final char[] HUMAN_READABLE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".toCharArray();
    private static final int GROUP_COUNT = 4;
    private static final int GROUP_SIZE = 4;

    private final SecureRandom secureRandom;

    public InviteCodeGenerator() {
        this(new SecureRandom());
    }

    InviteCodeGenerator(SecureRandom secureRandom) {
        this.secureRandom = secureRandom;
    }

    public String generate() {
        StringBuilder code = new StringBuilder(GROUP_COUNT * GROUP_SIZE + GROUP_COUNT - 1);
        for (int group = 0; group < GROUP_COUNT; group++) {
            if (group > 0) {
                code.append('-');
            }
            for (int index = 0; index < GROUP_SIZE; index++) {
                code.append(HUMAN_READABLE_ALPHABET[secureRandom.nextInt(HUMAN_READABLE_ALPHABET.length)]);
            }
        }
        return code.toString();
    }
}
