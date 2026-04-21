import axios from "../config/axios.js";
import * as cheerio from "cheerio";
import cache from "../cache/cache.js";
import normalizeUrl from "../utils/normalizeUrl.js";
import scoreIcon from "../utils/iconScorer.js";
import validateIcon from "../utils/iconValidator.js";
import reduceDomain from "../utils/domainReducer.js";

/**
 * Extract favicon candidates from a given URL
 */
async function extractIcons(targetUrl) {
  const { data: html } = await axios.get(targetUrl);
  const $ = cheerio.load(html);

  const icons = [];

  $("link").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    const href = $(el).attr("href");
    const sizes = $(el).attr("sizes");

    if (rel.includes("icon") && href) {
      icons.push({
        rel,
        href: new URL(href, targetUrl).href,
        sizes,
        score: scoreIcon({ rel, href, sizes }),
      });
    }
  });

  // Standard favicon.ico fallback
  icons.push({
    rel: "fallback",
    href: new URL("/favicon.ico", targetUrl).href,
    score: 10,
  });

  return icons;
}

export async function getFavicon(req, res) {
  try {
    // ✅ Safe input handling
    let url = req.body?.url || req.query?.url;
    console.log("Incoming URL:", url);

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    url = normalizeUrl(url);

    // ✅ Cache check (original URL)
    if (cache.has(url)) {
      return res.json({
        success: true,
        favicon: cache.get(url),
        cached: true,
      });
    }

    /* =====================================================
       STEP 1: TRY ORIGINAL URL
    ===================================================== */
    try {
      let icons = await extractIcons(url);
      icons.sort((a, b) => b.score - a.score);

      for (const icon of icons) {
        if (await validateIcon(icon.href)) {
          cache.set(url, icon);
          return res.json({
            success: true,
            favicon: icon,
            source: "original-url",
          });
        }
      }
    } catch (err) {
      console.warn("Original URL failed:", err.message);
    }

    /* =====================================================
       STEP 2: TRY BASE DOMAIN (ONLY IF STEP 1 FAILED)
       console.firebase.google.com → firebase.google.com
    ===================================================== */
    const baseDomain = reduceDomain(url);
    const baseUrl = `https://${baseDomain}`;

    try {
      let icons = await extractIcons(baseUrl);
      icons.sort((a, b) => b.score - a.score);

      for (const icon of icons) {
        if (await validateIcon(icon.href)) {
          cache.set(url, icon); // cache against original request
          return res.json({
            success: true,
            favicon: icon,
            derivedFrom: baseDomain,
            source: "base-domain",
          });
        }
      }
    } catch (err) {
      console.warn("Base domain failed:", err.message);
    }

    /* =====================================================
       STEP 3: GOOGLE FAVICON FALLBACK (GUARANTEED)
    ===================================================== */
    const fallbackUrl = `https://www.google.com/s2/favicons?sz=256&domain=${baseDomain}`;

    return res.json({
      success: true,
      favicon: {
        rel: "google-fallback",
        href: fallbackUrl,
        score: 1,
      },
      fallback: true,
      source: "google",
    });
  } catch (err) {
    console.error("Favicon Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
