import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles, topics } from "@/lib/content";

export const Route = createFileRoute("/commentary/")({
  head: () => ({
    meta: [
      { title: "Commentary — Foluso Ajibulu" },
      {
        name: "description",
        content:
          "Essays and commentary on Nigerian history, governance, national security and international relations by Commander Foluso Ajibulu (Rtd.).",
      },
      { property: "og:title", content: "Commentary — Foluso Ajibulu" },
      {
        property: "og:description",
        content:
          "An archive of essays on history, governance, security and international affairs.",
      },
    ],
  }),
  component: CommentaryIndex,
});

function CommentaryIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <header className="mx-auto max-w-[1200px] px-6 pb-12 pt-16">
        <p className="eyebrow">From the Desk of Commander Ajibulu</p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-navy sm:text-5xl">
          Reflections on history, politics, leadership and the issues shaping Nigeria and
          the world
        </h1>
      </header>

      <section className="rule-top">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="grid gap-8 border-b border-border py-10 first:pt-0 md:grid-cols-[0.9fr_1.4fr]"
            >
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
              </Link>
              <div className="flex flex-col justify-center">
                <p className="eyebrow text-gold">{article.topic}</p>
                <h2 className="mt-3 font-serif text-[1.875rem] leading-snug text-navy">
                  <Link to="/commentary/$slug" params={{ slug: article.slug }}>
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  {article.standfirst}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {article.date} · {article.readTime}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rule-top bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <p className="eyebrow">Explore by Topic</p>
          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {topics.map((topic) => (
              <li
                key={topic.name}
                className="flex items-baseline justify-between border-b border-border py-4"
              >
                <span className="font-serif text-xl text-navy">{topic.name}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {articles.filter((a) => a.topic === topic.name).length} article
                  {articles.filter((a) => a.topic === topic.name).length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
