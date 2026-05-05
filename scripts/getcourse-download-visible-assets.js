#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const ALLOWED_HOST = "fgrm.ncfg.ru";
const DEFAULT_LINKS_PATH = "course-export/stream-546010026/all-lesson-links.json";
const DEFAULT_STATE_PATH = ".local/getcourse/admin-storage-state.json";
const DEFAULT_DOWNLOAD_DIR = "content/getcourse-finstrategy/downloads";
const DEFAULT_MANIFEST_PATH =
  "course-export/stream-546010026/download-manifest.json";
const LESSON_PATH_PATTERN = /^\/(?:pl\/)?teach\/control\/lesson\/view\b/i;
const DOWNLOAD_PATH_PATTERN =
  /\/pl\/fileservice\/user\/file\/download\b|\/fileservice\/file\/download\b|\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz)(?:$|[?#])/i;
const MEDIA_PATH_PATTERN = /\.(?:mp4|m4v|mov|avi|mkv|webm|m3u8|mpd)(?:$|[?#])/i;
const MAX_DOWNLOAD_BYTES = 200 * 1024 * 1024;

function parseArgs(argv) {
  const options = {
    linksPath: process.env.GETCOURSE_LESSON_LINKS || DEFAULT_LINKS_PATH,
    statePath: process.env.GETCOURSE_STORAGE_STATE || DEFAULT_STATE_PATH,
    downloadDir: process.env.GETCOURSE_DOWNLOAD_DIR || DEFAULT_DOWNLOAD_DIR,
    manifestPath: process.env.GETCOURSE_DOWNLOAD_MANIFEST || DEFAULT_MANIFEST_PATH,
    headless: process.env.GETCOURSE_HEADLESS !== "0",
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
    } else if (arg.startsWith("--links=")) {
      options.linksPath = arg.slice("--links=".length);
    } else if (arg.startsWith("--state=")) {
      options.statePath = arg.slice("--state=".length);
    } else if (arg.startsWith("--download-dir=")) {
      options.downloadDir = arg.slice("--download-dir=".length);
    } else if (arg.startsWith("--manifest=")) {
      options.manifestPath = arg.slice("--manifest=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Download visible GetCourse lesson attachments without bypassing access controls.

Usage:
  pnpm getcourse:download-assets -- --headless
  pnpm getcourse:download-assets -- --state=.local/getcourse/admin-storage-state.json

Safety policy:
  - opens only https://${ALLOWED_HOST}/teach/control/lesson/view/... pages;
  - downloads only same-host visible file-service/document links;
  - skips videos, streaming media, external hosts and non-file pages;
  - stores files under content/getcourse-finstrategy/downloads by default;
  - records a manifest without raw query strings.
`);
}

function assertAllowedLessonUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (
    parsed.protocol !== "https:" ||
    parsed.host !== ALLOWED_HOST ||
    !LESSON_PATH_PATTERN.test(parsed.pathname)
  ) {
    throw new Error(
      `Refusing to open ${rawUrl}. This downloader is limited to ${ALLOWED_HOST} lesson pages.`,
    );
  }
  parsed.hash = "";
  return parsed.href;
}

function publicUrlForManifest(rawUrl) {
  const parsed = new URL(rawUrl);
  const hadQuery = parsed.search.length > 0;
  parsed.username = "";
  parsed.password = "";
  parsed.hash = "";
  parsed.search = "";
  return { url: parsed.href, hadQuery };
}

function sanitizeFileName(value) {
  const translit = {
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "E",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sch",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  };
  const cyrillicSafe = String(value || "asset").replace(/[А-Яа-яЁё]/g, (char) => {
    const upper = char.toUpperCase();
    const replacement = translit[upper] || "";
    return char === upper ? replacement : replacement.toLowerCase();
  });

  return cyrillicSafe
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function extensionFromContentType(contentType) {
  const value = String(contentType || "").toLowerCase();
  if (value.includes("pdf")) return ".pdf";
  if (value.includes("wordprocessingml") || value.includes("msword")) return ".docx";
  if (value.includes("spreadsheetml") || value.includes("excel")) return ".xlsx";
  if (value.includes("presentationml") || value.includes("powerpoint")) return ".pptx";
  if (value.includes("zip")) return ".zip";
  if (value.includes("7z")) return ".7z";
  if (value.includes("rar")) return ".rar";
  return "";
}

function extensionFromUrl(rawUrl) {
  const pathname = new URL(rawUrl).pathname;
  const match = pathname.match(/\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz)$/i);
  return match ? `.${match[1].toLowerCase()}` : "";
}

function contentDispositionFileName(value) {
  if (!value) {
    return "";
  }

  const utfMatch = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch) {
    try {
      return decodeURIComponent(utfMatch[1]);
    } catch {
      return utfMatch[1];
    }
  }

  const plainMatch = value.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1] || "";
}

function pickFileName(asset, responseHeaders, ordinal) {
  const fromDisposition = contentDispositionFileName(
    responseHeaders["content-disposition"],
  );
  const baseFromUrl = path.basename(new URL(asset.rawUrl).pathname);
  const rawBase =
    asset.text ||
    fromDisposition ||
    (baseFromUrl && baseFromUrl !== "download" ? baseFromUrl : "") ||
    `asset-${ordinal}`;
  const cleanedRawBase = rawBase.replace(
    /\(\s*\d+(?:[.,]\d+)?\s*(?:кб|kb|мб|mb)\s*\)$/i,
    "",
  );
  const rawExtensionMatch = cleanedRawBase.match(
    /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz)$/i,
  );
  const ext =
    (rawExtensionMatch ? `.${rawExtensionMatch[1].toLowerCase()}` : "") ||
    extensionFromUrl(asset.rawUrl) ||
    extensionFromContentType(responseHeaders["content-type"]) ||
    ".bin";
  const baseSource = rawExtensionMatch
    ? cleanedRawBase.slice(0, -rawExtensionMatch[0].length)
    : cleanedRawBase;
  const base = sanitizeFileName(baseSource);
  return `${String(asset.lessonIndex).padStart(2, "0")}-${String(ordinal).padStart(2, "0")}-${base || "asset"}${ext}`;
}

async function loadLessons(linksPath) {
  const data = JSON.parse(await fs.readFile(linksPath, "utf8"));
  if (!Array.isArray(data.lessons)) {
    throw new Error(`${linksPath} does not contain a lessons array.`);
  }

  return data.lessons.map((lesson) => ({
    index: Number(lesson.index),
    title: lesson.title,
    url: assertAllowedLessonUrl(lesson.url),
  }));
}

async function installSafePageRouting(context, stats) {
  await context.route("**/*", async (route) => {
    const request = route.request();
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

    if (request.resourceType() === "media" || MEDIA_PATH_PATTERN.test(parsedUrl.pathname)) {
      stats.blockedMediaCount += 1;
      await route.abort();
      return;
    }

    await route.continue();
  });
}

async function extractVisibleDownloadLinks(page, lesson) {
  return page.evaluate(
    ({ allowedHost, lessonIndex, lessonTitle }) => {
      function normalize(value, maxLength = 500) {
        return (value || "")
          .replace(/\u00a0/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, maxLength);
      }

      function isVisible(element) {
        const style = window.getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0
        ) {
          return false;
        }
        return element.getClientRects().length > 0 || style.position === "fixed";
      }

      function safeRawUrl(rawUrl) {
        try {
          const url = new URL(rawUrl, document.baseURI);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return null;
          }
          url.username = "";
          url.password = "";
          url.hash = "";
          return url.href;
        } catch {
          return null;
        }
      }

      return Array.from(document.querySelectorAll("a[href]"))
        .filter((anchor) => isVisible(anchor))
        .map((anchor, domIndex) => {
          const rawUrl = safeRawUrl(anchor.getAttribute("href"));
          if (!rawUrl) {
            return null;
          }
          const parsed = new URL(rawUrl);
          const text =
            normalize(anchor.innerText || anchor.textContent, 220) ||
            normalize(anchor.getAttribute("title") || anchor.getAttribute("aria-label"), 220) ||
            parsed.pathname;
          return {
            lessonIndex,
            lessonTitle,
            domIndex,
            text,
            rawUrl,
            host: parsed.host,
            path: parsed.pathname,
          };
        })
        .filter(Boolean)
        .filter((asset) => asset.host === allowedHost)
        .filter((asset) =>
          /\/pl\/fileservice\/user\/file\/download\b|\/fileservice\/file\/download\b|\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz)(?:$|[?#])/i.test(asset.path),
        )
        .filter((asset) => !/\.(?:mp4|m4v|mov|avi|mkv|webm|m3u8|mpd)(?:$|[?#])/i.test(asset.path));
    },
    {
      allowedHost: ALLOWED_HOST,
      lessonIndex: lesson.index,
      lessonTitle: lesson.title,
    },
  );
}

async function openLessonPage(page, lessonUrl) {
  await page.goto(lessonUrl, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const lessons = await loadLessons(path.resolve(options.linksPath));
  const statePath = path.resolve(options.statePath);
  const downloadDir = path.resolve(options.downloadDir);
  const manifestPath = path.resolve(options.manifestPath);
  const pageStats = {
    blockedExternalHosts: new Set(),
    blockedMediaCount: 0,
  };

  await fs.mkdir(downloadDir, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  const browser = await chromium.launch({ headless: options.headless });
  const manifest = {
    generatedAt: new Date().toISOString(),
    linksPath: path.relative(process.cwd(), path.resolve(options.linksPath)),
    statePath: path.relative(process.cwd(), statePath),
    downloadDir: path.relative(process.cwd(), downloadDir),
    allowedHost: ALLOWED_HOST,
    policy: [
      "opened only allowed-host lesson pages",
      "downloaded only visible same-host file-service/document links",
      "skipped videos, streaming media and external hosts",
      "raw query strings are not recorded in this manifest",
    ],
    assets: [],
    summary: {},
  };

  try {
    const context = await browser.newContext({
      storageState: statePath,
      acceptDownloads: false,
      locale: "ru-RU",
      timezoneId: "Europe/Moscow",
      viewport: { width: 1440, height: 1000 },
    });
    await installSafePageRouting(context, pageStats);
    const page = await context.newPage();
    const seen = new Map();

    for (const lesson of lessons) {
      console.log(`${lesson.index}. Inspecting visible assets: ${lesson.title}`);
      await openLessonPage(page, lesson.url);
      const assets = await extractVisibleDownloadLinks(page, lesson);
      for (const asset of assets) {
        if (!seen.has(asset.rawUrl)) {
          seen.set(asset.rawUrl, {
            ...asset,
            references: [],
          });
        }
        seen.get(asset.rawUrl).references.push({
          lessonIndex: lesson.index,
          lessonTitle: lesson.title,
        });
      }
    }

    let ordinal = 1;
    for (const asset of seen.values()) {
      const publicUrl = publicUrlForManifest(asset.rawUrl);
      const manifestAsset = {
        lessonIndex: asset.lessonIndex,
        lessonTitle: asset.lessonTitle,
        text: asset.text,
        url: publicUrl.url,
        hadQuery: publicUrl.hadQuery,
        references: asset.references,
        status: "pending",
      };

      try {
        const response = await context.request.get(asset.rawUrl, {
          timeout: 120_000,
          maxRedirects: 5,
        });
        const headers = response.headers();
        const contentType = headers["content-type"] || "";
        const contentLength = Number(headers["content-length"] || 0);

        if (!response.ok()) {
          manifestAsset.status = "failed";
          manifestAsset.httpStatus = response.status();
          manifest.assets.push(manifestAsset);
          continue;
        }
        if (/^video\/|^audio\/|mpegurl|dash/i.test(contentType)) {
          manifestAsset.status = "skipped_media";
          manifestAsset.contentType = contentType;
          manifest.assets.push(manifestAsset);
          continue;
        }
        if (contentLength > MAX_DOWNLOAD_BYTES) {
          manifestAsset.status = "skipped_too_large";
          manifestAsset.contentLength = contentLength;
          manifest.assets.push(manifestAsset);
          continue;
        }

        const body = await response.body();
        if (body.length > MAX_DOWNLOAD_BYTES) {
          manifestAsset.status = "skipped_too_large";
          manifestAsset.contentLength = body.length;
          manifest.assets.push(manifestAsset);
          continue;
        }

        const fileName = pickFileName(asset, headers, ordinal);
        ordinal += 1;
        const filePath = path.join(downloadDir, fileName);
        await fs.writeFile(filePath, body);

        manifestAsset.status = "downloaded";
        manifestAsset.file = path.relative(process.cwd(), filePath);
        manifestAsset.contentType = contentType || null;
        manifestAsset.bytes = body.length;
      } catch (error) {
        manifestAsset.status = "failed";
        manifestAsset.error = error.message;
      }

      manifest.assets.push(manifestAsset);
    }

    manifest.summary = manifest.assets.reduce(
      (result, asset) => {
        result.total += 1;
        result[asset.status] = (result[asset.status] || 0) + 1;
        return result;
      },
      { total: 0 },
    );
    manifest.pageWarnings = {
      blockedExternalHosts: Array.from(pageStats.blockedExternalHosts).sort(),
      blockedMediaCount: pageStats.blockedMediaCount,
    };
  } finally {
    await browser.close();
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Downloads: ${path.relative(process.cwd(), downloadDir)}`);
  console.log(`Summary: ${JSON.stringify(manifest.summary)}`);
}

main().catch((error) => {
  console.error(`GetCourse asset download failed: ${error.message}`);
  process.exitCode = 1;
});
