import { BACK_WHORL, PETAL } from "./Magnolia";

/* Redrawn from the client's supplied JPEG (assets/brand-source/logo-original.jpg).
 *
 * Deliberately kept: the H monogram, the square frame, the magnolia, and
 * her plum-and-green pairing, so she stays recognisable to anyone who has
 * already seen a card or a flyer.
 *
 * Deliberately fixed: the original wordmark reads "DISABLE SERVICES".
 * The correct name is "DISABLED SERVICES". The original was also a 640px
 * raster with no vector source; this is resolution-independent.
 */

/* H monogram, drawn as a path so the mark never depends on a webfont.
 * Centred on 50,50 to match the frame. */
const MONOGRAM =
  "M 34 32 h 10 v 13 h 12 v -13 h 10 v 36 h -10 v -14 h -12 v 14 h -10 z";

/* The bloom is drawn inside the viewBox rather than absolutely positioned
 * over it. Previously it hung outside the mark's box, so the mark's layout
 * width lied about its visual width and everything beside it sat wrong. */
const BLOOM_AT = { x: 78, y: 22, d: 46 };

export function LogoMark({ className }: { className?: string }) {
  const scale = BLOOM_AT.d / 228;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="13"
        y="13"
        width="66"
        height="66"
        fill="none"
        stroke="var(--color-green)"
        strokeWidth="3"
      />
      <path d={MONOGRAM} fill="var(--color-plum)" />

      {/* Breaking the frame at the top right, as in the original. */}
      <g transform={`translate(${BLOOM_AT.x} ${BLOOM_AT.y}) scale(${scale})`}>
        {BACK_WHORL.map((angle) => (
          <path
            key={angle}
            d={PETAL}
            transform={`rotate(${angle})`}
            fill="#ffffff"
            stroke="var(--color-green)"
            strokeWidth={9 / scale / 3}
            strokeLinejoin="round"
          />
        ))}
        <circle r={26} fill="var(--color-plum)" />
      </g>
    </svg>
  );
}

export default function Logo({
  className,
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span
      className={`flex ${stacked ? "flex-col items-center gap-4" : "items-center gap-4"} ${className ?? ""}`}
    >
      <LogoMark
        className={stacked ? "h-24 w-24" : "h-12 w-12 shrink-0 sm:h-14 sm:w-14"}
      />
      <span className={stacked ? "text-center" : ""}>
        <span className="block font-display text-[1.4rem] font-semibold leading-none tracking-tight text-plum sm:text-[1.6rem]">
          Hodges
        </span>
        <span className="mt-1.5 block text-[0.68rem] font-bold uppercase leading-tight tracking-[0.1em] text-green sm:whitespace-nowrap sm:text-[0.78rem] sm:tracking-[0.14em]">
          Elderly &amp; Disabled Services
        </span>
      </span>
    </span>
  );
}
