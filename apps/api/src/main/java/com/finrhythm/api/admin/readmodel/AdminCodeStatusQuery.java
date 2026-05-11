package com.finrhythm.api.admin.readmodel;

public record AdminCodeStatusQuery(
        String status,
        Integer page,
        Integer size
) {
}
