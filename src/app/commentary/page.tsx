import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { EditorialCover } from "@/components/EditorialCover";
import {
  articles as staticArticles,
  articlesForTopic,
  topicBySlug,
  topicForArticle,
  topics,
} from "@/lib/content";
import { getPosts } from "@/lib/wordpress";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Commentary — Foluso Ajibulu",
  description:
    "Essays and commentary on Nigerian history, governance, national security and international relations by Commander Foluso Ajibulu (Rtd.).",
  openGraph: {
    title: "Commentary — Foluso Ajibulu",
    description:
      "An archive of essays on history, governance, security and international affairs.",
  },
};

export default async function CommentaryIndex({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic: topicSlug } = await searchParams;
  const wpPosts = await getPosts();
  const allArticles = wpPosts.length > 0 ? wpPosts : staticArticles;
  const activeTopic = topicSlug ? topicBySlug(topicSlug) : undefined;
  const articles = articlesForTopic(allArticles, topicSlug);

  return (
    <SiteShell>
      <header className="mx-auto max-w-[1200px] px-6 pb-10 pt-12 md:pb-12 md:pt-16">
        <p className="eyebrow">From the Desk of Commander Ajibulu</p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-navy sm:text-5xl">
          {activeTopic
            ? activeTopic.name
            : "Reflections on history, politics, leadership and the issues shaping Nigeria and the world"}
        </h1>
        {activeTopic ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {activeTopic.description}
          </p>
        ) : null}
      </header>

      <nav
        className="mx-auto flex max-w-[1200px] flex-wrap gap-x-7 gap-y-3 px-6 pb-10"
        aria-label="Filter by topic"
      >
        <Link
          href="/commentary"
          className={`text-xs uppercase tracking-[0.16em] transition-colors ${
            !topicSlug ? "text-navy" : "text-muted-foreground hover:text-gold"
          }`}
          aria-current={!topicSlug ? "page" : undefined}
        >
          All
        </Link>
        {topics.map((topic) => {
          const active = topic.slug === topicSlug;
          return (
            <Link
              key={topic.slug}
              href={`/commentary?topic=${topic.slug}`}
              className={`text-xs uppercase tracking-[0.16em] transition-colors ${
                active ? "text-navy" : "text-muted-foreground hover:text-gold"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {topic.name}
            </Link>
          );
        })}
      </nav>

      <section className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-10 md:py-14">
          {articles.length === 0 ? (
            <p className="py-16 font-serif text-2xl text-navy">
              No essays in this area yet.
            </p>
          ) : (
            articles.map((article, index) => {
              const topic = topicForArticle(article.topic);
              return (
                <article
                  key={article.slug}
                  className="grid gap-8 border-b border-border py-10 first:pt-0 md:grid-cols-[0.9fr_1.4fr] md:items-center"
                >
                  <Link href={`/commentary/${article.slug}`} className="group block">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt=""
                        loading="lazy"
                        width={1200}
                        height={900}
                        className="aspect-[4/3] w-full object-cover transition-opacity duration-500 group-hover:opacity-85"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full transition-opacity duration-500 group-hover:opacity-90">
                        <EditorialCover
                          category={article.topic}
                          title={article.title}
                          variant="archive"
                          editorialNumber={String(index + 1).padStart(2, "0")}
                        />
                      </div>
                    )}
                  </Link>
                  <div>
                    {topic ? (
                      <Link
                        href={`/commentary?topic=${topic.slug}`}
                        className="eyebrow text-gold transition-colors hover:text-navy"
                      >
                        {article.topic}
                      </Link>
                    ) : (
                      <p className="eyebrow text-gold">{article.topic}</p>
                    )}
                    <h2 className="mt-3 font-serif text-[1.75rem] leading-snug text-navy transition-colors hover:text-gold md:text-[1.875rem]">
                      <Link href={`/commentary/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                      {article.standfirst}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {article.date} · {article.readTime}
                    </p>
                    <Link
                      href={`/commentary/${article.slug}`}
                      className="link-arrow mt-6"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="rule-top bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-16">
          <p className="eyebrow">Explore by Topic</p>
          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {topics.map((topic) => {
              const count = articlesForTopic(allArticles, topic.slug).length;
              return (
                <li key={topic.name}>
                  <Link
                    href={`/commentary?topic=${topic.slug}`}
                    className="flex items-baseline justify-between border-b border-border py-4 transition-colors hover:text-gold"
                  >
                    <span className="font-serif text-xl text-navy">{topic.name}</span>
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {count} article{count === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
