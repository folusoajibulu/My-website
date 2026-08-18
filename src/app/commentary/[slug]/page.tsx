import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { articles as staticArticles, topicForArticle } from "@/lib/content";
import { getPosts, getPostBySlug } from "@/lib/wordpress";
import { ShareButtons } from "@/components/ShareButtons";
import { EditorialCover } from "@/components/EditorialCover";
import { ArticleCard } from "@/components/ArticleCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await params;
  let article = await getPostBySlug(p.slug);
  if (!article) {
    article = staticArticles.find((a) => a.slug === p.slug) || null;
  }
  if (!article) {
    return {
      title: "Unavailable",
      robots: "noindex",
    };
  }

  const metaTitle = article.seo?.title || `${article.title} — Foluso Ajibulu`;
  const metaDescription = article.seo?.description || article.standfirst;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: article.seo?.keywords ? article.seo.keywords.split(',').map(k => k.trim()) : [article.topic, "Foluso Ajibulu", "Commentary"],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://folusoajibulu.com/commentary/${article.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `https://folusoajibulu.com/commentary/${article.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const wpPosts = await getPosts();
  const allArticles = wpPosts.length > 0 ? wpPosts : staticArticles;
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  let article = await getPostBySlug(p.slug);
  let allArticles = await getPosts();

  if (!article) {
    article = staticArticles.find((a) => a.slug === p.slug) || null;
    if (allArticles.length === 0) allArticles = staticArticles;
  }

  if (!article) {
    notFound();
  }

  const related = allArticles.filter((a) => a.slug !== article?.slug).slice(0, 3);
  const topic = topicForArticle(article.topic);

  return (
    <SiteShell>
      <ReadingProgress />

      <article data-article>
        <header className="mx-auto max-w-[820px] px-6 pb-10 pt-10 md:pt-16">
          <Link
            href={topic ? `/commentary?topic=${topic.slug}` : "/commentary"}
            className="text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
          >
            ← {topic ? topic.name : "Commentary"}
          </Link>
          <p className="eyebrow mt-8 text-center text-gold">{article.topic}</p>
          <h1 className="mt-5 text-center font-serif text-[2.25rem] leading-[1.15] text-navy sm:text-[3rem]">
            {article.title}
          </h1>

          <p className="mt-7 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Commander Foluso Ajibulu (Rtd.) · {article.date} · {article.readTime}
          </p>
        </header>

        <figure className="mx-auto max-w-[1100px] px-6">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              width={1600}
              height={1000}
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="aspect-[16/9] w-full">
              <EditorialCover category={article.topic} title={article.title} variant="featured" />
            </div>
          )}
        </figure>

        <div className="prose-article mx-auto max-w-[720px] px-6 py-12 md:py-14">
          {article.contentHTML ? (
            <div dangerouslySetInnerHTML={{ __html: article.contentHTML }} />
          ) : (
            article.body.map((paragraph: string, i: number) => (
              <div key={paragraph.slice(0, 24)}>
                <p>{paragraph}</p>
                {article.pullQuote && i === 1 ? (
                  <blockquote>{article.pullQuote}</blockquote>
                ) : null}
              </div>
            ))
          )}
        </div>

        <div className="mx-auto max-w-[720px] px-6">
          <ShareButtons title={article.title} />
        </div>

        <div className="mx-auto max-w-[720px] px-6">
          <div className="flex items-center gap-6 py-10">
            <Image
              src="/ajibulu.png"
              alt="Commander Foluso Ajibulu (Rtd.)"
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
        <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="eyebrow">More from Commander Ajibulu</p>
            <Link href="/commentary" className="link-arrow">
              Explore the archive →
            </Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {related.map((item, index) => (
              <ArticleCard key={item.slug} article={item} index={index + 1} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
