package com.finrhythm.api.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI finrhythmOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("FinRhythm API")
                        .version("0.1.0")
                        .description("""
                                Backend API for FinRhythm pilot access, invite-code activation,
                                employee registration and privacy-safe admin code-status operations.
                                """));
    }
}
