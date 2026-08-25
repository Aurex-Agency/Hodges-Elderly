import { register } from "node:module";
import { pathToFileURL } from "node:url";

/* Lets scripts import the app's own TypeScript modules.
 *
 * Node strips TS types natively, but its ESM resolver still requires an
 * explicit extension, while the bundler resolves `./site` to `./site.ts`.
 * That mismatch has now bitten twice: once when a value import was added to
 * lib/guides.ts and silently broke the share-card generator, and again with
 * the email templates.
 *
 * Fixing it here rather than in the source, because contorting application
 * code to suit a build script is the wrong way round.
 *
 * Usage:  node --import ./scripts/ts-resolve.mjs scripts/whatever.mjs
 */
register(
  "data:text/javascript," +
    encodeURIComponent(`
      import { existsSync } from "node:fs";
      import { fileURLToPath, pathToFileURL } from "node:url";
      export async function resolve(specifier, context, next) {
        if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier)) {
          const base = new URL(specifier, context.parentURL);
          for (const ext of [".ts", ".tsx", "/index.ts"]) {
            const candidate = new URL(base.href + ext);
            if (existsSync(fileURLToPath(candidate))) {
              return next(candidate.href, context);
            }
          }
        }
        return next(specifier, context);
      }
    `),
  pathToFileURL("./"),
);
