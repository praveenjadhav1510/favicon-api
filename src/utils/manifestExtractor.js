import axios from "../config/axios.js";
import * as cheerio from "cheerio";
import scoreIcon from "./iconScorer.js";
import validateIcon from "./iconValidator.js";

/**
 * Extract icons from a PWA web app manifest (site.webmanifest / manifest.json).
 * Many modern sites define their highest-quality icons only in the manifest,
 * which the raw HTML <link> scan misses.
 */
export async function extractIconsFromManifest(targetUrl) {
  const { data: html } = await axios.get(targetUrl);
  const $ = cheerio.load(html);

  let manifestHref = null;

  $("link").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    const href = $(el).attr("href");
    if (rel.includes("manifest") && href) {
      manifestHref = new URL(href, targetUrl).href;
    }
  });

  if (!manifestHref && /\.json$/i.test(targetUrl)) {
    manifestHref = targetUrl;
  }

  if (!manifestHref) {
    return [];
  }

  let manifest;
  try {
    const res = await axios.get(manifestHref);
    manifest = res.data;
  } catch (err) {
    console.warn("Manifest fetch failed:", err.message);
    return [];
  }

  const icons = [];
  const list = Array.isArray(manifest.icons) ? manifest.icons : [];

  for (const icon of list) {
    if (!icon.src) continue;
    const href = new URL(icon.src, manifestHref.startsWith("http") ? manifestHref : targetUrl).href;
    const sizes = icon.sizes || "";
    icons.push({
      rel: "manifest",
      href,
      sizes,
      score: scoreIcon({ rel: "icon", href, sizes }) + 10,
    });
  }

  return icons.sort((a, b) => b.score - a.score);
}

/**
 * Attempts to validate the highest-scoring manifest icon. Returns the
 * winning icon object or null. Cache is handled by the caller.
 */
export async function pickManifestIcon(targetUrl) {
  const icons = await extractIconsFromManifest(targetUrl);
  for (const icon of icons) {
    if (await validateIcon(icon.href)) {
      return icon;
    }
  }
  return null;
}
