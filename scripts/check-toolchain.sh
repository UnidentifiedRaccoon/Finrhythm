#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_PACKAGE_MANAGER="$(awk -F '"' '/"packageManager"[[:space:]]*:/ { print $4; exit }' "$ROOT/package.json")"
EXPECTED_PNPM_VERSION="${EXPECTED_PACKAGE_MANAGER#pnpm@}"
MIN_NODE_MAJOR=20
MIN_NODE_MINOR=9
status=0

pass() {
  printf 'toolchain: PASS %s\n' "$1"
}

fail() {
  printf 'toolchain: FAIL %s\n' "$1" >&2
  status=1
}

hint() {
  printf 'toolchain: hint %s\n' "$1" >&2
}

version_at_least() {
  local version="$1"
  local required_major="$2"
  local required_minor="$3"
  local major minor

  major="${version%%.*}"
  minor="${version#*.}"
  minor="${minor%%.*}"

  [[ "$major" =~ ^[0-9]+$ ]] || return 1
  [[ "$minor" =~ ^[0-9]+$ ]] || minor=0

  if (( major > required_major )); then
    return 0
  fi

  if (( major == required_major && minor >= required_minor )); then
    return 0
  fi

  return 1
}

if [[ "$EXPECTED_PACKAGE_MANAGER" != pnpm@* || -z "$EXPECTED_PNPM_VERSION" ]]; then
  fail "package.json must pin packageManager as pnpm@<version>."
else
  pass "package.json pins $EXPECTED_PACKAGE_MANAGER"
fi

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js is required before running make install."
  hint "Install Node.js 24 for parity with CI, or at least Node.js ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+ for Next.js 16."
else
  NODE_VERSION="$(node -p 'process.versions.node' 2>/dev/null || true)"
  if version_at_least "$NODE_VERSION" "$MIN_NODE_MAJOR" "$MIN_NODE_MINOR"; then
    pass "Node.js $NODE_VERSION is available"
  else
    fail "Node.js $NODE_VERSION is too old; expected ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+."
    hint "Use Node.js 24 to match CI."
  fi
fi

if ! command -v corepack >/dev/null 2>&1; then
  fail "Corepack is required so the packageManager pin is enforced."
  hint "Install a Node.js distribution with Corepack, then run: corepack enable"
else
  COREPACK_VERSION="$(corepack --version 2>/dev/null || true)"
  pass "Corepack ${COREPACK_VERSION:-available} is available"
fi

if [[ "$EXPECTED_PACKAGE_MANAGER" == pnpm@* ]]; then
  if ! command -v pnpm >/dev/null 2>&1; then
    fail "pnpm is not available on PATH; make install would fail before dependency install."
    hint "Run: corepack enable && corepack prepare pnpm@$EXPECTED_PNPM_VERSION --activate"
  else
    PNPM_VERSION="$(pnpm --version 2>/dev/null || true)"
    if [[ "$PNPM_VERSION" == "$EXPECTED_PNPM_VERSION" ]]; then
      pass "pnpm $PNPM_VERSION matches packageManager"
    else
      fail "pnpm $PNPM_VERSION does not match packageManager pnpm@$EXPECTED_PNPM_VERSION."
      hint "Run: corepack prepare pnpm@$EXPECTED_PNPM_VERSION --activate"
    fi
  fi
fi

if [[ -z "${JAVA_HOME:-}" ]]; then
  for java_home_candidate in /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21; do
    if [[ -d "$java_home_candidate" ]]; then
      export JAVA_HOME="$java_home_candidate"
      export PATH="$JAVA_HOME/bin:$PATH"
      break
    fi
  done
fi

if ! command -v java >/dev/null 2>&1; then
  fail "Java 21 is required for apps/api Maven/Flyway commands."
  hint "Install Temurin/OpenJDK 21 and set JAVA_HOME if it is not on PATH."
else
  JAVA_OUTPUT="$(java -version 2>&1)"
  JAVA_EXIT=$?
  JAVA_VERSION_LINE="$(printf '%s\n' "$JAVA_OUTPUT" | head -n 1)"
  if [[ "$JAVA_EXIT" -ne 0 ]]; then
    fail "java is on PATH but is not usable: $JAVA_VERSION_LINE"
    hint "Install Temurin/OpenJDK 21 and set JAVA_HOME if it is not on PATH."
  elif [[ "$JAVA_VERSION_LINE" =~ \"([0-9]+)(\.[0-9]+)? ]]; then
    JAVA_MAJOR="${BASH_REMATCH[1]}"
    if [[ "$JAVA_MAJOR" == "21" ]]; then
      pass "Java $JAVA_VERSION_LINE is available"
    else
      fail "Java major version $JAVA_MAJOR is available; expected Java 21."
      hint "Set JAVA_HOME to a Java 21 installation before running make install/init/verify."
    fi
  else
    fail "could not parse Java version from: $JAVA_VERSION_LINE"
  fi
fi

MVNW="$ROOT/apps/api/mvnw"
WRAPPER_PROPS="$ROOT/apps/api/.mvn/wrapper/maven-wrapper.properties"
WRAPPER_JAR="$ROOT/apps/api/.mvn/wrapper/maven-wrapper.jar"

if [[ ! -f "$MVNW" ]]; then
  fail "apps/api/mvnw is missing; backend commands must use Maven Wrapper."
elif [[ ! -x "$MVNW" ]]; then
  fail "apps/api/mvnw exists but is not executable."
  hint "Run: chmod +x apps/api/mvnw"
else
  pass "apps/api/mvnw is present and executable"
fi

if [[ ! -f "$WRAPPER_PROPS" ]]; then
  fail "apps/api/.mvn/wrapper/maven-wrapper.properties is missing."
elif ! grep -q 'distributionUrl=.*apache-maven' "$WRAPPER_PROPS"; then
  fail "Maven wrapper properties do not define an apache-maven distributionUrl."
else
  MAVEN_DISTRIBUTION="$(awk -F= '/^distributionUrl=/ { print $2; exit }' "$WRAPPER_PROPS")"
  pass "Maven Wrapper distribution is configured (${MAVEN_DISTRIBUTION##*/})"
fi

if [[ ! -f "$WRAPPER_JAR" ]]; then
  fail "apps/api/.mvn/wrapper/maven-wrapper.jar is missing."
else
  pass "Maven Wrapper jar is present"
fi

if [[ "$status" -eq 0 ]]; then
  printf 'toolchain: PASS readiness check complete\n'
else
  printf 'toolchain: FAIL readiness check incomplete\n' >&2
fi

exit "$status"
