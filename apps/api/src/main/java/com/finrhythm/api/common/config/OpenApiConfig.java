package com.finrhythm.api.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    public static final String ADMIN_BEARER_AUTH = "adminBearerAuth";
    public static final String PROFILE_SESSION_BEARER_AUTH = "employeeProfileSessionBearerAuth";

    @Bean
    OpenAPI finrhythmOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("FinRhythm API")
                        .version("0.1.0")
                        .description("""
                                Backend API for FinRhythm pilot access, invite-code activation,
                                employee registration and privacy-safe admin code-status operations.
                                """))
                .components(new Components()
                        .addSecuritySchemes(ADMIN_BEARER_AUTH, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("opaque-admin-token")
                                .description("Deploy-configured admin bearer token for operational API calls."))
                        .addSecuritySchemes(PROFILE_SESSION_BEARER_AUTH, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("opaque-profile-session")
                                .description("Short-lived employee profile-session bearer token.")));
    }
}
