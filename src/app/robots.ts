import type { MetadataRoute } from "next";
import { LAUNCH_READY, site } from "@/lib/site";

/* Without this file the site serves a 404 at /robots.txt. That is not
 * fatal, but a crawler asking a question and getting an error is a worse
 * first impression than a crawler getting a clear answer.
 *
 * Pre-launch the answer is "nothing", which matches the noindex in the
 * root metadata. Both are driven by LAUNCH_READY so they cannot disagree. */
export default function robots(): MetadataRoute.Robots {
  if (!LAUNCH_READY) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
