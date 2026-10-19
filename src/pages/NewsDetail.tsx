import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getNewsItem, newsItems } from "@/data/news";
import ShareButtons from "@/components/ShareButtons";

const tagColors: Record<string, string> = {
  Event: "bg-primary/10 text-primary",
  News: "bg-accent/10 text-accent",
  Viral: "bg-cat-rose/10 text-cat-rose",
  Advisory: "bg-cat-gold/10 text-cat-gold",
};

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const item = getNewsItem(slug);

  useSEO({
    title: item ? item.title : "Article Not Found",
    description: item ? item.desc : "This article could not be found.",
    keywords: item ? ["cat news Singapore", item.tag] : undefined,
    ogType: "article",
    jsonLd: item
      ? {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.desc,
          datePublished: item.date,
        }
      : undefined,
    canonical: item ? `https://catscape.sg/news/${item.slug}` : undefined,
  });

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🙀</p>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Article not found</h1>
        <Link to="/news" className="text-primary font-semibold hover:underline">← Back to all news</Link>
      </div>
    );
  }

  const otherItems = newsItems.filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft size={16} /> All news
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-muted-foreground">{item.date}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tagColors[item.tag]}`}>
          {item.tag}
        </span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-hero mb-6">{item.title}</h1>

      <div className="space-y-5">
        {item.body.map((paragraph, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <ShareButtons title={item.title} path={`/news/${item.slug}`} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">More cat-ch up 📰</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherItems.map((n) => (
            <Link
              key={n.slug}
              to={`/news/${n.slug}`}
              className="p-4 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all"
            >
              <p className="text-xs text-muted-foreground mb-1">{n.date}</p>
              <p className="text-sm font-semibold text-foreground">{n.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
