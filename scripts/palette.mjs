import { readFileSync } from "fs";

/* Palette contrast guard.
 *
 * Reads the tokens straight out of globals.css and checks each one against
 * the job it actually does. This exists because the pink rebrand nearly
 * shipped with pink-soft, a 2.67:1 decoration colour, being used as a
 * numeral somebody has to read. axe caught that one only because it
 * happened to be on a route the a11y run visits; this catches the token
 * itself, everywhere, before it gets that far.
 *
 * House rule: anything used for TEXT clears 5.5:1 on white, above the WCAG
 * AA minimum of 4.5:1, because the readership is mostly over 55 and often
 * reading on a phone outdoors. */

const css = readFileSync("src/app/globals.css", "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [m[1], m[2]]),
);

const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const WHITE = "#ffffff";
const FOREST = tokens.forest;

/* role: what the token is allowed to be used for, and against what. */
const RULES = [
  // Text and actions on the white ground.
  ["pink", WHITE, 5.5, "links, buttons, body accents"],
  ["pink-deep", WHITE, 5.5, "button hover"],
  ["green", WHITE, 5.5, "eyebrows, headings accents"],
  ["forest", WHITE, 5.5, "dark panel ground / headings"],
  ["spruce", WHITE, 5.5, "service and county accent"],
  ["clay", WHITE, 5.5, "service and county accent"],
  ["ochre", WHITE, 5.5, "service and county accent"],
  ["wine", WHITE, 5.5, "service and county accent"],
  ["ink", WHITE, 5.5, "body copy"],
  ["ink-soft", WHITE, 5.5, "secondary copy"],
  ["ink-faint", WHITE, 4.5, "quiet meta text"],
  // White type sitting on a filled button.
  ["pink", WHITE, 4.5, "white type on the solid button"],
  ["forest", WHITE, 4.5, "white type on the dark panel"],
  // Light type on the dark forest panel.
  ["green-soft", FOREST, 4.5, "type on the forest panel"],
];

/* Decoration only. These are ALLOWED to be low contrast, and the guard
 * exists to state that in one place rather than leaving it to memory. */
const DECORATIVE = ["pink-bright", "pink-soft", "pink-wash", "green-wash",
  "spruce-wash", "clay-wash", "ochre-wash", "wine-wash", "mist", "mist-deep",
  "rule", "page", "forest-2", "gold"];

let fail = 0;
console.log("token          ratio    bar   role");
for (const [name, against, bar, role] of RULES) {
  const hex = tokens[name];
  if (!hex) { console.log(`  MISSING TOKEN --color-${name}`); fail++; continue; }
  const r = ratio(hex, against);
  const ok = r >= bar;
  if (!ok) fail++;
  console.log(`${ok ? "  ok " : "  ** "} ${name.padEnd(11)} ${r.toFixed(2)}:1  ${bar}:1  ${role}`);
}

console.log("\ndecorative (no contrast requirement, must never carry text):");
for (const n of DECORATIVE) {
  if (tokens[n]) console.log(`     ${n.padEnd(12)} ${tokens[n]}  ${ratio(tokens[n], WHITE).toFixed(2)}:1 on white`);
}

console.log(fail === 0
  ? `\nAll ${RULES.length} palette roles clear their contrast bar.`
  : `\n${fail} palette role(s) below the bar.`);
process.exit(fail === 0 ? 0 : 1);
