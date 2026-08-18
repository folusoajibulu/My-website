import { Article } from "./content";

const WP_URL = process.env.WORDPRESS_API_URL || "https://example.com";

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export async function getPosts(): Promise<Article[]> {
  try {
    if (!process.env.WORDPRESS_API_URL) return [];
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed`, {
      next: { revalidate: 3600, tags: ['wordpress'] },
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts: WPPost[] = await res.json();
    return posts.map(mapWPPostToArticle);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Article | null> {
  try {
    if (!process.env.WORDPRESS_API_URL) return null;
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
      next: { revalidate: 3600, tags: ['wordpress'] },
    });
    if (!res.ok) throw new Error("Failed to fetch post");
    const posts: WPPost[] = await res.json();
    if (!posts || posts.length === 0) return null;
    return mapWPPostToArticle(posts[0]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function mapWPPostToArticle(post: WPPost): Article {
  // Strip HTML tags and remove [&hellip;] or &hellip; from the excerpt/standfirst
  const standfirst = post.excerpt.rendered
    .replace(/<[^>]+>/g, "")
    .replace(/\[&hellip;\]/g, "")
    .replace(/&hellip;/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "—")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .trim();
  
  // Format date (e.g. 12 July 2026)
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Extract topic (category)
  let topic = "Uncategorized";
  if (post._embedded?.["wp:term"]?.[0]?.[0]?.name) {
    topic = post._embedded["wp:term"][0][0].name.replace(/&amp;/g, "&");
  }

  // Extract featured image
  let image: string | undefined = undefined;
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    image = post._embedded["wp:featuredmedia"][0].source_url;
  }

  // Calculate read time roughly
  const wordCount = post.content.rendered.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Decode basic HTML entities for title
  const title = post.title.rendered
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "—")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");

  return {
    slug: post.slug,
    topic,
    title,
    standfirst,
    date,
    readTime,
    image,
    body: [],
    contentHTML: post.content.rendered,
    seo: post.seo,
  };
}
