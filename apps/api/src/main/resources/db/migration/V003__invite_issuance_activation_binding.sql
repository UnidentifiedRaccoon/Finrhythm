alter table invite_codes
    add column activation_subject_ref varchar(64);

alter table invite_codes
    drop constraint invite_codes_lifecycle_check;

alter table invite_codes
    add constraint invite_codes_activation_subject_ref_format check (
        activation_subject_ref is null
        or activation_subject_ref ~ '^[a-f0-9]{64}$'
    );

alter table invite_codes
    add constraint invite_codes_lifecycle_check check (
        (
            status = 'CREATED'
            and issued_at is null
            and activated_at is null
            and activation_subject_ref is null
        )
        or (
            status in ('ISSUED', 'RESERVED', 'REVOKED', 'EXPIRED')
            and issued_at is not null
            and activated_at is null
            and activation_subject_ref is null
        )
        or (
            status = 'ACTIVATED'
            and issued_at is not null
            and activated_at is not null
            and activation_subject_ref is not null
        )
    );

create index ix_invite_codes_activation_subject_ref
    on invite_codes (activation_subject_ref)
    where activation_subject_ref is not null;
