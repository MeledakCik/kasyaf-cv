#!/usr/bin/env node
/**
 * SEO agent: no API keys, no accounts, no dependencies (Node 18+).
 *
 *   node scripts/seo-agent.mjs          audit the live site
 *   node scripts/seo-agent.mjs --ping   audit, then notify search engines (IndexNow)
 *
 * Runs automatically from .github/workflows/seo-agent.yml on every push to main
 * and every week. What it does:
 *  1. Reads robots.txt + sitemap.xml and checks every page the way crawlers see
 *     it: status, <title>, meta description, canonical, <h1>, word count,
 *     Open Graph image, JSON-LD, lang, accidental noindex.
 *  2. Checks that Google, Bing (Edge/DuckDuckGo/Yahoo/ChatGPT search), Apple
 *     (Safari/Siri/Spotlight), Yandex, Naver, Baidu, Seznam and AI-search
 *     crawlers can actually reach the site (not blocked by the bot filter).
 *  3. Checks www / old-domain -> kasyaf.id permanent redirects, llms.txt and
 *     the IndexNow key file.
 *  4. --ping: submits every sitemap URL to IndexNow, which Bing, Yandex, Naver,
 *     Seznam and Yep share, so they recrawl right away instead of weeks later.
 *     (Google has no ping API: it reads the sitemap from Search Console.)
 *
 * Writes a Markdown report to $GITHUB_STEP_SUMMARY when run in GitHub Actions.
 * Exit code 1 if any error was found.
 */
import { appendFileSync } from "node:fs";

const SITE = process.env.SITE_URL || "https://kasyaf.id";
const HOST = new URL(SITE).host;
const INDEXNOW_KEY = "75ae779739948d619c3be029cbe1db0a";
const REDIRECT_HOSTS = ["www.kasyaf.id", "kasyaf-cv.my.id"];
const PING = process.argv.includes("--ping");

const CRAWLERS = {
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Bingbot (Edge, DuckDuckGo, Yahoo, ChatGPT)": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "Applebot (Safari, Siri)":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
  YandexBot: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
  "Naver Yeti": "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)",
  Baiduspider: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
  SeznamBot: "Mozilla/5.0 (compatible; SeznamBot/4.0; +https://o-seznam.cz/napoveda/vyhledavani/en/seznambot-crawler/)",
  "OAI-SearchBot (ChatGPT)": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  PerplexityBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
};
const GOOGLEBOT = CRAWLERS.Googlebot;

const errors = [];
const warnings = [];
const report = [];
const err = (m) => { errors.push(m); console.error(`ERROR  ${m}`); };
const warn = (m) => { warnings.push(m); console.warn(`WARN   ${m}`); };
const ok = (m) => console.log(`ok     ${m}`);

async function get(url, ua = GOOGLEBOT, redirect = "follow") {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, {
        redirect,
        headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
        signal: AbortSignal.timeout(20_000),
      });
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, name) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? decode(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "") : null;
};

async function auditPage(url) {
  const res = await get(url);
  const html = await res.text();
  const row = { url: url.replace(SITE, "") || "/", status: res.status };
  if (res.status !== 200) {
    err(`${url} returned HTTP ${res.status}`);
    report.push(row);
    return;
  }
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "");
  const desc = meta(html, "name", "description") ?? "";
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]?.match(/href=["']([^"']+)["']/i)?.[1];
  const robots = meta(html, "name", "robots") ?? "";
  const ogImage = meta(html, "property", "og:image");
  const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1];
  const h1s = html.match(/<h1[\s>][\s\S]*?<\/h1>/gi) ?? [];
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const jsonLd = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  Object.assign(row, { title: title.length, desc: desc.length, h1: h1s.length, words, jsonLd: jsonLd.length });

  if (!title) err(`${url}: missing <title>`);
  else if (title.length > 70) warn(`${url}: title is ${title.length} chars (Google shows ~60)`);
  if (!desc) err(`${url}: missing meta description`);
  else if (desc.length < 70 || desc.length > 170) warn(`${url}: meta description is ${desc.length} chars (aim for 70-160)`);
  if (!canonical) err(`${url}: missing canonical link`);
  else if (new URL(canonical, SITE).host !== (process.env.CANONICAL_HOST || HOST)) err(`${url}: canonical points to another host (${canonical})`);
  if (/noindex/i.test(robots)) err(`${url}: page is marked noindex`);
  if (h1s.length === 0) err(`${url}: no <h1> in the server-rendered HTML`);
  else if (h1s.length > 1) warn(`${url}: ${h1s.length} <h1> elements (use one)`);
  if (words < 150) warn(`${url}: only ${words} words visible to crawlers`);
  if (!ogImage) warn(`${url}: no og:image (link previews in WhatsApp/LinkedIn/X)`);
  if (!lang) err(`${url}: <html> has no lang attribute`);
  for (const [, json] of jsonLd) {
    try { JSON.parse(json); } catch { err(`${url}: JSON-LD is not valid JSON`); }
  }
  report.push(row);
}

async function main() {
  console.log(`SEO agent -> ${SITE}${PING ? " (with IndexNow ping)" : ""}\n`);

  // robots.txt + sitemap
  const robots = await (await get(`${SITE}/robots.txt`)).text();
  if (!/Sitemap:\s*\S+/i.test(robots)) err("robots.txt has no Sitemap line");
  if (/Disallow:\s*\/\s*$/m.test(robots)) err("robots.txt disallows the whole site");
  else ok("robots.txt");

  const sitemapRes = await get(`${SITE}/sitemap.xml`);
  const sitemap = await sitemapRes.text();
  const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim())))];
  if (sitemapRes.status !== 200 || urls.length === 0) err(`sitemap.xml unusable (HTTP ${sitemapRes.status}, ${urls.length} URLs)`);
  else ok(`sitemap.xml (${urls.length} URLs)`);

  // every page, as Googlebot sees it
  // Audit on the host under test (sitemap URLs are absolute production URLs).
  for (const url of urls) {
    const u = new URL(url);
    await auditPage(`${SITE}${u.pathname}${u.search}`);
  }

  // can each search engine get in?
  const access = [];
  for (const [name, ua] of Object.entries(CRAWLERS)) {
    const status = (await get(`${SITE}/`, ua)).status;
    access.push({ name, status });
    if (status !== 200) err(`${name} gets HTTP ${status} on the home page (blocked?)`);
  }
  ok(`crawler access checked (${access.filter((a) => a.status === 200).length}/${access.length} allowed)`);

  // one canonical host
  for (const h of REDIRECT_HOSTS) {
    try {
      const res = await get(`https://${h}/`, GOOGLEBOT, "manual");
      const loc = res.headers.get("location") || "";
      if (![301, 308].includes(res.status)) warn(`https://${h}/ answers ${res.status}: should be a permanent (301/308) redirect to ${SITE}`);
      else if (new URL(loc, `https://${h}`).host !== HOST) warn(`https://${h}/ redirects to ${loc}, not ${SITE}`);
      else ok(`${h} -> ${HOST} (${res.status})`);
    } catch (e) {
      warn(`https://${h}/ unreachable (${e.cause?.code || e.message})`);
    }
  }

  // llms.txt + IndexNow key
  const llms = await get(`${SITE}/llms.txt`);
  if (llms.status !== 200) warn(`/llms.txt returned ${llms.status}`);
  else ok("llms.txt");
  const keyRes = await get(`${SITE}/${INDEXNOW_KEY}.txt`);
  const keyOk = keyRes.status === 200 && (await keyRes.text()).trim() === INDEXNOW_KEY;
  if (!keyOk) err(`IndexNow key file /${INDEXNOW_KEY}.txt is missing or wrong`);

  // notify search engines
  let pingResult = "skipped";
  if (PING && keyOk && urls.length) {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: urls }),
      signal: AbortSignal.timeout(20_000),
    });
    pingResult = `HTTP ${res.status}`;
    // 200 = accepted, 202 = accepted, key validation pending (first time)
    if (res.status === 200 || res.status === 202) ok(`IndexNow: ${urls.length} URLs submitted (${res.status})`);
    else warn(`IndexNow answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  // report
  const md = [
    `## SEO agent report for ${SITE}`,
    "",
    `**${errors.length} errors · ${warnings.length} warnings** · IndexNow: ${pingResult}`,
    "",
    "| Page | HTTP | Title chars | Description chars | h1 | Words | JSON-LD |",
    "|---|---|---|---|---|---|---|",
    ...report.map((r) => `| ${r.url} | ${r.status} | ${r.title ?? "-"} | ${r.desc ?? "-"} | ${r.h1 ?? "-"} | ${r.words ?? "-"} | ${r.jsonLd ?? "-"} |`),
    "",
    "| Crawler | Home page |",
    "|---|---|",
    ...access.map((a) => `| ${a.name} | ${a.status === 200 ? "✅ 200" : `❌ ${a.status}`} |`),
    "",
    ...(errors.length ? ["### Errors", ...errors.map((e) => `- ${e}`), ""] : []),
    ...(warnings.length ? ["### Warnings", ...warnings.map((w) => `- ${w}`), ""] : []),
  ].join("\n");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");

  console.log(`\n${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error("SEO agent crashed:", e);
  process.exit(1);
});
