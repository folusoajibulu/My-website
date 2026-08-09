import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles, featured, latest, topics, timeline, institutions } from "@/lib/content";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Commander Foluso Ajibulu (Rtd.) — Historian & Commentator" },
      {
        name: "description",
        content:
          "Informed perspectives on Nigerian history, governance, leadership, international relations and national security from Commander Foluso Ajibulu (Rtd.).",
      },
      {
        property: "og:title",
        content: "Commander Foluso Ajibulu (Rtd.) — Historian & Commentator",
      },
      {
        property: "og:description",
        content:
          "History informs the present. Ideas shape the future. Writing and commentary on Nigeria, governance and international affairs.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
        <div>
          <p className="eyebrow">Commander Foluso Ajibulu (Rtd.)</p>
          <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.08] text-navy sm:text-6xl">
            History informs
            <br />
            the present.
            <br />
            <span className="text-gold">Ideas shape the future.</span>
          </h1>
          <p className="mt-8 max-w-lg text-[1.0625rem] leading-relaxed text-muted-foreground">
            Historian, writer and public affairs commentator offering informed
            perspectives on Nigeria, governance, leadership, international relations and
            contemporary affairs.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/commentary" className="btn-solid">
              Read his writings
            </Link>
            <a href="#from-the-desk" className="btn-ghost">
              About Commander Ajibulu
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-3 -top-3 hidden h-full w-full border border-gold/40 md:block" />
          <img
            src={portrait}
            alt="Commander Foluso Ajibulu (Rtd.) in his study"
            width={1200}
            height={1504}
            className="relative aspect-[4/5] w-full object-cover object-top"
          />
        </div>
      </section>

      {/* FEATURED COMMENTARY */}
      <section className="rule-top bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <p className="eyebrow">Featured Commentary</p>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr]">
            <Link
              to="/commentary/$slug"
              params={{ slug: featured.slug }}
              className="group block overflow-hidden"
            >
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-gold">{featured.topic}</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-[2.5rem]">
                <Link to="/commentary/$slug" params={{ slug: featured.slug }}>
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
                {featured.standfirst}
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {featured.date} · {featured.readTime}
              </p>
              <Link
                to="/commentary/$slug"
                params={{ slug: featured.slug }}
                className="link-arrow mt-8 self-start"
              >
                Read article →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AREAS OF THOUGHT */}
      <section id="areas-of-thought" className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">Areas of Thought</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-navy">
                The subjects he returns to
              </h2>
            </div>
            <div>
              {topics.map((topic) => (
                <div
                  key={topic.number}
                  className="grid grid-cols-[auto_1fr] gap-6 border-b border-border py-7 first:border-t"
                >
                  <span className="font-serif text-sm text-gold">{topic.number}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-navy">{topic.name}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FROM THE DESK */}
      <section id="from-the-desk" className="rule-top bg-cream">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <img
            src={portrait}
            alt="Commander Foluso Ajibulu (Rtd.)"
            loading="lazy"
            width={1200}
            height={1504}
            className="aspect-[3/4] w-full max-w-sm object-cover object-top grayscale"
          />
          <div>
            <p className="eyebrow">From the Desk</p>
            <blockquote className="mt-6 font-serif text-[1.75rem] leading-snug text-navy sm:text-[2.125rem]">
              “History is not merely a record of what happened. It is a lens through which
              we understand what is happening.”
            </blockquote>
            <p className="mt-7 max-w-xl leading-relaxed text-muted-foreground">
              Commander Ajibulu spent three decades in the Nigerian Navy, in sea commands,
              strategic policy and public affairs, before turning fully to writing. He
              reads the present through the archive, and writes for readers who prefer
              argument to assertion.
            </p>
            <Link to="/commentary" className="link-arrow mt-8">
              Read his latest reflections →
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST COMMENTARY */}
      <section className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Latest Commentary</p>
              <h2 className="mt-4 font-serif text-3xl text-navy">
                Recent writing and reflection
              </h2>
            </div>
            <Link to="/commentary" className="link-arrow">
              Explore the archive →
            </Link>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {latest.map((article) => (
              <article key={article.slug}>
                <Link
                  to="/commentary/$slug"
                  params={{ slug: article.slug }}
                  className="group block"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                  />
                  <p className="eyebrow mt-5 text-gold">{article.topic}</p>
                  <h3 className="mt-3 font-serif text-[1.5rem] leading-snug text-navy">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {article.standfirst}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {article.date} · {article.readTime}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER */}
      <section id="career" className="rule-top bg-navy">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <p className="eyebrow text-gold">A Career in Service</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-primary-foreground sm:text-[2.5rem]">
            Three decades of naval service, strategy and public affairs
          </h2>

          <div className="mt-14 grid gap-0 md:grid-cols-2">
            {timeline.map((entry) => (
              <div
                key={entry.years}
                className="border-t border-primary-foreground/15 py-8 pr-8"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  {entry.years}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-primary-foreground">
                  {entry.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-primary-foreground/15 pt-8">
            <p className="eyebrow text-primary-foreground/50">Institutions & Commands</p>
            <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-sm text-primary-foreground/70">
              {institutions.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ENGAGE */}
      <section id="engage" className="rule-top">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Engage Commander Ajibulu</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-[2.5rem]">
              Lectures, interviews and public discussion
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              To invite Commander Ajibulu for a speaking engagement, interview or public
              discussion, please send an enquiry with the date, audience and subject.
            </p>
            <a href="mailto:info@folusoajibulu.com" className="btn-solid mt-8">
              Send an enquiry
            </a>
          </div>
          <div>
            <p className="eyebrow">Available for</p>
            <ul className="mt-5">
              {[
                "Public Lectures",
                "Universities & Academic Institutions",
                "Conferences & Seminars",
                "Media Interviews",
                "Policy Discussions",
              ].map((item) => (
                <li
                  key={item}
                  className="border-b border-border py-4 font-serif text-xl text-navy first:border-t"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="rule-top bg-cream">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-8 px-6 py-16">
          <div className="max-w-md">
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-4 font-serif text-[1.75rem] leading-snug text-navy">
              New essays, delivered occasionally
            </h2>
          </div>
          <form
            className="flex w-full max-w-md gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <button type="submit" className="btn-solid shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Foluso Ajibulu",
            honorificPrefix: "Commander",
            honorificSuffix: "Rtd.",
            jobTitle: "Historian and Public Affairs Commentator",
            nationality: "Nigerian",
            knowsAbout: topics.map((t) => t.name),
            worksFor: { "@type": "Organization", name: "Independent" },
            sameAs: [],
            description: `Author of ${articles.length} published commentaries on Nigerian history, governance and security.`,
          }),
        }}
      />
    </div>
  );
}
