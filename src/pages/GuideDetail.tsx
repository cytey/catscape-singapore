import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getGuide, guides } from "@/data/guides";
import ShareButtons from "@/components/ShareButtons";

const guideImages: Record<string, string> = {
  "purr-fect-diet": "https://images.pexels.com/photos/38151508/pexels-photo-38151508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "cat-proofing-your-hdb": "https://images.pexels.com/photos/40061529/pexels-photo-40061529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "vet-visit-purr-eparation": "https://images.pexels.com/photos/6900232/pexels-photo-6900232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "fur-niture-rescue": "https://images.pexels.com/photos/33855553/pexels-photo-33855553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "singapore-heat-purr-tection": "https://images.pexels.com/photos/4062842/pexels-photo-4062842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "travelling-with-cats-in-sg": "https://images.pexels.com/photos/8437362/pexels-photo-8437362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

const GuideDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuide(slug);

  useSEO({
    title: guide ? `${guide.title} – Cat Care Guide` : "Guide Not Found",
    description: guide ? guide.desc : "This cat care guide could not be found.",
    keywords: guide ? ["cat care Singapore", guide.title] : undefined,
    ogType: "article",
    jsonLd: guide
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.desc,
        }
      : undefined,
    canonical: guide ? `https://catscape.sg/guides/${guide.slug}` : undefined,
  });

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🙀</p>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Guide not found</h1>
        <Link to="/guides" className="text-primary font-semibold hover:underline">← Back to all guides</Link>
      </div>
    );
  }

  const otherGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft size={16} /> All guides
      </Link>

      <div className="text-5xl mb-4">{guide.icon}</div>
      <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">{guide.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-6">{guide.intro}</p>

      {guideImages[guide.slug] && (
        <img
          src={guideImages[guide.slug]}
          alt={guide.title}
          className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-card mb-8"
        />
      )}

      <div className="space-y-8">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">{section.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-secondary">
        <h2 className="font-display text-lg font-bold text-foreground mb-3">Quick tips 🐾</h2>
        <ul className="space-y-2">
          {guide.tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">🐾</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <ShareButtons title={guide.title} path={`/guides/${guide.slug}`} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Keep reading 📚</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherGuides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="p-4 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-2">{g.icon}</div>
              <p className="text-sm font-semibold text-foreground">{g.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
