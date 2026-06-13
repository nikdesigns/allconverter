/**
 * IndexNow bulk submission script.
 * Submits every URL in the sitemap to IndexNow (Bing, Yandex, etc.).
 * Run: npm run indexnow
 */

import { tools } from "../src/lib/tools-data.js";
import { categories } from "../src/lib/categories.js";
import { allBlogPosts } from "../src/data/blog-posts/index.js";
import { blogCategories } from "../src/data/blog-categories.js";

const SITE_URL = "https://allconverter.tools";
const INDEXNOW_KEY = "17312e26fdd14193a4d15a11856afcb0";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const HOST = "allconverter.tools";

// IndexNow accepts up to 10,000 URLs per request
const BATCH_SIZE = 10_000;

// ── Build full URL list ────────────────────────────────────────────────────

const staticUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/tools/`,
  `${SITE_URL}/blog/`,
  `${SITE_URL}/about/`,
  `${SITE_URL}/changelog/`,
  `${SITE_URL}/contact/`,
  `${SITE_URL}/sitemap/`,
  `${SITE_URL}/support/`,
  `${SITE_URL}/privacy/`,
  `${SITE_URL}/terms/`,
  `${SITE_URL}/cookies/`,
  `${SITE_URL}/security/`,
  `${SITE_URL}/disclaimer/`,
];

const categoryUrls = categories.map((c) => `${SITE_URL}/${c.slug}/`);

// Deduplicate tool slugs before building URLs
const uniqueToolSlugs = [...new Set(tools.map((t) => t.slug))];
const toolUrls = uniqueToolSlugs.map((slug) => `${SITE_URL}/tools/${slug}/`);

const blogCategoryUrls = blogCategories.map(
  (c) => `${SITE_URL}/blog/${c.slug}/`
);

const blogPostUrls = allBlogPosts.map(
  (p) => `${SITE_URL}/blog/${p.category}/${p.slug}/`
);

const allUrls = [
  ...staticUrls,
  ...categoryUrls,
  ...toolUrls,
  ...blogCategoryUrls,
  ...blogPostUrls,
];

// ── Submission ─────────────────────────────────────────────────────────────

async function submitBatch(urlList: string[], batchNum: number): Promise<void> {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  console.log(`\nBatch ${batchNum}: submitting ${urlList.length} URLs…`);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const status = res.status;

  if (status === 200 || status === 202) {
    console.log(`  ✓ Accepted (HTTP ${status})`);
  } else if (status === 422) {
    console.error(`  ✗ Unprocessable (HTTP 422) — check URL format`);
  } else if (status === 429) {
    console.error(`  ✗ Rate limited (HTTP 429) — try again later`);
  } else {
    const text = await res.text().catch(() => "");
    console.error(`  ✗ Unexpected HTTP ${status}: ${text}`);
  }
}

async function main() {
  console.log(`IndexNow bulk submission`);
  console.log(`Host:       ${HOST}`);
  console.log(`Key:        ${INDEXNOW_KEY}`);
  console.log(`Total URLs: ${allUrls.length}`);

  // Split into batches
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    await submitBatch(batch, Math.floor(i / BATCH_SIZE) + 1);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
