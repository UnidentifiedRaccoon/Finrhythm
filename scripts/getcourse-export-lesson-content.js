#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const ALLOWED_HOST = "fgrm.ncfg.ru";
const DEFAULT_LINKS_PATH = "course-export/lesson-links.json";
const DEFAULT_CONTENT_DIR = "content/getcourse-path-to-money";
const DEFAULT_STATE_PATH = ".local/getcourse/storage-state.json";
const DEFAULT_OUTPUT_DIR = "course-export";
const DEFAULT_DEBUG_DIR = "debug/lesson-content";

const LESSON_PATH_PATTERN = /^\/(?:pl\/)?teach\/control\/lesson\/view\b/i;
const DOWNLOAD_LIKE_PATH_PATTERN =
  /\.(?:mp4|m4v|mov|avi|mkv|webm|m3u8|mpd|zip|rar|7z|tar|gz|pdf|docx?|xlsx?|pptx?|exe|dmg)(?:$|[?#])/i;
const FINANCIAL_CLAIM_PATTERN =
  /(деньг|финанс|налог|вычет|накоп|резерв|бюджет|доход|расход|кредит|долг|инвест|процент|рубл|копил|плат[её]ж|пенси|капитал|сбереж|эконом)/i;
const ASSIGNMENT_PATTERN =
  /(задан|домаш|ответьте|отвечайте на вопрос|напишите|заполните|выполните|практик|чек-?лист|форма|тест|поделитесь|сделайте|посчитайте|выберите|расскажите)/i;
const AUTH_URL_PATTERN = /\/cms\/system\/login\b|\/login\b|\/pl\/lc\/login\b|\/auth\b/i;
const BLOCKED_TEXT_PATTERN =
  /(нет доступа|доступ закрыт|доступ запрещ[её]н|недоступ|нужно оплатить|вы не записаны|страница не найдена|страница с таким адресом не найдена|тренинг не найден|возникла ошибка #?404|ошибка 403|forbidden|access denied)/i;

function parseArgs(argv) {
  const options = {
    linksPath: process.env.GETCOURSE_LESSON_LINKS || DEFAULT_LINKS_PATH,
    contentDir: process.env.GETCOURSE_CONTENT_DIR || DEFAULT_CONTENT_DIR,
    statePath: process.env.GETCOURSE_STORAGE_STATE || DEFAULT_STATE_PATH,
    outputDir: process.env.GETCOURSE_OUTPUT_DIR || DEFAULT_OUTPUT_DIR,
    headless: process.env.GETCOURSE_HEADLESS === "1",
    debug: process.env.GETCOURSE_DEBUG !== "0",
    debugAll: process.env.GETCOURSE_DEBUG_ALL === "1",
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
    } else if (arg === "--debug-all") {
      options.debug = true;
      options.debugAll = true;
    } else if (arg.startsWith("--links=")) {
      options.linksPath = arg.slice("--links=".length);
    } else if (arg.startsWith("--content-dir=")) {
      options.contentDir = arg.slice("--content-dir=".length);
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
Export visible GetCourse lesson content into markdown files.

Usage:
  pnpm getcourse:export-content
  pnpm getcourse:export-content -- --headed
  pnpm getcourse:export-content -- --headless
  pnpm getcourse:export-content -- --links=course-export/lesson-links.json

Safety policy:
  - opens only https://${ALLOWED_HOST}/teach/control/lesson/view/... pages;
  - reuses Playwright storageState from .local/getcourse/storage-state.json;
  - asks for manual login only in headed mode;
  - blocks media, archive/document downloads and off-domain network requests;
  - records video/embed metadata from DOM only and never downloads videos;
  - writes sanitized debug snapshots only under course-export/debug/lesson-content/.
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

function assertAllowedLessonUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (
    parsed.protocol !== "https:" ||
    parsed.host !== ALLOWED_HOST ||
    !LESSON_PATH_PATTERN.test(parsed.pathname)
  ) {
    throw new Error(
      `Refusing to open ${rawUrl}. This exporter is limited to https://${ALLOWED_HOST}/teach/control/lesson/view/...`,
    );
  }
  parsed.hash = "";
  return parsed.href;
}

function sanitizeUrlForOutput(rawUrl) {
  if (!rawUrl) {
    return { url: null, stripped: false };
  }

  try {
    const parsed = new URL(rawUrl, `https://${ALLOWED_HOST}/`);
    const hadSensitiveParts =
      parsed.username ||
      parsed.password ||
      parsed.hash ||
      Array.from(parsed.searchParams.keys()).length > 0;
    parsed.username = "";
    parsed.password = "";
    parsed.hash = "";
    parsed.search = "";

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { url: null, stripped: Boolean(hadSensitiveParts) };
    }

    return { url: parsed.href, stripped: Boolean(hadSensitiveParts) };
  } catch {
    return { url: null, stripped: false };
  }
}

function normalizeText(value, maxLength = 20_000) {
  return (value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function compactLine(value, maxLength = 500) {
  return normalizeText(value, maxLength).replace(/\s+/g, " ").trim();
}

function yamlQuote(value) {
  return `"${String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function markdownEscapeLinkText(value) {
  return String(value || "Без названия")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}

function dedupeByText(items, maxCount = 80) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const text = compactLine(typeof item === "string" ? item : item.text, 1_500);
    if (!text || seen.has(text.toLowerCase())) {
      continue;
    }
    seen.add(text.toLowerCase());
    result.push(item);
    if (result.length >= maxCount) {
      break;
    }
  }

  return result;
}

function formatList(items, emptyText) {
  if (!items.length) {
    return emptyText;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatNumberedList(items, emptyText) {
  if (!items.length) {
    return emptyText;
  }

  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  return match[1].split(/\n/).reduce((result, line) => {
    const lineMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!lineMatch) {
      return result;
    }
    const [, key, rawValue] = lineMatch;
    result[key] = rawValue.trim().replace(/^"(.*)"$/, "$1");
    return result;
  }, {});
}

async function loadLessonLinks(linksPath) {
  const raw = await fs.readFile(linksPath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.lessons)) {
    throw new Error(`${linksPath} does not contain a lessons array.`);
  }

  return data.lessons.map((lesson) => ({
    index: Number(lesson.index),
    title: lesson.title,
    url: assertAllowedLessonUrl(lesson.url),
    sourceText: lesson.sourceText || "",
  }));
}

async function loadMarkdownTargets(contentDir) {
  await fs.mkdir(contentDir, { recursive: true });
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  const targets = new Map();

  for (const entry of entries) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".md") ||
      entry.name === "README.md" ||
      entry.name === "EXPORT_PROMPT.md"
    ) {
      continue;
    }

    const filePath = path.join(contentDir, entry.name);
    const raw = await fs.readFile(filePath, "utf8");
    const frontmatter = parseFrontmatter(raw);
    if (frontmatter.index) {
      targets.set(`index:${Number(frontmatter.index)}`, filePath);
    }
    if (frontmatter.sourceUrl) {
      targets.set(`url:${frontmatter.sourceUrl}`, filePath);
    }
  }

  return targets;
}

function lessonIdFromUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  const parts = parsed.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || String(Date.now());
}

function defaultTargetForLesson(contentDir, lesson) {
  const indexPrefix = String(lesson.index).padStart(2, "0");
  return path.join(contentDir, `${indexPrefix}-lesson-${lessonIdFromUrl(lesson.url)}.md`);
}

function targetForLesson(targets, lesson, contentDir) {
  return (
    targets.get(`index:${lesson.index}`) ||
    targets.get(`url:${lesson.url}`) ||
    defaultTargetForLesson(contentDir, lesson)
  );
}

async function openLessonPage(page, lessonUrl) {
  await page.goto(lessonUrl, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function looksLikeAuthPage(page) {
  const currentUrl = page.url();
  if (AUTH_URL_PATTERN.test(currentUrl)) {
    return true;
  }

  const passwordInputs = await page
    .locator('input[type="password"]')
    .count()
    .catch(() => 0);
  return passwordInputs > 0;
}

async function waitForManualLogin(page, lessonUrl) {
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

  await openLessonPage(page, lessonUrl);

  if (await looksLikeAuthPage(page)) {
    throw new Error("Still on an auth page after manual login.");
  }
}

function createNetworkStats() {
  return {
    blockedExternalHosts: new Set(),
    blockedMediaCount: 0,
    blockedDownloadLikeCount: 0,
  };
}

async function installSafeRouting(context, currentStatsRef) {
  await context.route("**/*", async (route) => {
    const request = route.request();
    const stats = currentStatsRef.current;
    let parsedUrl;

    try {
      parsedUrl = new URL(request.url());
    } catch {
      await route.abort();
      return;
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      await route.abort();
      return;
    }

    if (parsedUrl.host !== ALLOWED_HOST) {
      stats.blockedExternalHosts.add(parsedUrl.host);
      await route.abort();
      return;
    }

    if (request.resourceType() === "media") {
      stats.blockedMediaCount += 1;
      await route.abort();
      return;
    }

    if (DOWNLOAD_LIKE_PATH_PATTERN.test(parsedUrl.pathname)) {
      stats.blockedDownloadLikeCount += 1;
      await route.abort();
      return;
    }

    await route.continue();
  });
}

async function detectBlockedPage(page) {
  return page.evaluate((blockedPatternSource) => {
    const pattern = new RegExp(blockedPatternSource, "i");
    const text = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
    return pattern.test(text);
  }, BLOCKED_TEXT_PATTERN.source);
}

async function extractVisibleLessonContent(page, expectedTitle) {
  return page.evaluate(
    ({ expectedTitle, allowedHost, financialPatternSource, assignmentPatternSource }) => {
      const financialPattern = new RegExp(financialPatternSource, "i");
      const assignmentPattern = new RegExp(assignmentPatternSource, "i");
      const blockTags = new Set([
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "P",
        "LI",
        "BLOCKQUOTE",
        "PRE",
        "TD",
        "TH",
        "LABEL",
        "LEGEND",
        "SUMMARY",
      ]);
      const genericBlockTags = new Set([
        "DIV",
        "SECTION",
        "ARTICLE",
        "ASIDE",
        "FORM",
        "FIGURE",
      ]);
      const skipTags = new Set([
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "SVG",
        "CANVAS",
        "VIDEO",
        "AUDIO",
        "IFRAME",
      ]);
      const skipAreaSelector = [
        ".lesson-answer-comment",
        ".lt-lesson-feedback-block",
        ".comment-files-widget",
        ".answer-file-box",
        ".user-related-data",
        "[class*='comment']",
        "[class*='answer'][class*='comment']",
        "[class*='lesson-navigation']",
        "[class*='breadcrumb']",
        "[class*='user-profile']",
        "[class*='user-state']",
        "[class*='avatar']",
      ].join(",");
      const utilityPattern =
        /(выйти|профиль|тренинги|уведомления|адрес электронной почты не подтвержден|подтвердить|назад|меню|помощь|техподдержка|список тренингов|программа финздоровье|школа финансовой грамотности|предыдущий урок|следующий урок|старые ответы|новые ответы|ответы и комментарии|задание принято|нравится|подписаться|загрузить аватарку|показать еще комментарии|скрывать ответ от других учеников|добавить файлы|максимальный размер файла|отправить|мы используем cookie-файлы|подробнее|ok)/i;
      const serviceNoticePattern =
        /Мы используем cookie-файлы\. Это нужно для лучшей работы сайта\. Продолжая пользоваться сайтом, вы соглашаетесь с этим\.?/i;
      const adminMenuPattern =
        /Редактировать урок[\s\S]{0,500}(Проверка заданий|Создать новое уведомление|Перенести урок|Копировать урок|История изменений|Удалить урок)|^Действия\s+Задание\s+Настройки[\s\S]{0,500}(Проверка заданий|Создать новое уведомление|Перенести урок|Копировать урок|История изменений|Удалить урок)/i;
      const codeNoisePattern =
        /(\$\(function|\.lt-block-wrapper|\.videoWrapper|comment-files-widget|\{"signature"|accountUserId|object_type_id|comment_class|data-reactroot|function\s*\(|=>|\bvar\s+|\blet\s+|\bconst\s+)/i;

      function normalize(value, maxLength = 20_000) {
        return (value || "")
          .replace(/\u00a0/g, " ")
          .replace(/[\t ]+/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim()
          .slice(0, maxLength);
      }

      function line(value, maxLength = 500) {
        return normalize(value, maxLength).replace(/\s+/g, " ").trim();
      }

      function isVisible(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          return false;
        }

        const style = window.getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0
        ) {
          return false;
        }

        const rects = element.getClientRects();
        if (!rects.length && style.position !== "fixed") {
          return false;
        }

        return true;
      }

      function isInsideSkippedArea(element) {
        return Boolean(element.closest?.(skipAreaSelector));
      }

      function textOf(element, maxLength = 20_000) {
        if (!element) {
          return "";
        }
        const clone = element.cloneNode(true);
        clone
          .querySelectorAll("script,style,noscript,svg,canvas,iframe,video,audio")
          .forEach((node) => node.remove());

        const blockTextTags = new Set([
          "ADDRESS",
          "ARTICLE",
          "ASIDE",
          "BLOCKQUOTE",
          "BR",
          "DD",
          "DIV",
          "DL",
          "DT",
          "FIGCAPTION",
          "FIGURE",
          "FOOTER",
          "FORM",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "HEADER",
          "HR",
          "LI",
          "MAIN",
          "NAV",
          "OL",
          "P",
          "PRE",
          "SECTION",
          "TABLE",
          "TBODY",
          "TD",
          "TFOOT",
          "TH",
          "THEAD",
          "TR",
          "UL",
        ]);

        function collect(node, parts) {
          if (node.nodeType === Node.TEXT_NODE) {
            parts.push(node.nodeValue || "");
            return;
          }
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
          }
          const tag = node.tagName;
          if (tag === "BR") {
            parts.push("\n");
            return;
          }
          const isBlock = blockTextTags.has(tag);
          if (isBlock) {
            parts.push("\n");
          }
          for (const child of node.childNodes) {
            collect(child, parts);
          }
          if (isBlock) {
            parts.push("\n");
          }
        }

        const parts = [];
        collect(clone, parts);
        return normalize(parts.join(""), maxLength);
      }

      function isNoiseText(value) {
        const oneLine = line(value, 1_500);
        if (!oneLine) {
          return true;
        }
        if (serviceNoticePattern.test(oneLine)) {
          return true;
        }
        if (adminMenuPattern.test(value) || adminMenuPattern.test(oneLine)) {
          return true;
        }
        if (codeNoisePattern.test(oneLine)) {
          return true;
        }
        if (/^\{[\s\S]*\}$/.test(oneLine) && /"[^"]+":/.test(oneLine)) {
          return true;
        }
        return oneLine.length < 120 && utilityPattern.test(oneLine);
      }

      function safeUrl(rawUrl) {
        if (!rawUrl) {
          return null;
        }
        try {
          const url = new URL(rawUrl, document.baseURI);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return null;
          }
          url.username = "";
          url.password = "";
          url.hash = "";
          const stripped = url.search.length > 0;
          url.search = "";
          return {
            url: url.href,
            host: url.host,
            stripped,
          };
        } catch {
          return null;
        }
      }

      function selectorFor(element) {
        if (!element) {
          return "document.body";
        }
        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        const className = Array.from(element.classList || [])
          .slice(0, 3)
          .map((classPart) => `.${CSS.escape(classPart)}`)
          .join("");
        return `${element.tagName.toLowerCase()}${className}`;
      }

      function countTextCandidates(root) {
        return Array.from(root.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,pre"))
          .filter((node) => isVisible(node) && !isInsideSkippedArea(node))
          .map((node) => line(textOf(node), 2_000))
          .filter(Boolean).length;
      }

      function scoreRoot(root) {
        const text = textOf(root, 80_000);
        if (!text) {
          return -1;
        }

        let score = Math.min(text.length, 20_000);
        const selector = selectorFor(root).toLowerCase();
        if (/lesson|content|main|article|page|container|center/.test(selector)) {
          score += 5_000;
        }
        if (expectedTitle && text.includes(expectedTitle)) {
          score += 4_000;
        }
        score += countTextCandidates(root) * 250;
        if (/menu|sidebar|navigation|nav|header|footer/.test(selector)) {
          score -= 5_000;
        }
        return score;
      }

      const preferredTitleNodes = Array.from(
        document.querySelectorAll(
          ".lesson-title-value,.lesson-title,[class*='lesson'][class*='title'],h2,h1",
        ),
      ).filter((node) => isVisible(node) && !isInsideSkippedArea(node) && line(textOf(node)));
      const titleNode =
        preferredTitleNodes.find((node) => line(textOf(node)) === expectedTitle) ||
        preferredTitleNodes.find((node) => line(textOf(node)).includes(expectedTitle)) ||
        preferredTitleNodes.find((node) => expectedTitle.includes(line(textOf(node)))) ||
        preferredTitleNodes[0] ||
        null;
      const title = line(textOf(titleNode) || expectedTitle);

      const rootSelectors = [
        "main",
        "article",
        "[role='main']",
        ".lesson-content",
        ".lesson-content-text",
        ".lesson-content-value",
        ".lesson-body",
        ".lesson-main",
        ".lesson-container",
        ".gc-main-content",
        ".page-content",
        ".main-page-block",
        ".standard-page-content",
        ".center-block",
        ".container",
      ];
      const roots = Array.from(
        new Set(
          rootSelectors
            .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
            .filter(isVisible),
        ),
      );
      roots.push(document.body);
      const root = roots.sort((left, right) => scoreRoot(right) - scoreRoot(left))[0];
      const rootSelector = selectorFor(root);

      function hasUsefulBlockChildren(element) {
        return Array.from(element.children || []).some((child) => {
          if (!isVisible(child) || skipTags.has(child.tagName) || isInsideSkippedArea(child)) {
            return false;
          }
          if (blockTags.has(child.tagName)) {
            return line(textOf(child)).length > 0;
          }
          if (genericBlockTags.has(child.tagName)) {
            return hasUsefulBlockChildren(child);
          }
          return false;
        });
      }

      const rawBlocks = [];
      const candidates = Array.from(root.querySelectorAll("*"));
      for (const element of candidates) {
        if (!isVisible(element) || skipTags.has(element.tagName) || isInsideSkippedArea(element)) {
          continue;
        }

        const tag = element.tagName;
        const isSemanticBlock = blockTags.has(tag);
        const isGenericLeaf = genericBlockTags.has(tag) && !hasUsefulBlockChildren(element);
        if (!isSemanticBlock && !isGenericLeaf) {
          continue;
        }

        let text = textOf(element, 8_000);
        if (!text || isNoiseText(text)) {
          continue;
        }

        const lines = text
          .split(/\n+/)
          .map((part) => line(part, 1_500))
          .filter(Boolean);
        text = lines.join("\n");
        const oneLine = line(text, 1_500);
        if (!oneLine || oneLine.length < 2) {
          continue;
        }
        if (oneLine === "Путь к деньгам" && expectedTitle !== "Путь к деньгам") {
          continue;
        }
        if (oneLine === title) {
          rawBlocks.push({
            kind: "heading",
            level: 1,
            text: oneLine,
            selector: selectorFor(element),
          });
          continue;
        }
        if (utilityPattern.test(oneLine) && oneLine.length < 120) {
          continue;
        }

        let kind = "text";
        let level = null;
        if (/^H[1-6]$/.test(tag)) {
          kind = "heading";
          level = Number(tag.slice(1));
        } else if (tag === "LI") {
          kind = "listItem";
        } else if (tag === "LABEL" || tag === "LEGEND" || tag === "FORM") {
          kind = "form";
        }

        rawBlocks.push({
          kind,
          level,
          text,
          selector: selectorFor(element),
        });
      }

      const blocks = [];
      const seenBlocks = new Set();
      for (const block of rawBlocks) {
        const key = line(block.text, 1_500).toLowerCase();
        if (!key || seenBlocks.has(key)) {
          continue;
        }
        seenBlocks.add(key);
        blocks.push(block);
      }

      const structure = blocks
        .filter(
          (block) =>
            block.kind === "heading" &&
            line(block.text) !== title &&
            !utilityPattern.test(line(block.text)),
        )
        .map((block) => ({
          level: block.level || 2,
          text: line(block.text, 220),
          selector: block.selector,
        }));

      const assignments = blocks
        .filter((block) => assignmentPattern.test(block.text))
        .map((block) => ({
          text: normalize(block.text, 2_000),
          selector: block.selector,
        }));

      const financialClaims = blocks
        .filter((block) => financialPattern.test(block.text))
        .map((block) => ({
          text: line(block.text, 500),
          selector: block.selector,
        }));

      const linkNodes = Array.from(root.querySelectorAll("a[href]")).filter(
        (node) => isVisible(node) && !isInsideSkippedArea(node),
      );
      const links = [];
      for (const anchor of linkNodes) {
        const normalized = safeUrl(anchor.getAttribute("href"));
        if (!normalized) {
          continue;
        }
        const text =
          line(textOf(anchor), 220) ||
          line(anchor.getAttribute("title") || anchor.getAttribute("aria-label"), 220) ||
          normalized.url;
        const linkPath = new URL(normalized.url).pathname;
        if (
          utilityPattern.test(text) ||
          /^\/(?:pl\/)?teach\/control\/lesson\/view\b/i.test(linkPath) ||
          /^\/pl\/\d+\b/.test(linkPath) ||
          /^\/user\/my\/profile\b/i.test(linkPath) ||
          (/^\/(?:pl\/)?teach\/control\/stream\b/i.test(linkPath) &&
            ["Путь к деньгам", "Список тренингов", "Программа ФинЗдоровье", "Школа финансовой грамотности"].includes(text)) ||
          anchor.closest("[class*='lesson-navigation'],[class*='breadcrumb']")
        ) {
          continue;
        }
        links.push({
          text,
          url: normalized.url,
          host: normalized.host,
          isAllowedHost: normalized.host === allowedHost,
          strippedQuery: normalized.stripped,
          selector: selectorFor(anchor),
        });
      }

      const videoCandidates = Array.from(
        root.querySelectorAll(
          "iframe,video,[class*='video'],[class*='player'],[data-video-id],[data-provider],[data-src],[data-url]",
        ),
      ).filter(isVisible);
      const videos = [];

      for (const element of videoCandidates) {
        const hasVideoAttrs = [
          "src",
          "data-src",
          "data-url",
          "data-video-id",
          "data-provider",
          "poster",
        ].some((name) => element.hasAttribute(name));
        if (!["IFRAME", "VIDEO"].includes(element.tagName) && !hasVideoAttrs) {
          continue;
        }

        const attrs = {};
        for (const name of [
          "src",
          "data-src",
          "data-url",
          "data-video-id",
          "data-provider",
          "data-title",
          "title",
          "poster",
        ]) {
          const value = element.getAttribute(name);
          if (!value) {
            continue;
          }
          if (name === "src" || name === "data-src" || name === "data-url" || name === "poster") {
            const normalized = safeUrl(value);
            attrs[name] = normalized?.url || line(value, 300);
            if (normalized?.stripped) {
              attrs[`${name}QueryStripped`] = true;
            }
          } else {
            attrs[name] = line(value, 300);
          }
        }

        const visibleText = isNoiseText(textOf(element, 500)) ? "" : line(textOf(element), 500);
        const providerSource =
          attrs["data-provider"] ||
          attrs.src ||
          attrs["data-src"] ||
          attrs["data-url"] ||
          "";
        let provider = null;
        try {
          provider = providerSource ? new URL(providerSource, document.baseURI).host : null;
        } catch {
          provider = attrs["data-provider"] || null;
        }

        videos.push({
          tag: element.tagName.toLowerCase(),
          provider,
          title: attrs.title || attrs["data-title"] || visibleText || null,
          duration: line(
            element.getAttribute("duration") ||
              element.getAttribute("data-duration") ||
              element.querySelector?.("[class*='duration']")?.innerText ||
              "",
            120,
          ),
          poster: attrs.poster || null,
          embedUrl: attrs.src || attrs["data-src"] || attrs["data-url"] || null,
          visibleText,
          selector: selectorFor(element),
          queryStripped:
            attrs.srcQueryStripped ||
            attrs["data-srcQueryStripped"] ||
            attrs["data-urlQueryStripped"] ||
            attrs.posterQueryStripped ||
            false,
        });
      }

      return {
        pageTitle: document.title,
        title,
        rootSelector,
        bodyTextLength: line(textOf(root), 80_000).length,
        blocks,
        structure,
        assignments,
        financialClaims,
        links,
        videos,
      };
    },
    {
      expectedTitle,
      allowedHost: ALLOWED_HOST,
      financialPatternSource: FINANCIAL_CLAIM_PATTERN.source,
      assignmentPatternSource: ASSIGNMENT_PATTERN.source,
    },
  );
}

function networkWarnings(stats) {
  const warnings = [];
  if (stats.blockedExternalHosts.size) {
    warnings.push(
      `blocked off-domain resource hosts: ${Array.from(stats.blockedExternalHosts)
        .sort()
        .join(", ")}`,
    );
  }
  if (stats.blockedMediaCount) {
    warnings.push(`blocked media requests: ${stats.blockedMediaCount}`);
  }
  if (stats.blockedDownloadLikeCount) {
    warnings.push(`blocked download-like requests: ${stats.blockedDownloadLikeCount}`);
  }
  return warnings;
}

function deriveExportStatus(accessStatus, extraction, warnings) {
  if (accessStatus === "needs_login") {
    return "needs_login";
  }
  if (accessStatus === "blocked") {
    return "blocked";
  }
  if (!extraction || extraction.blocks.length < 2 || extraction.bodyTextLength < 80) {
    warnings.push("low visible lesson text; exported as partial");
    return "partial";
  }
  return "exported";
}

function buildBriefDescription(lesson, extraction, exportStatus) {
  if (exportStatus === "needs_login") {
    return "Контент урока не выгружен: сохранённая сессия требует повторной авторизации.";
  }
  if (exportStatus === "blocked") {
    return "Контент урока не выгружен: страница сообщает об ограничении доступа.";
  }
  if (!extraction?.blocks.length) {
    return "Фактическое описание недоступно: на странице не найден видимый текст урока.";
  }

  const structureTexts = extraction.structure.map((item) => item.text).filter(Boolean);
  if (structureTexts.length && !(structureTexts.length === 1 && structureTexts[0] === "Задание")) {
    return `На странице видимы блоки: ${structureTexts.slice(0, 5).join("; ")}.`;
  }

  const firstText = extraction.blocks
    .filter((block) => block.kind !== "heading" && compactLine(block.text) !== lesson.title)
    .map((block) => compactLine(block.text, 500))
    .find(Boolean);

  return firstText
    ? `Первый видимый содержательный фрагмент: ${firstText}`
    : "На странице найден текстовый материал урока без явных подзаголовков.";
}

function formatMainContent(extraction) {
  if (!extraction?.blocks.length) {
    return "Статус: видимый текст урока не найден.";
  }

  const assignmentTexts = new Set(
    extraction.assignments.map((assignment) => compactLine(assignment.text).toLowerCase()),
  );
  const parts = [];

  for (const block of extraction.blocks) {
    const text = normalizeText(block.text, 8_000);
    if (!text || assignmentTexts.has(compactLine(text).toLowerCase())) {
      continue;
    }
    if (block.kind === "heading") {
      parts.push(`### ${compactLine(text, 220)}`);
    } else if (block.kind === "listItem") {
      parts.push(`- ${text.replace(/\n/g, "\n  ")}`);
    } else {
      parts.push(text);
    }
  }

  return parts.length ? parts.join("\n\n") : "Весь найденный видимый текст относится к заданиям или формам.";
}

function formatAssignments(extraction) {
  if (!extraction?.assignments.length) {
    return "Видимые задания, вопросы, формы или домашняя работа не найдены.";
  }

  return dedupeByText(extraction.assignments, 40)
    .map((assignment) => `- ${normalizeText(assignment.text, 2_000).replace(/\n/g, "\n  ")}`)
    .join("\n");
}

function formatLinks(extraction) {
  if (!extraction?.links.length) {
    return "Видимые ссылки на материалы или внешние ресурсы не найдены.";
  }

  const seen = new Set();
  const links = extraction.links.filter((link) => {
    const key = `${link.text}|${link.url}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return links
    .map((link) => {
      const flags = [];
      if (!link.isAllowedHost) {
        flags.push(`external host: ${link.host}`);
      }
      if (link.strippedQuery) {
        flags.push("query stripped");
      }
      const suffix = flags.length ? ` (${flags.join("; ")})` : "";
      return `- [${markdownEscapeLinkText(link.text)}](${link.url})${suffix}`;
    })
    .join("\n");
}

function formatVideos(extraction) {
  if (!extraction?.videos.length) {
    return "Видео или embed-блоки по видимой DOM-структуре не найдены.";
  }

  return extraction.videos
    .map((video) => {
      const lines = [
        `- provider: ${video.provider || "unknown"}`,
        `  title: ${video.title || "not_visible"}`,
      ];
      if (video.duration) {
        lines.push(`  duration: ${video.duration}`);
      }
      if (video.poster) {
        lines.push(`  poster: ${video.poster}`);
      }
      if (video.embedUrl) {
        lines.push(`  embedUrl: ${video.embedUrl}`);
      }
      if (video.visibleText && video.visibleText !== video.title) {
        lines.push(`  visibleText: ${video.visibleText}`);
      }
      if (video.queryStripped) {
        lines.push("  warning: query stripped from URL metadata");
      }
      return lines.join("\n");
    })
    .join("\n");
}

function formatFinancialClaims(extraction) {
  if (!extraction?.financialClaims.length) {
    return "Фрагменты с финансовыми утверждениями по эвристике не найдены; humanReview всё равно требуется для итоговой методической проверки.";
  }

  return dedupeByText(extraction.financialClaims, 60)
    .map((claim) => `- ${compactLine(claim.text, 700)}`)
    .join("\n");
}

function buildMarkdown({ lesson, extraction, exportStatus, exportedAt, accessStatus, warnings }) {
  const title = extraction?.title || lesson.title;
  const structureItems = extraction?.structure?.length
    ? extraction.structure.map((item) => item.text)
    : extraction?.blocks?.length
      ? ["Основной текст урока"]
      : [];
  const sourceSelectors = extraction
    ? dedupeByText([
        extraction.rootSelector,
        ...extraction.blocks.slice(0, 20).map((block) => block.selector),
      ])
    : [];

  return `---
index: ${lesson.index}
title: ${yamlQuote(title)}
sourceUrl: ${yamlQuote(lesson.url)}
exportStatus: ${yamlQuote(exportStatus)}
exportedAt: ${yamlQuote(exportedAt)}
humanReview: "required"
---

# ${title}

## Краткое описание

${buildBriefDescription(lesson, extraction, exportStatus)}

## Структура урока

${formatNumberedList(structureItems, "Явная структура блоков не найдена.")}

## Основной контент

${formatMainContent(extraction)}

## Задания и вопросы

${formatAssignments(extraction)}

## Материалы и ссылки

${formatLinks(extraction)}

## Видео и embeds

${formatVideos(extraction)}

## Финансовые утверждения для проверки

${formatFinancialClaims(extraction)}

## Технические заметки выгрузки

- accessStatus: ${accessStatus}
- warnings: ${warnings.length ? warnings.join("; ") : "none"}
- sourceTextSelectors: ${sourceSelectors.length ? sourceSelectors.join(", ") : "none"}
- visibleBlockCount: ${extraction?.blocks?.length || 0}
- visibleLinkCount: ${extraction?.links?.length || 0}
- visibleVideoEmbedCount: ${extraction?.videos?.length || 0}
- safetyPolicy: opened only ${ALLOWED_HOST} lesson pages; media/download-like/off-domain requests blocked; files and videos were not downloaded
`;
}

function buildNoAccessMarkdown({ lesson, exportStatus, exportedAt, accessStatus, warnings }) {
  return buildMarkdown({
    lesson,
    extraction: null,
    exportStatus,
    exportedAt,
    accessStatus,
    warnings,
  });
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

async function saveDebugSnapshot(page, debugDir, lesson, reason) {
  await fs.mkdir(debugDir, { recursive: true });
  const lessonId = new URL(lesson.url).pathname.split("/").pop();
  const baseName = `${String(lesson.index).padStart(2, "0")}-${lessonId}`;

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

  const htmlPath = path.join(debugDir, `${baseName}.html`);
  const screenshotPath = path.join(debugDir, `${baseName}.png`);
  await fs.writeFile(htmlPath, sanitizeDebugHtml(await page.content()), "utf8");
  await page.screenshot({ path: screenshotPath, fullPage: true });

  return `debug saved for ${reason}: ${path.relative(process.cwd(), htmlPath)}, ${path.relative(process.cwd(), screenshotPath)}`;
}

async function exportNeedsLoginMarkdown(lessons, targets, contentDir, exportedAt, startIndex) {
  for (const lesson of lessons.slice(startIndex)) {
    const target = targetForLesson(targets, lesson, contentDir);
    await fs.writeFile(
      target,
      buildNoAccessMarkdown({
        lesson,
        exportStatus: "needs_login",
        exportedAt,
        accessStatus: "needs_login",
        warnings: ["manual login required; headless run cannot continue"],
      }),
      "utf8",
    );
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const linksPath = path.resolve(options.linksPath);
  const contentDir = path.resolve(options.contentDir);
  const outputDir = path.resolve(options.outputDir);
  const debugDir = path.join(outputDir, DEFAULT_DEBUG_DIR);
  const statePath = path.resolve(options.statePath);
  const hasStorageState = await fileExists(statePath);
  const lessons = await loadLessonLinks(linksPath);
  const targets = await loadMarkdownTargets(contentDir);
  const exportedAt = new Date().toISOString();

  await fs.mkdir(path.dirname(statePath), { recursive: true });

  const browser = await chromium.launch({
    headless: options.headless,
  });
  const currentStatsRef = { current: createNetworkStats() };

  try {
    const context = await browser.newContext({
      ...(hasStorageState ? { storageState: statePath } : {}),
      acceptDownloads: false,
      locale: "ru-RU",
      timezoneId: "Europe/Moscow",
      viewport: { width: 1440, height: 1000 },
    });
    await installSafeRouting(context, currentStatsRef);
    const page = await context.newPage();

    console.log(`Уроков к выгрузке: ${lessons.length}`);
    console.log(`Content dir: ${contentDir}`);

    for (const [lessonIndex, lesson] of lessons.entries()) {
      const target = targetForLesson(targets, lesson, contentDir);

      currentStatsRef.current = createNetworkStats();
      console.log(`${lesson.index}. Открываю урок: ${lesson.title}`);
      await openLessonPage(page, lesson.url);

      if (await looksLikeAuthPage(page)) {
        if (options.headless) {
          await exportNeedsLoginMarkdown(lessons, targets, contentDir, exportedAt, lessonIndex);
          throw new Error(
            "Authorization is required, but the exporter is running headless. Re-run without --headless and log in manually.",
          );
        }

        await waitForManualLogin(page, lesson.url);
        await context.storageState({ path: statePath });
      }

      let accessStatus = "ok";
      if (await looksLikeAuthPage(page)) {
        accessStatus = "needs_login";
      } else if (await detectBlockedPage(page)) {
        accessStatus = "blocked";
      }

      let extraction = null;
      if (accessStatus === "ok") {
        extraction = await extractVisibleLessonContent(page, lesson.title);
      }

      const warnings = networkWarnings(currentStatsRef.current);
      if (extraction?.links?.some((link) => link.strippedQuery)) {
        warnings.push("query parameters stripped from visible link URLs");
      }
      if (extraction?.videos?.some((video) => video.queryStripped)) {
        warnings.push("query parameters stripped from video/embed metadata URLs");
      }

      const exportStatus = deriveExportStatus(accessStatus, extraction, warnings);
      if (options.debug && (options.debugAll || exportStatus !== "exported")) {
        warnings.push(await saveDebugSnapshot(page, debugDir, lesson, exportStatus));
      }

      const markdown =
        exportStatus === "needs_login" || exportStatus === "blocked"
          ? buildNoAccessMarkdown({
              lesson,
              exportStatus,
              exportedAt,
              accessStatus,
              warnings,
            })
          : buildMarkdown({
              lesson,
              extraction,
              exportStatus,
              exportedAt,
              accessStatus,
              warnings,
            });

      await fs.writeFile(target, markdown, "utf8");
      console.log(
        `   -> ${path.relative(process.cwd(), target)} (${exportStatus}, blocks: ${extraction?.blocks?.length || 0})`,
      );
    }

    await context.storageState({ path: statePath });
    console.log(`Сессия Playwright сохранена вне git: ${statePath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`GetCourse lesson content export failed: ${error.message}`);
  process.exitCode = 1;
});
