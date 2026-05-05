package com.finrhythm.api.tenant.service;

import com.finrhythm.api.tenant.domain.InviteCodeHash;
import org.junit.jupiter.api.Test;

import java.util.Locale;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

class InviteCodeGeneratorTest {
    private static final Pattern HUMAN_ENTERABLE_CODE = Pattern.compile(
            "^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}"
                    + "(-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}){3}$"
    );

    @Test
    void generatesHumanEnterableGroupedCodes() {
        String generatedCode = new InviteCodeGenerator().generate();

        if (!HUMAN_ENTERABLE_CODE.matcher(generatedCode).matches()) {
            fail("Generated invite code did not match the human-enterable format.");
        }
    }

    @Test
    void lookupHashNormalizesWhitespaceHyphensAndCase() {
        String generatedCode = new InviteCodeGenerator().generate();
        String enteredVariant = generatedCode.toLowerCase(Locale.ROOT).replace("-", " ");

        assertThat(InviteCodeHash.fromEnteredCode(enteredVariant))
                .isEqualTo(InviteCodeHash.fromEnteredCode(generatedCode));
    }
}
