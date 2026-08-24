import Magnolia from "./Magnolia";

/* Redrawn from the client's supplied JPEG (assets/brand-source/logo-original.jpg).
 *
 * Deliberately kept: the H monogram, the square frame, the magnolia, and
 * her plum-and-green pairing — so she stays recognisable to anyone who has
 * already seen a card or a flyer.
 *
 * Deliberately fixed: the original wordmark reads "DISABLE SERVICES".
 * The correct name is "DISABLED SERVICES". The original was also a 640px
 * raster with no vector source; this is resolution-independent.
 */

/* H monogram, drawn as a path so the mark never depends on a webfont. */
const MONOGRAM =
  "M 34 30 h 10 v 14 h 12 v -14 h 10 v 40 h -10 v -15 h -12 v 15 h -10 z";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true" focusable="false">
        <rect
          x="16"
          y="16"
          width="68"
          height="68"
          fill="none"
          stroke="var(--color-leaf)"
          strokeWidth="2.5"
        />
        <path d={MONOGRAM} fill="var(--color-plum)" />
      </svg>
      {/* Bloom breaking the frame at the top-right, as in the original. */}
      <Magnolia
        className="absolute -right-[16%] -top-[18%] h-[62%] w-[62%]"
        variant="simple"
        withLeaves={false}
      />
    </span>
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
      className={`flex items-center ${stacked ? "flex-col gap-3" : "gap-3"} ${className ?? ""}`}
    >
      <LogoMark className={stacked ? "h-20 w-20" : "h-12 w-12 shrink-0"} />
      <span className={`leading-none ${stacked ? "text-center" : ""}`}>
        <span className="block font-display text-[1.35rem] font-semibold tracking-tight text-plum">
          Hodges
        </span>
        <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-leaf">
          Elderly &amp; Disabled Services
        </span>
      </span>
    </span>
  );
}
