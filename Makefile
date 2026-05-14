SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

HOMEBREW_JAVA_HOME := $(firstword $(wildcard /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21))
ifneq ($(HOMEBREW_JAVA_HOME),)
ifeq ($(strip $(JAVA_HOME)),)
JAVA_HOME := $(HOMEBREW_JAVA_HOME)
endif
export JAVA_HOME
export PATH := $(JAVA_HOME)/bin:$(PATH)
endif

.PHONY: help install init dev proof-lite verify-web verify-api verify-full verify test-unit test-e2e build

help:
	@printf '%s\n' 'Targets:'
	@printf '%s\n' '  make install   Check Node/pnpm/Corepack/Java 21/Maven wrapper, then install JS dependencies.'
	@printf '%s\n' '  make init      Start local PostgreSQL, run Flyway migrations and record bootstrap.'
	@printf '%s\n' '  make dev       Start local development dependencies only.'
	@printf '%s\n' '  make proof-lite Run lightweight harness/bootstrap and diff hygiene checks.'
	@printf '%s\n' '  make verify-web Run focused employee web type/test/build checks.'
	@printf '%s\n' '  make verify-api Run backend Maven verify and API client contract checks.'
	@printf '%s\n' '  make verify-full Run full harness/bootstrap, web/admin and backend checks.'
	@printf '%s\n' '  make verify    Run bootstrap, web/admin type/test and backend Maven verify checks.'
	@printf '%s\n' '  make test-unit Run current non-browser unit verification and backend Maven verify checks.'
	@printf '%s\n' '  make test-e2e  Run web/admin browser smoke checks.'
	@printf '%s\n' '  make build     Run production-readiness checks available in MVP-01.'

install:
	./scripts/check-toolchain.sh
	pnpm install --frozen-lockfile

init:
	./scripts/init-local.sh

dev:
	./scripts/dev-local.sh

proof-lite:
	HARNESS_PROFILE=lite ./scripts/validate-bootstrap.sh
	git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'

verify-web:
	pnpm --filter @finrhythm/web typecheck
	pnpm --filter @finrhythm/web test
	pnpm --filter @finrhythm/web build

verify-api:
	cd apps/api && ./mvnw -q verify
	pnpm --filter @finrhythm/api-client test
	pnpm --filter @finrhythm/api-client typecheck

verify-full:
	HARNESS_PROFILE=full ./scripts/validate-bootstrap.sh
	node scripts/verify-bootstrap.mjs
	pnpm --filter @finrhythm/web typecheck
	pnpm --filter @finrhythm/web test
	pnpm --filter @finrhythm/admin typecheck
	pnpm --filter @finrhythm/admin test
	cd apps/api && ./mvnw -q verify

verify:
	./scripts/validate-bootstrap.sh
	node scripts/verify-bootstrap.mjs
	pnpm --filter @finrhythm/web typecheck
	pnpm --filter @finrhythm/web test
	pnpm --filter @finrhythm/admin typecheck
	pnpm --filter @finrhythm/admin test
	cd apps/api && ./mvnw -q verify

test-unit:
	node scripts/verify-bootstrap.mjs
	pnpm --filter @finrhythm/web test
	pnpm --filter @finrhythm/admin test
	cd apps/api && ./mvnw -q verify

test-e2e:
	node tests/e2e/browser-smoke.mjs

build:
	node scripts/verify-bootstrap.mjs
	pnpm -s run build:docs
	pnpm --filter @finrhythm/web build
	pnpm --filter @finrhythm/admin build
	cd apps/api && ./mvnw -q -DskipTests package
