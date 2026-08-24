/* A Southern magnolia (Magnolia grandiflora) drawn from scratch.
 *
 * This is the project's primary visual asset. The client has no
 * photography, and stock images of strangers would put her on exactly
 * the same footing as the two national franchises she competes with.
 * The magnolia is Mississippi's state flower and already appears in
 * her own logo, so it is both ownable and authentically hers.
 *
 * Petals are one path instance rotated around the centre rather than
 * nine hand-authored shapes — keeps the file small and the whorls even.
 */

/* Broad, cupped tepal. Wide enough that neighbours in a whorl overlap
 * heavily — a magnolia is a dense mass of petals, not a radiating daisy. */
const PETAL =
  "M 0 0 C -44 -16, -54 -60, -36 -92 C -23 -114, 23 -114, 36 -92 C 54 -60, 44 -16, 0 0 Z";

/* Faint crease down the middle of a tepal, for a little relief. */
const CREASE = "M 0 -10 C -6 -42, -5 -74, 0 -96";

/* Magnolia grandiflora leaves are long, leathery and much bigger than
 * the petals — they have to read as foliage, not as green shards. */
const LEAF = "M 0 0 C -34 -52, -36 -128, 0 -178 C 36 -128, 34 -52, 0 0 Z";

/* Loose, slightly irregular whorls. Perfect radial symmetry is the single
 * biggest tell of clip art, so every element carries a little jitter. */
const BACK_WHORL = [4, 61, 122, 178, 241, 299];
const FRONT_WHORL = [32, 119, 208, 295];
const LEAVES = [
  { angle: 18, scale: 1.0 },
  { angle: 74, scale: 0.86 },
  { angle: 152, scale: 0.95 },
  { angle: 216, scale: 0.8 },
  { angle: 286, scale: 0.92 },
];

/* Gradients live in one hidden sprite rendered once per document, so the
 * blossom stays a pure Server Component (no useId, no client JS) and the
 * page never carries duplicate element ids. */
const PETAL_FRONT = "mag-petal-front";
const PETAL_BACK = "mag-petal-back";
const LEAF_FILL = "mag-leaf";
const CONE = "mag-cone";

export function MagnoliaDefs() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Petals stay a warm ivory so the bloom still reads as a flower
            against a white page, with a cool green-grey edge to define it. */}
        <linearGradient id={PETAL_FRONT} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#e9eeea" />
          <stop offset="45%" stopColor="#fbfcfa" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={PETAL_BACK} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#cfdad3" />
          <stop offset="60%" stopColor="#e8efea" />
          <stop offset="100%" stopColor="#f3f7f4" />
        </linearGradient>
        {/* Deep and desaturated on purpose. A brighter green reads as flat
            cut-out foliage and competes with the headline beside it. */}
        <linearGradient id={LEAF_FILL} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0%" stopColor="#0e2a20" />
          <stop offset="70%" stopColor="#1a4234" />
          <stop offset="100%" stopColor="#245442" />
        </linearGradient>
        <radialGradient id={CONE} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#d8c384" />
          <stop offset="65%" stopColor="#c19c46" />
          <stop offset="100%" stopColor="#8f6a24" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Props = {
  className?: string;
  /** Draw the leaf spray behind the bloom. */
  withLeaves?: boolean;
  /** Decorative by default; pass a label to expose it to assistive tech. */
  title?: string;
  /** "simple" drops the creases, stamens and inner whorl. The full bloom
   *  degrades into a starburst below ~40px; the logo mark needs this. */
  variant?: "full" | "simple";
};

export default function Magnolia({
  className,
  withLeaves = true,
  title,
  variant = "full",
}: Props) {
  const simple = variant === "simple";
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g transform="translate(200 200)">
        {withLeaves && !simple &&
          LEAVES.map(({ angle, scale }) => (
            <g key={`leaf-${angle}`} transform={`rotate(${angle}) scale(${scale})`}>
              <path d={LEAF} fill={`url(#${LEAF_FILL})`} />
              <path
                d="M 0 -12 L 0 -164"
                stroke="#0c2019"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
                fill="none"
              />
            </g>
          ))}

        {BACK_WHORL.map((angle) => (
          <g key={`back-${angle}`} transform={`rotate(${angle})`}>
            <path
              d={PETAL}
              /* At logo size a cream bloom on a cream ground has no contrast
                 at all, so the simple variant becomes a green line drawing
                 that ties to the frame instead of a tonal shape. */
              fill={simple ? "#ffffff" : `url(#${PETAL_BACK})`}
              stroke={simple ? "var(--color-green)" : "#c3d0c8"}
              strokeWidth={simple ? 7 : 1.1}
              strokeLinejoin={simple ? "round" : undefined}
            />
          </g>
        ))}

        {!simple &&
          FRONT_WHORL.map((angle) => (
          <g key={`front-${angle}`} transform={`rotate(${angle}) scale(0.66)`}>
            <path
              d={PETAL}
              fill={`url(#${PETAL_FRONT})`}
              stroke="#cddad2"
              strokeWidth="1.4"
            />
            <path d={CREASE} stroke="#dde7e0" strokeWidth="1.6" fill="none" />
          </g>
          ))}

        {/* Gynoecium: a small tight cone, not a sunflower disc. Kept muted so
            it never competes with the headline sitting beside it. */}
        <ellipse
          cx="0"
          cy="-1"
          rx={simple ? 24 : 11}
          ry={simple ? 24 : 14}
          fill={simple ? "var(--color-plum)" : `url(#${CONE})`}
        />
        {!simple &&
          Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2 + 0.3;
          return (
            <line
              key={`stamen-${i}`}
              x1={Math.cos(a) * 10}
              y1={Math.sin(a) * 10 - 1}
              x2={Math.cos(a) * 18}
              y2={Math.sin(a) * 18 - 1}
              stroke="#b39a5e"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            );
          })}
      </g>
    </svg>
  );
}
