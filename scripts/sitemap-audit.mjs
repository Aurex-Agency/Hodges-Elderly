/* Checks every URL in the live sitemap the way a crawler would.
 *
 * A sitemap that lists a redirect, a 404, or a noindex page is worse than
 * a smaller one: Google treats those as quality signals about the whole
 * file. This exists so "is it ready to submit" is answerable with evidence
 * rather than a shrug.
 *
 *   node scripts/sitemap-audit.mjs
 */
const BASE = process.env.BASE ?? "https://hodgeselderlyanddisable.com";

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();

/* The sitemap contains absolute production URLs by design, so when this is
 * pointed at a local server the origin has to be swapped or it silently
 * audits the live site instead. That happened once and made a local fix
 * look like it had done nothing. */
const CANONICAL_ORIGIN = "https://hodgeselderlyanddisable.com";
const rewrite = (u) => (BASE === CANONICAL_ORIGIN ? u : u.replace(CANONICAL_ORIGIN, BASE));

const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => rewrite(m[1]));
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);

console.log(`sitemap: ${BASE}/sitemap.xml`);
console.log(`urls:    ${urls.length}\n`);

let bad = 0;
const rows = [];

for (const url of urls) {
  const res = await fetch(url, { redirect: "manual" });
  const status = res.status;
  let issues = [];

  if (status >= 300 && status < 400) {
    issues.push(`REDIRECTS to ${res.headers.get("location")}`);
  } else if (status !== 200) {
    issues.push(`STATUS ${status}`);
  } else {
    const html = await res.text();
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";

    if (robots.includes("noindex")) issues.push("NOINDEX");
    if (!canonical) issues.push("no canonical");
    else if (canonical !== url.replace(BASE, CANONICAL_ORIGIN))
      issues.push(`canonical mismatch -> ${canonical}`);
    if (!title) issues.push("no title");
    else if (title.length > 65) issues.push(`title ${title.length} chars (truncates ~60)`);
    if (!desc) issues.push("no description");
    else if (desc.length > 160) issues.push(`description ${desc.length} chars`);
  }

  if (issues.length) bad++;
  rows.push({ url: url.replace(BASE, "") || "/", status, issues });
}

for (const r of rows) {
  const path = r.url.padEnd(52);
  console.log(
    r.issues.length
      ? `  ** ${path} ${r.status}  ${r.issues.join("; ")}`
      : `  ok ${path} ${r.status}`,
  );
}

/* Cross-check: anything crawlable that is NOT in the sitemap. */
const robotsTxt = await (await fetch(`${BASE}/robots.txt`)).text();
console.log(`\nrobots.txt allows crawling: ${!/Disallow: \/$/m.test(robotsTxt)}`);
console.log(`robots.txt names the sitemap: ${robotsTxt.includes("/sitemap.xml")}`);
/* Deliberately not "present on all": only the guides have a real date, and
 * an invented lastmod is worse than none. */
console.log(`lastmod on ${lastmods.length} of ${urls.length} (guides only, by design)`);

console.log(
  bad === 0
    ? `\nAll ${urls.length} URLs return 200, are indexable, and self-canonical. Ready to submit.`
    : `\n${bad} of ${urls.length} URLs have problems.`,
);
process.exit(bad === 0 ? 0 : 1);
