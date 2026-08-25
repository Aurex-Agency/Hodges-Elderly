import { PETAL } from "./Magnolia";

/* Redrawn from the client's supplied JPEG (assets/brand-source/logo-original.jpg).
 *
 * Deliberately kept: the H monogram, the square frame, the magnolia, and
 * her plum-and-green pairing, so she stays recognizable to anyone who has
 * already seen a card or a flyer.
 *
 * Deliberately fixed: the original wordmark reads "DISABLE SERVICES".
 * The correct name is "DISABLED SERVICES". The original was also a 640px
 * raster with no vector source; this is resolution-independent.
 *
 * Every coordinate below is derived from the frame rather than typed in.
 * A hand-placed version had the frame centred on (46,46) and the monogram
 * on (50,50): four units apart in a hundred-unit mark, small enough to
 * look like a mistake rather than a decision, and it was one. With the
 * path computed from the frame's centre the two cannot drift apart again.
 */

/* The frame sits low and left so the bloom can break its top-right corner
 * and still fit inside the viewBox. Placed so the combined artwork lands
 * centred: it spans x 14 to 87 and y 13 to 86 in a 100 square. */
const FRAME = { x: 14, y: 28, size: 58, stroke: 3 };

const CX = FRAME.x + FRAME.size / 2;
const CY = FRAME.y + FRAME.size / 2;

/* Monogram proportions, in viewBox units. */
const H_W = 32;
const H_H = 36;
const STEM = 10;
const CROSSBAR = 9;
/* Crossbars sit fractionally above true centre or they read as low. */
const CROSS_LIFT = 1;

const L = CX - H_W / 2;
const R = CX + H_W / 2;
const T = CY - H_H / 2;
const B = CY + H_H / 2;
const L2 = L + STEM;
const R2 = R - STEM;
const CT = CY - CROSSBAR / 2 - CROSS_LIFT;
const CB = CY + CROSSBAR / 2 - CROSS_LIFT;

const MONOGRAM = [
  `M ${L} ${T}`,
  `L ${L2} ${T}`,
  `L ${L2} ${CT}`,
  `L ${R2} ${CT}`,
  `L ${R2} ${T}`,
  `L ${R} ${T}`,
  `L ${R} ${B}`,
  `L ${R2} ${B}`,
  `L ${R2} ${CB}`,
  `L ${L2} ${CB}`,
  `L ${L2} ${B}`,
  `L ${L} ${B}`,
  "Z",
].join(" ");

/* Centred on the frame's top-right corner, so it breaks the corner the way
 * the original artwork does. */
/* Small enough to perch on the corner. At 44 it was three quarters the
 * width of the frame, which read as a pinwheel sitting on top of the mark
 * rather than a flower breaking its corner. */
const BLOOM = { x: FRAME.x + FRAME.size, y: FRAME.y, d: 30 };
const BLOOM_SCALE = BLOOM.d / 228;

/* Five tepals, evenly spaced. The full bloom's whorl angles are
 * deliberately irregular, which reads as natural at illustration size and
 * as a spinning pinwheel at logo size: the overlaps shingle in one
 * direction. Even spacing reads as a flower. */
const LOGO_PETALS = [0, 72, 144, 216, 288];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.size}
        height={FRAME.size}
        fill="none"
        stroke="var(--color-green)"
        strokeWidth={FRAME.stroke}
      />
      <path d={MONOGRAM} fill="var(--color-plum)" />

      <g transform={`translate(${BLOOM.x} ${BLOOM.y}) scale(${BLOOM_SCALE})`}>
        {LOGO_PETALS.map((angle) => (
          <path
            key={angle}
            d={PETAL}
            transform={`rotate(${angle})`}
            fill="#ffffff"
            stroke="var(--color-green)"
            strokeWidth={(FRAME.stroke * 0.8) / BLOOM_SCALE}
            strokeLinejoin="round"
          />
        ))}
        <circle r={16} fill="var(--color-plum)" />
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
      className={`flex ${stacked ? "flex-col items-center gap-4" : "items-center gap-3.5"} ${className ?? ""}`}
    >
      <LogoMark
        className={
          stacked ? "h-24 w-24" : "h-14 w-14 shrink-0 sm:h-16 sm:w-16"
        }
      />
      <span className={stacked ? "text-center" : ""}>
        <span className="block font-display text-[1.45rem] font-bold leading-none tracking-tight text-plum sm:text-[1.6rem]">
          Hodges
        </span>
        {/* Tracking pulled in from 0.14em. The descriptor was running to
            more than twice the width of the name, which pulled the whole
            lockup out of shape. */}
        <span className="mt-1.5 block text-[0.66rem] font-bold uppercase leading-tight tracking-[0.08em] text-green sm:whitespace-nowrap sm:text-[0.72rem] sm:tracking-[0.09em]">
          Elderly &amp; Disabled Services
        </span>
      </span>
    </span>
  );
}
