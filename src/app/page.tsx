import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";
import { ArticleCard } from "@/components/ArticleCard";
import { EditorialCover } from "@/components/EditorialCover";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  articles,
  featured as staticFeatured,
  latest as staticLatest,
  topics,
  timeline,
  institutions,
} from "@/lib/content";
import { getPosts } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commander Foluso Ajibulu (Rtd.) — Historian & Commentator",
  description:
    "Informed perspectives on Nigerian history, governance, leadership, international relations and national security from Commander Foluso Ajibulu (Rtd.).",
  openGraph: {
    title: "Commander Foluso Ajibulu (Rtd.) — Historian & Commentator",
    description:
      "History informs the present. Ideas shape the future. Writing and commentary on Nigeria, governance and international affairs.",
  },
};

export default async function Home() {
  const wpPosts = await getPosts();
  const featured = wpPosts.length > 0 ? wpPosts[0] : staticFeatured;
  const latest =
    wpPosts.length > 0
      ? wpPosts.slice(0, 3)
      : staticLatest;

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-24">
        <div>
          <p className="eyebrow">Commander Foluso Ajibulu (Rtd.)</p>
          <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-navy sm:text-6xl">
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
            <Link href="/commentary" className="btn-solid">
              Read his writings
            </Link>
            <a href="#from-the-desk" className="btn-ghost">
              About Commander Ajibulu
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-3 -top-3 hidden h-full w-full border border-gold/40 md:block" />
          <Image
            src="/ajibulu.png"
            alt="Commander Foluso Ajibulu (Rtd.) in his study"
            width={1200}
            height={1504}
            priority
            className="relative aspect-[4/5] max-h-[70vh] w-full object-cover object-top md:max-h-none"
          />
        </div>
      </section>

      <section className="rule-top bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="eyebrow">Featured Commentary</p>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr]">
            <Link
              href={`/commentary/${featured.slug}`}
              className="group block overflow-hidden"
            >
              {featured.image ? (
                <img
                  src={featured.image}
                  alt=""
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.03]">
                  <EditorialCover
                    category={featured.topic}
                    title={featured.title}
                    variant="featured"
                    editorialNumber="01"
                  />
                </div>
              )}
            </Link>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-gold">{featured.topic}</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-navy transition-colors hover:text-gold sm:text-[2.5rem]">
                <Link href={`/commentary/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
                {featured.standfirst}
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {featured.date} · {featured.readTime}
              </p>
              <Link
                href={`/commentary/${featured.slug}`}
                className="link-arrow mt-8 self-start"
              >
                Read article →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="areas-of-thought" className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">Areas of Thought</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-navy">
                The subjects he returns to
              </h2>
            </div>
            <div>
              {topics.map((topic) => (
                <Link
                  key={topic.number}
                  href={`/commentary?topic=${topic.slug}`}
                  className="group grid grid-cols-[auto_1fr] gap-6 border-b border-border py-7 first:border-t"
                >
                  <span className="font-serif text-sm text-gold">{topic.number}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-navy transition-colors group-hover:text-gold">
                      {topic.name}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="from-the-desk" className="rule-top bg-cream">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <Image
            src="/ajibulu.png"
            alt="Commander Foluso Ajibulu (Rtd.)"
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
            <Link href="/commentary" className="link-arrow mt-8">
              Read his latest reflections →
            </Link>
          </div>
        </div>
      </section>

      <section className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Latest Commentary</p>
              <h2 className="mt-4 font-serif text-3xl text-navy">
                Recent writing and reflection
              </h2>
            </div>
            <Link href="/commentary" className="link-arrow">
              Explore the archive →
            </Link>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {latest.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index + 2} />
            ))}
          </div>
        </div>
      </section>

      <section id="career" className="rule-top bg-navy">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="eyebrow text-gold">A Career in Service</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-primary-foreground sm:text-[2.5rem]">
            Three decades of naval service, strategy and public affairs
          </h2>

          <ol className="mt-14">
            {timeline.map((entry) => (
              <li
                key={entry.years}
                className="grid gap-2 border-t border-primary-foreground/15 py-8 md:grid-cols-[11rem_1fr] md:gap-10"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gold md:pt-1.5">
                  {entry.years}
                </p>
                <div>
                  <h3 className="font-serif text-2xl text-primary-foreground">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
                    {entry.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t border-primary-foreground/15 pt-8">
            <p className="eyebrow text-primary-foreground/50">Institutions & Commands</p>
            <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-sm text-primary-foreground/70">
              {institutions.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="engage" className="rule-top">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1fr_1fr] md:py-20">
          <div>
            <p className="eyebrow">Engage Commander Ajibulu</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-[2.5rem]">
              Lectures, interviews and public discussion
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              To invite Commander Ajibulu for a speaking engagement, interview or public
              discussion, please send an enquiry with the date, audience and subject.
            </p>
            <a href="mailto:folusoajibulu8@gmail.com,folusoajibulu9@gmail.com" className="btn-solid mt-8">
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

      <section className="rule-top bg-cream">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 px-6 py-14 md:flex-row md:items-end md:py-16">
          <div className="max-w-md">
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-4 font-serif text-[1.75rem] leading-snug text-navy">
              New essays, delivered occasionally
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">No noise. Only the writing.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

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
    </SiteShell>
  );
}
