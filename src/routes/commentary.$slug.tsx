import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles } from "@/lib/content";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/commentary/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
      };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — Foluso Ajibulu` },
        { name: "description", content: article.standfirst },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.standfirst },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article>
        <header className="mx-auto max-w-[820px] px-6 pb-10 pt-16 text-center">
          <p className="eyebrow text-gold">{article.topic}</p>
          <h1 className="mt-5 font-serif text-[2.25rem] leading-[1.15] text-navy sm:text-[3rem]">
            {article.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {article.standfirst}
          </p>
          <p className="mt-7 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Commander Foluso Ajibulu (Rtd.) · {article.date} · {article.readTime}
          </p>
        </header>

        <figure className="mx-auto max-w-[1100px] px-6">
          <img
            src={article.image}
            alt={article.title}
            width={1600}
            height={1000}
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>

        <div className="prose-article mx-auto max-w-[720px] px-6 py-14">
          {article.body.map((paragraph: string, i: number) => (
            <div key={paragraph.slice(0, 24)}>
              <p>{paragraph}</p>
              {article.pullQuote && i === 1 ? (
                <blockquote>{article.pullQuote}</blockquote>
              ) : null}
            </div>
          ))}
        </div>

        {/* Author */}
        <div className="mx-auto max-w-[720px] px-6">
          <div className="rule-top flex items-center gap-6 py-10">
            <img
              src={portrait}
              alt="Commander Foluso Ajibulu (Rtd.)"
              loading="lazy"
              width={160}
              height={160}
              className="h-20 w-20 shrink-0 object-cover object-top grayscale"
            />
            <div>
              <p className="font-serif text-xl text-navy">
                Commander Foluso Ajibulu (Rtd.)
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Retired Nigerian Navy Commander, historian and public affairs commentator.
              </p>
            </div>
          </div>
        </div>
      </article>

      <section className="rule-top bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <p className="eyebrow">More from Commander Ajibulu</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/commentary/$slug"
                params={{ slug: item.slug }}
                className="group block"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                />
                <p className="eyebrow mt-5 text-gold">{item.topic}</p>
                <h3 className="mt-3 font-serif text-[1.375rem] leading-snug text-navy">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
