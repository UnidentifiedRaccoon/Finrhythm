#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const DEFAULT_STREAM_URL =
  "https://fgrm.ncfg.ru/teach/control/stream/view/id/909466707";
const DEFAULT_STATE_PATH = ".local/getcourse/storage-state.json";
const DEFAULT_OUTPUT_DIR = "course-export";
const ALLOWED_HOST = "fgrm.ncfg.ru";

function parseArgs(argv) {
  const options = {
    streamUrl: process.env.GETCOURSE_STREAM_URL || DEFAULT_STREAM_URL,
    statePath: process.env.GETCOURSE_STORAGE_STATE || DEFAULT_STATE_PATH,
    outputDir: process.env.GETCOURSE_OUTPUT_DIR || DEFAULT_OUTPUT_DIR,
    headless: process.env.GETCOURSE_HEADLESS === "1",
    debug: process.env.GETCOURSE_DEBUG !== "0",
  };

  for (const arg of argv) {
    if (arg === "--") {
      continue;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--headless") {
      options.headless = true;
    } else if (arg === "--headed") {
      options.headless = false;
    } else if (arg === "--no-debug") {
      options.debug = false;
    } else if (arg.startsWith("--url=")) {
      options.streamUrl = arg.slice("--url=".length);
    } else if (arg.startsWith("--state=")) {
      options.statePath = arg.slice("--state=".length);
    } else if (arg.startsWith("--out=")) {
      options.outputDir = arg.slice("--out=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Collect GetCourse lesson links from a stream page without opening lessons.

Usage:
  pnpm getcourse:collect-links
  pnpm getcourse:collect-links -- --headed
  pnpm getcourse:collect-links -- --headless
  pnpm getcourse:collect-links -- --url=https://fgrm.ncfg.ru/teach/control/stream/view/id/909466707

Environment:
  GETCOURSE_STREAM_URL       Stream page URL. Defaults to the requested stream.
  GETCOURSE_STORAGE_STATE    Playwright storageState path. Defaults to .local/getcourse/storage-state.json.
  GETCOURSE_OUTPUT_DIR       Output directory. Defaults to course-export.
  GETCOURSE_HEADLESS=1       Run headless when an existing storageState is enough.
  GETCOURSE_DEBUG=0          Do not save stream HTML, screenshot, or link candidates.
`);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assertAllowedStreamUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:" || parsed.host !== ALLOWED_HOST) {
    throw new Error(
      `Refusing to open ${rawUrl}. This collector is limited to https://${ALLOWED_HOST}.`,
    );
  }
  return parsed.href;
}

async function openStreamPage(page, streamUrl) {
  await page.goto(streamUrl, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function looksLikeAuthPage(page) {
  const currentUrl = page.url();
  if (
    /\/cms\/system\/login\b|\/login\b|\/pl\/lc\/login\b|\/auth\b/i.test(
      currentUrl,
    )
  ) {
    return true;
  }

  const passwordInputs = await page
    .locator('input[type="password"]')
    .count()
    .catch(() => 0);
  return passwordInputs > 0;
}

async function waitForManualLogin(page, streamUrl) {
  console.log(
    "Открыта страница авторизации. Войдите вручную в открытом браузере; скрипт продолжит работу после входа.",
  );

  let lastNoticeAt = 0;
  while (await looksLikeAuthPage(page)) {
    const now = Date.now();
    if (now - lastNoticeAt > 30_000) {
      console.log("Жду завершения ручного входа...");
      lastNoticeAt = now;
    }
    await page.waitForTimeout(3_000);
  }

  await openStreamPage(page, streamUrl);

  if (await looksLikeAuthPage(page)) {
    throw new Error("Still on an auth page after manual login.");
  }
}

function sanitizeDebugHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "<script>[redacted]</script>")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style>[redacted]</style>")
    .replace(/(<input\b[^>]*\bvalue=)(["']).*?\2/gi, '$1$2[redacted]$2')
    .replace(/<textarea\b([^>]*)>[\s\S]*?<\/textarea>/gi, "<textarea$1>[redacted]</textarea>")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\bid\d{5,}\b/gi, "[redacted-id]")
    .replace(
      /[^<]{0,80},\s*адрес электронной почты не подтвержден/gi,
      "[redacted-account-notice]",
    )
    .replace(
      /Мы используем cookie-файлы\. Это нужно для лучшей работы сайта\. Продолжая пользоваться сайтом, вы соглашаетесь с этим\.[^<]*/gi,
      "[redacted-cookie-notice]",
    )
    .replace(/password/gi, "[redacted-sensitive-keyword]")
    .replace(/cookie/gi, "[redacted-browser-storage-word]")
    .replace(
      /\b(cookie|authorization|bearer|token|secret|password|passwd|session|csrf|jwt)\b\s*[:=]\s*["']?[^"'\s<>&]+/gi,
      "$1=[redacted]",
    );
}

async function redactDebugDom(page) {
  await page.evaluate(() => {
    const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const idPattern = /\bid\d{5,}\b/gi;
    const serviceNoticePattern =
      /адрес электронной почты не подтвержден|Мы используем cookie-файлы|Продолжая пользоваться сайтом/i;

    for (const element of document.querySelectorAll("input,textarea")) {
      const replacement = element.matches?.('input[type="file"]') ? "" : "[redacted]";
      element.setAttribute("value", replacement);
      if ("value" in element) {
        element.value = replacement;
      }
    }

    for (const element of document.querySelectorAll("body *")) {
      const text = element.textContent || "";
      if (serviceNoticePattern.test(text) && element.childElementCount <= 4) {
        element.textContent = "[redacted-service-notice]";
        continue;
      }

      if (
        element.childElementCount === 0 &&
        (emailPattern.test(text) || idPattern.test(text))
      ) {
        element.textContent = text
          .replace(emailPattern, "[redacted-email]")
          .replace(idPattern, "[redacted-id]");
      }
    }
  });
}

async function saveDebugSnapshot(page, debugDir) {
  await redactDebugDom(page);
  await fs.writeFile(
    path.join(debugDir, "stream-page.html"),
    sanitizeDebugHtml(await page.content()),
    "utf8",
  );
  await page.screenshot({
    path: path.join(debugDir, "stream-page.png"),
    fullPage: true,
  });
}

async function collectLinksFromPage(page, allowedHost) {
  return page.evaluate((host) => {
    const lessonPathPattern = /\/(?:pl\/)?teach\/control\/lesson\/view\b/i;
    const candidatePathPattern =
      /\/(?:pl\/)?teach\/control\/|\/lesson\/|\/stream\/|\/pl\/teach\//i;

    function normalizeText(value, maxLength = 500) {
      return (value || "")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
    }

    function visibleLines(value) {
      return (value || "")
        .replace(/\u00a0/g, " ")
        .split(/\n+/)
        .map((line) => normalizeText(line, 220))
        .filter(Boolean);
    }

    function sanitizeSourceText(value) {
      return normalizeText(value, 500)
        .replace(
          /^[^,]{1,80}, адрес электронной почты не подтвержден ПОДТВЕРДИТЬ\s*/i,
          "",
        )
        .replace(
          /Мы используем cookie-файлы\. Это нужно для лучшей работы сайта\. Продолжая пользоваться сайтом, вы соглашаетесь с этим\. Подробнее OK/gi,
          "",
        )
        .replace(/\s+/g, " ")
        .trim();
    }

    function safeUrl(rawUrl) {
      try {
        const url = new URL(rawUrl, document.baseURI);
        url.hash = "";
        return url;
      } catch {
        return null;
      }
    }

    function nearestSourceText(anchor) {
      const container =
        anchor.closest(
          "li,tr,article,section,[data-lesson-id],[class*='lesson'],[class*='stream'],[class*='item'],[class*='row']",
        ) || anchor;
      return sanitizeSourceText(container.innerText || container.textContent);
    }

    function inferTitle(anchor, sourceText) {
      const titleNode = anchor.querySelector(
        "h1,h2,h3,h4,h5,h6,[class*='lesson-title'],[class*='title']",
      );
      const titleNodeText = visibleLines(titleNode?.innerText || titleNode?.textContent)[0];
      if (titleNodeText) {
        return titleNodeText;
      }

      const anchorLine = visibleLines(anchor.innerText || anchor.textContent)[0];
      if (anchorLine) {
        return anchorLine;
      }

      const attributeText = normalizeText(
        anchor.getAttribute("title") || anchor.getAttribute("aria-label"),
        220,
      );
      if (attributeText) {
        return attributeText;
      }

      return visibleLines(sourceText)[0] || anchor.href;
    }

    function labelKind(element) {
      const value = `${element.className || ""} ${element.id || ""}`.toLowerCase();
      if (/module|chapter|part|block/.test(value)) {
        return "module";
      }
      if (/section/.test(value)) {
        return "section";
      }
      if (/^h[1-6]$/i.test(element.tagName)) {
        return "section";
      }
      return null;
    }

    function pickContextLabel(root, anchorText) {
      if (!root) {
        return null;
      }

      const nodes = [];
      if (root.matches?.("h1,h2,h3,h4,h5,h6,[class*='module'],[class*='section'],[class*='chapter'],[class*='part'],[class*='block-title']")) {
        nodes.push(root);
      }
      nodes.push(
        ...(root.querySelectorAll?.(
          "h1,h2,h3,h4,h5,h6,[class*='module'],[class*='section'],[class*='chapter'],[class*='part'],[class*='block-title']",
        ) || []),
      );

      for (const node of nodes) {
        if (node.querySelector?.("a[href*='/lesson/view']")) {
          continue;
        }
        const text = normalizeText(node.innerText || node.textContent, 180);
        if (!text || text === anchorText || text.length < 2) {
          continue;
        }
        return {
          kind: labelKind(node) || "section",
          text,
        };
      }

      return null;
    }

    function inferSectionOrModule(anchor, anchorText) {
      for (let node = anchor; node && node !== document.body; node = node.parentElement) {
        let previous = node.previousElementSibling;
        let checked = 0;
        while (previous && checked < 12) {
          const label = pickContextLabel(previous, anchorText);
          if (label) {
            return label;
          }
          previous = previous.previousElementSibling;
          checked += 1;
        }
      }

      return null;
    }

    const rawLessons = [];
    const sameDomainCandidates = [];
    const anchors = Array.from(document.querySelectorAll("a[href],[href]"));

    anchors.forEach((anchor, domIndex) => {
      const url = safeUrl(anchor.getAttribute("href"));
      if (!url || url.host !== host) {
        return;
      }

      const normalizedUrl = url.href;
      const sourceText = nearestSourceText(anchor);
      const title = inferTitle(anchor, sourceText);
      const context = inferSectionOrModule(anchor, title);
      const candidate = {
        domIndex,
        title,
        url: normalizedUrl,
        path: url.pathname,
        section: context?.kind === "section" ? context.text : null,
        module: context?.kind === "module" ? context.text : null,
        sourceText,
      };

      if (lessonPathPattern.test(url.pathname)) {
        rawLessons.push(candidate);
      } else if (candidatePathPattern.test(url.pathname)) {
        sameDomainCandidates.push(candidate);
      }
    });

    return {
      pageTitle: document.title,
      rawLessons,
      sameDomainCandidates,
      policy: {
        allowedHost: host,
        lessonPathPattern: lessonPathPattern.toString(),
      },
    };
  }, allowedHost);
}

function dedupeLessons(rawLessons) {
  const seen = new Map();
  const lessons = [];
  const duplicates = [];

  for (const lesson of rawLessons) {
    if (seen.has(lesson.url)) {
      duplicates.push({
        url: lesson.url,
        firstIndex: seen.get(lesson.url),
        duplicateTitle: lesson.title,
      });
      continue;
    }

    const index = lessons.length + 1;
    seen.set(lesson.url, index);
    lessons.push({
      index,
      title: lesson.title,
      url: lesson.url,
      section: lesson.section,
      module: lesson.module,
      sourceText: lesson.sourceText,
    });
  }

  return { lessons, duplicates };
}

function formatTxt(lessons) {
  return lessons
    .map((lesson) => {
      const context = lesson.module || lesson.section;
      const prefix = context ? `[${context}] ` : "";
      return `${lesson.index}. ${prefix}${lesson.title}\n${lesson.url}`;
    })
    .join("\n\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const streamUrl = assertAllowedStreamUrl(options.streamUrl);
  const outputDir = path.resolve(options.outputDir);
  const debugDir = path.join(outputDir, "debug");
  const statePath = path.resolve(options.statePath);
  const hasStorageState = await fileExists(statePath);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  if (options.debug) {
    await fs.mkdir(debugDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: options.headless,
  });

  try {
    const context = await browser.newContext({
      ...(hasStorageState ? { storageState: statePath } : {}),
      locale: "ru-RU",
      timezoneId: "Europe/Moscow",
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();

    console.log(`Открываю поток: ${streamUrl}`);
    await openStreamPage(page, streamUrl);

    if (await looksLikeAuthPage(page)) {
      if (options.headless) {
        throw new Error(
          "Authorization is required, but the collector is running headless. Re-run without --headless and log in manually.",
        );
      }
      await waitForManualLogin(page, streamUrl);
    }

    await context.storageState({ path: statePath });

    const collected = await collectLinksFromPage(page, ALLOWED_HOST);
    if (options.debug) {
      await saveDebugSnapshot(page, debugDir);
    }

    const { lessons, duplicates } = dedupeLessons(collected.rawLessons);
    const suspiciousCandidates = collected.sameDomainCandidates.filter((candidate) =>
      /lesson|teach|stream/i.test(candidate.url),
    );

    const result = {
      sourceUrl: streamUrl,
      collectedAt: new Date().toISOString(),
      pageTitle: collected.pageTitle,
      allowedHost: ALLOWED_HOST,
      lessonCount: lessons.length,
      duplicateCount: duplicates.length,
      suspiciousCandidateCount: suspiciousCandidates.length,
      policy: collected.policy,
      lessons,
      duplicates,
      suspiciousCandidates,
    };

    await fs.writeFile(
      path.join(outputDir, "lesson-links.json"),
      `${JSON.stringify(result, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(outputDir, "lesson-links.txt"),
      `${formatTxt(lessons)}\n`,
      "utf8",
    );

    if (options.debug) {
      await fs.writeFile(
        path.join(debugDir, "link-candidates.json"),
        `${JSON.stringify(
          {
            pageTitle: collected.pageTitle,
            rawLessonCandidates: collected.rawLessons,
            sameDomainNonLessonCandidates: collected.sameDomainCandidates,
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
    }

    console.log("");
    console.log(`Найдено уроков: ${lessons.length}`);
    console.log(`Дубли: ${duplicates.length}`);
    console.log(
      `Подозрительные same-domain кандидаты вне lesson/view: ${suspiciousCandidates.length}`,
    );
    console.log("");
    console.log("Первые 10 уроков:");
    for (const lesson of lessons.slice(0, 10)) {
      console.log(`${lesson.index}. ${lesson.title} — ${lesson.url}`);
    }
    console.log("");
    console.log(`JSON: ${path.join(outputDir, "lesson-links.json")}`);
    console.log(`TXT: ${path.join(outputDir, "lesson-links.txt")}`);
    if (options.debug) {
      console.log(`Debug: ${debugDir}`);
    }
    console.log(`Сессия Playwright сохранена вне git: ${statePath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`GetCourse lesson link collection failed: ${error.message}`);
  process.exitCode = 1;
});
