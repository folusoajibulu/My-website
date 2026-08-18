import Link from "next/link";
import { EditorialCover } from "@/components/EditorialCover";
import type { Article } from "@/lib/content";

export function ArticleCard({
  article,
  index = 1,
}: {
  article: Article;
  index?: number;
}) {
  return (
    <article>
      <Link href={`/commentary/${article.slug}`} className="group block">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:opacity-85"
          />
        ) : (
          <div className="aspect-[4/3] w-full transition duration-500 group-hover:opacity-90">
            <EditorialCover
              category={article.topic}
              title={article.title}
              variant="card"
              editorialNumber={String(index).padStart(2, "0")}
            />
          </div>
        )}
        <p className="eyebrow mt-5 text-gold">{article.topic}</p>
        <h3 className="mt-3 font-serif text-[1.5rem] leading-snug text-navy transition-colors duration-300 group-hover:text-gold">
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
  );
}
