import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import BloomingMagnolia from "./motion/BloomingMagnolia";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { guides } from "@/lib/guides";
import { site, services, NAV } from "@/lib/site";

export function CallButton({
  variant = "solid",
  className = "",
  numberClassName = "",
}: {
  variant?: "solid" | "outline" | "onDark";
  className?: string;
  /** Lets a cramped header hide the number and keep just "Call". */
  numberClassName?: string;
}) {
  /* The hover state used to lift the button 2px. That is a real bug, not a
   * taste question: the element moves out from under the cursor, fires
   * mouseleave, drops back, fires mouseenter, and oscillates. Measured at
   * the bottom edge it produced 56 enter/leave events in 900ms, which is
   * the flicker you can feel on every call button on the site.
   *
   * Hover now deepens the colour and raises a soft shadow, neither of which
   * moves the hit box. The press-down moved to :active, where it cannot
   * oscillate because it is driven by mousedown rather than by hit testing. */
  const base =
    "inline-flex min-h-[3.5rem] items-center gap-3 whitespace-nowrap rounded-control px-8 text-xl font-semibold shadow-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 hover:shadow-lift active:translate-y-px";
  const styles = {
    solid: "bg-pink text-white hover:bg-pink-deep",
    outline: "border-2 border-pink text-pink hover:bg-pink hover:text-white",
    onDark: "bg-white text-forest hover:bg-green-wash",
  } as const;

  return (
    <a href={site.phoneHref} className={`${base} ${styles[variant]} ${className}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M6.6 2.5 9 3.1l1.2 3.6-1.9 1.6a12.4 12.4 0 0 0 5.4 5.4l1.6-1.9 3.6 1.2.6 2.4a2 2 0 0 1-2 2.5A16.5 16.5 0 0 1 4.1 4.5a2 2 0 0 1 2.5-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      Call<span className={numberClassName}>&nbsp;{site.phone}</span>
    </a>
  );
}

export function Header() {
  return (
    <header className="relative z-30 border-b border-rule">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" aria-label={`${site.shortName} home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-base font-semibold text-ink-soft transition-colors duration-200 hover:text-pink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <CallButton
              variant="outline"
              className="min-h-[3.25rem] whitespace-nowrap px-5 text-base lg:px-6"
              numberClassName="hidden lg:inline"
            />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

/* Standard page opener for everything except the homepage. */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-rule bg-mist/65">
      <div className="pointer-events-none absolute -right-28 -top-24 hidden h-[30rem] w-[30rem] opacity-70 lg:block">
        <BloomingMagnolia className="h-full w-full -rotate-[14deg]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
        <RevealGroup stagger={0.09}>
          <RevealItem>
            <p className="flex items-center gap-3 text-base font-bold uppercase tracking-[0.18em] text-green">
              <span className="h-px w-10 bg-green-soft" aria-hidden="true" />
              {eyebrow}
            </p>
          </RevealItem>
          <RevealItem>
            <h1 className="mt-6 max-w-3xl text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              {title}
            </h1>
          </RevealItem>
          {lede && (
            <RevealItem>
              <p className="mt-6 max-w-2xl text-2xl text-ink-soft">{lede}</p>
            </RevealItem>
          )}
        </RevealGroup>
      </div>
    </section>
  );
}

/* Closing conversion block, repeated at the foot of every page. */
export function ClosingCta({
  title = "Tell us what they need. We will tell you straight.",
  body = "No pressure and no sales script, just a conversation about what is going on and whether we are the right fit.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[32rem] w-[32rem] opacity-[0.08]">
        <BloomingMagnolia className="h-full w-full rotate-[18deg]" withLeaves={false} />
      </div>
      <Reveal className="relative mx-auto max-w-3xl px-6 py-28 text-center lg:py-40">
        <h2 className="text-4xl lg:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-2xl text-white/80">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <CallButton variant="onDark" />
          <Link
            href="/contact"
            className="inline-flex min-h-[3.5rem] items-center rounded-control border-2 border-white/40 px-8 text-xl font-semibold text-white transition-[color,background-color,border-color] duration-200 hover:border-white hover:bg-white/10 active:translate-y-px"
          >
            Send a message
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const townPages = site.towns.filter((t) => t.page);

  return (
    <footer className="border-t border-rule bg-mist/65">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="border-b border-rule pb-10">
          <Logo />
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Locally founded in-home care for elderly and disabled adults across
            North Mississippi.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-lg text-ink-soft transition-colors duration-200 hover:text-pink"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Where we go</h2>
          <ul className="mt-4 space-y-2.5">
            {townPages.map((t) => (
              <li key={t.name}>
                <Link
                  href={`/in-home-care/${t.slug}`}
                  className="text-lg text-ink-soft transition-colors duration-200 hover:text-pink"
                >
                  In-home care in {t.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/service-area"
                className="text-lg text-ink-soft transition-colors duration-200 hover:text-pink"
              >
                All seven counties
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Guides</h2>
          <ul className="mt-4 space-y-2.5">
            {guides.slice(0, 4).map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="text-lg text-ink-soft transition-colors duration-200 hover:text-pink"
                >
                  {g.metaTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/guides"
                className="text-lg text-ink-soft transition-colors duration-200 hover:text-pink"
              >
                All guides
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-lg text-ink-soft">
            <li>
              <a
                href={site.phoneHref}
                className="text-xl font-semibold text-pink transition-colors duration-200 hover:text-pink-deep"
              >
                {site.phone}
              </a>
            </li>
            <li>
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </li>
            <li className="pt-2">
              <Link
                href="/careers"
                className="font-semibold text-ink transition-colors duration-200 hover:text-pink"
              >
                Work with us
              </Link>
            </li>
          </ul>
        </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <p className="text-base text-ink-faint">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-base text-ink-faint">
            Non-medical in-home care. Not a home health or hospice provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
