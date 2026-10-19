import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { newsItems } from "@/data/news";

const tagColors: Record<string, string> = {
  Event: "bg-primary/10 text-primary",
  News: "bg-accent/10 text-accent",
  Viral: "bg-cat-rose/10 text-cat-rose",
  Advisory: "bg-cat-gold/10 text-cat-gold",
};

const News = () => {
  useSEO({
    title: "Cat News & Events in Singapore – Cat-ch Up",
    description: "Latest cat news, events, viral stories and advisories in Singapore: Cat-Fest, HDB cat policy updates, TNR clinics, cat café events and more.",
    keywords: ["cat news Singapore", "cat events Singapore", "Cat-Fest Singapore", "HDB cat policy", "TNR clinic Singapore", "cat welfare news"],
    jsonLd: { "@context": "https://schema.org", "@type": "Blog", name: "CatScape Cat-ch Up", description: "Singapore cat news, events and advisories." },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">📰 Cat-ch Up!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Stay in the mew-s! All the latest cat-tivities, events, and feline news from Singapore.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {newsItems.map((item) => (
          <div key={item.slug} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground">{item.date}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tagColors[item.tag]}`}>
                {item.tag}
              </span>
            </div>
            <Link to={`/news/${item.slug}`}>
              <h3 className="font-display text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Link>
            <Link to={`/news/${item.slug}`} className="text-sm text-primary font-semibold mt-3 inline-block">
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
