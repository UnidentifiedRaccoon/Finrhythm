SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

.PHONY: help install init dev verify test-unit test-e2e build

help:
	@printf '%s\n' 'Targets:'
	@printf '%s\n' '  make install   Install JS workspace dependencies.'
	@printf '%s\n' '  make init      Start local PostgreSQL and apply versioned bootstrap.'
	@printf '%s\n' '  make dev       Start local development dependencies only.'
	@printf '%s\n' '  make verify    Run bootstrap, harness and backend unit checks.'
	@printf '%s\n' '  make test-unit Run current non-browser unit verification checks.'
	@printf '%s\n' '  make test-e2e  Run current browser/e2e smoke placeholder.'
	@printf '%s\n' '  make build     Run production-readiness checks available in MVP-01.'

install:
	pnpm install --frozen-lockfile

init:
	./scripts/init-local.sh

dev:
	./scripts/dev-local.sh

verify:
	./scripts/validate-bootstrap.sh
	node scripts/verify-bootstrap.mjs
	cd apps/api && ./mvnw -q test

test-unit:
	node scripts/verify-bootstrap.mjs
	cd apps/api && ./mvnw -q test

test-e2e:
	node tests/e2e/smoke-placeholder.mjs

build:
	node scripts/verify-bootstrap.mjs
	pnpm -s run build:docs
	cd apps/api && ./mvnw -q -DskipTests package
