import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Aaliyah Hodges",
  description:
    "Aaliyah Hodges founded Hodges Elderly and Disabled Services after caring for her grandmother through bone cancer, and eight years supporting adults with IDD and mental illness.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Her story"
          title="The work started long before the agency did."
          lede={`${site.founder}, Founder and Administrator.`}
        />

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-32">
          <div className="space-y-7 text-2xl leading-relaxed text-ink-soft">
            <p className="text-[1.7rem] leading-relaxed text-ink">
              Before there was an agency, there was a granddaughter looking after
              her grandmother through bone cancer.
            </p>
            <p>
              {site.firstName} was not trained for it and nobody assigned it to
              her. She did it the way most people in Mississippi come to this
              work. At home, without being asked, because someone she loved needed
              her and she was the one who was there.
            </p>
            <blockquote className="border-l-4 border-plum pl-6 font-display text-[1.7rem] leading-snug text-ink">
              &ldquo;Taking care of my grandmother was an eye-opener. That is
              when I realized caring for people was my passion.&rdquo;
            </blockquote>
            <p>
              She went on to spend eight years supporting adults with
              intellectual and developmental disabilities and with serious
              mental illness. That is difficult, specialized work, and it is
              where she learned that consistency matters more than almost
              anything else. The same familiar face showing up on schedule is
              itself a form of care.
            </p>
            <p>
              She opened Hodges Elderly and Disabled Services to do this work on
              her own terms. The company is built on three things she names
              herself: compassion, dignity, and a genuine passion for serving
              others.
            </p>
          </div>
        </section>

        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-28">
            <h2 className="text-[2.1rem] lg:text-4xl">A second generation</h2>
            <div className="mt-6 space-y-7 text-xl text-ink-soft">
              <p>
                {site.firstName}&rsquo;s mother has run a care home in West
                Point for years. This is the second generation of the same
                family doing the same work, in the same state, for the same
                reasons.
              </p>
              <p>
                Hodges is a separate, independently owned company serving North
                Mississippi. But the standard {site.firstName} was raised with
                is the one she runs by.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-32">
          <h2 className="text-[2.1rem] lg:text-4xl">Why families choose a local agency</h2>
          <div className="mt-6 space-y-7 text-xl text-ink-soft">
            <p>
              There are national franchises operating in this market. They are
              not bad companies, but they are branch offices of something
              headquartered far from here, running the same playbook in hundreds
              of towns.
            </p>
            <p>
              When you call Hodges, you reach {site.firstName}. She knows which
              caregiver is going to your mother&rsquo;s house, because she hired
              them. If something is not working, you are not filing a ticket.
              You are telling the owner.
            </p>
            <p>
              <Link
                href="/services"
                className="font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
              >
                See what we do in the home
              </Link>
            </p>
          </div>
        </section>

        <ClosingCta
          title={`Talk to ${site.firstName} directly.`}
          body="One conversation about what is going on at home. If we are not the right fit, she will tell you that too."
        />
      </main>
      <Footer />
    </>
  );
}
