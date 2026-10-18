import { useSEO } from "@/hooks/useSEO";

const newsItems = [
  { date: "Mar 7, 2026", title: "🎉 Cat-Fest 2026 at Bishan Park!", desc: "Singapore's biggest cat-lebration is back! Join us for a day of fur-n with adoption drives, cat yoga, and the Annual Chonk Purr-ade!", tag: "Event" },
  { date: "Mar 5, 2026", title: "📋 New HDB Cat-Friendly Purr-licy Update", desc: "Great mews! HDB has expanded the list of approved cat breeds. More fur-babies can now live in flats o-fur-cially!", tag: "News" },
  { date: "Mar 2, 2026", title: "🏥 Free TNR Clinic at Tampines Hub", desc: "The Cat Welfare Society is offering free Trap-Neuter-Return services this weekend. Help control the community cat paw-pulation humanely!", tag: "Event" },
  { date: "Feb 28, 2026", title: "😻 Whiskers the Void Deck Cat Goes Viral!", desc: "A Toa Payoh community cat named Whiskers has gone viral for his daily routine of greeting residents. He's now a local cele-purr-ty!", tag: "Viral" },
  { date: "Feb 25, 2026", title: "🐾 Cat Café Neko no Niwa Cele-purr-ates 10 Years", desc: "Singapore's beloved cat café marks a fur-midable milestone! Special purr-motions all week.", tag: "News" },
  { date: "Feb 20, 2026", title: "🌧️ Monsoon Season: Keep Community Cats Safe!", desc: "Tips from local feeders on how to create rain shelters for void deck kitties during the wet season.", tag: "Advisory" },
];

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
          <div key={item.title} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground">{item.date}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tagColors[item.tag]}`}>
                {item.tag}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
