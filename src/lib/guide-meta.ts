import type { Metadata } from "next";
import { site } from "./site";
import type { Guide } from "./guides";

/* One place that builds a guide's page metadata.
 *
 * The five guides each hand-wrote this block, and each of them declared an
 * openGraph object. Declaring openGraph REPLACES the inherited one rather
 * than merging into it, so all five silently lost og:url, og:site_name and
 * og:locale from the root layout. They also had no og:image until a card
 * was added per segment. The pages built to be shared were the only ones
 * sharing badly.
 *
 * The image itself still comes from the opengraph-image.jpg sitting in each
 * guide's own folder, which Next picks up per route segment. */
export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `${site.url}/guides/${guide.slug}`,
      siteName: site.shortName,
      locale: "en_US",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [site.founder],
    },
  };
}
