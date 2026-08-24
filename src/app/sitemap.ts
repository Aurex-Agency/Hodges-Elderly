import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/service-area",
    "/paying-for-care",
    "/answers",
    "/careers",
    "/contact",
    ...services.map((s) => `/services/${s.slug}`),
    ...site.towns.filter((t) => t.page).map((t) => `/in-home-care/${t.slug}`),
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
