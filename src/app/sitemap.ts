import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { services, site } from "@/lib/site";

/* No lastModified on pages we do not have a real date for.
 *
 * It used to be new Date() on every route, which told crawlers the entire
 * site changed on every deploy, including deploys that only touched a
 * stylesheet. Google's own guidance is that it will ignore lastmod
 * altogether once it decides the values are not trustworthy, which would
 * throw away the accurate dates on the guides along with the invented ones.
 * So the guides carry their real published date and nothing else carries
 * anything. An absent lastmod costs nothing; a wrong one costs the lot. */

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: "", priority: 1 },
    { url: "/services", priority: 0.9 },
    { url: "/service-area", priority: 0.8 },
    { url: "/paying-for-care", priority: 0.8 },
    { url: "/contact", priority: 0.8 },
    { url: "/guides", priority: 0.7 },
    { url: "/about", priority: 0.6 },
    { url: "/answers", priority: 0.6 },
    { url: "/careers", priority: 0.5 },
    ...services.map((s) => ({ url: `/services/${s.slug}`, priority: 0.8 })),
    ...site.towns
      .filter((t) => t.page)
      .map((t) => ({ url: `/in-home-care/${t.slug}`, priority: 0.8 })),
  ].map((p) => ({
    url: `${site.url}${p.url}`,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: new Date(`${g.updated}T12:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...guidePages];
}
