import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { guides } from "@/data/guides";

const Guides = () => {
  useSEO({
    title: "Cat Care Guides & Tips in Singapore – Purr-fect Tips",
    description: "Practical cat care guides for Singapore owners: diet, HDB cat-proofing, vet visit prep, fur removal hacks, heat protection, and pet travel tips.",
    keywords: ["cat care Singapore", "cat care guide", "HDB cat proofing", "cat diet Singapore", "cat vet tips", "cat heat Singapore", "cat travel Singapore"],
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "CatScape Purr-fect Tips", description: "Cat care guides and tips for Singapore owners." },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">📚 Purr-fect Tips & Hacks</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Be-fur you scroll, know this: these guides will make you the most claw-ver cat purr-ent in Singapore!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {guides.map((g) => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover transition-all"
          >
            <div className="text-4xl mb-3">{g.icon}</div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{g.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{g.desc}</p>
            <ul className="space-y-2">
              {g.tips.slice(0, 2).map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">🐾</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-primary font-semibold mt-4">Read the full guide →</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Guides;
