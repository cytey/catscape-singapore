import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { newsItems } from "@/data/news";

const tagColors: Record<string, string> = {
  Event: "bg-primary/10 text-primary",
  News: "bg-accent/10 text-accent",
  Viral: "bg-cat-rose/10 text-cat-rose",
  Advisory: "bg-cat-gold/10 text-cat-gold",
};

const coverImages: Record<string, string> = {
  "cat-fest-2026-bishan-park": "https://images.pexels.com/photos/26706493/pexels-photo-26706493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "hdb-cat-friendly-policy-update": "https://images.pexels.com/photos/21047223/pexels-photo-21047223.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "free-tnr-clinic-tampines": "https://images.pexels.com/photos/11683916/pexels-photo-11683916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "whiskers-void-deck-cat-viral": "https://images.pexels.com/photos/17138081/pexels-photo-17138081.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "neko-no-niwa-10-years": "https://images.pexels.com/photos/38189495/pexels-photo-38189495.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "monsoon-community-cat-shelters": "https://images.pexels.com/photos/31961534/pexels-photo-31961534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

const News = () => {
  useSEO({
    title: "Cat News & Events in Singapore – Cat-ch Up",
    description: "Latest cat news, events, viral stories and advisories in Singapore: Cat-Fest, HDB cat policy updates, TNR clinics, cat café events and more.",
    keywords: ["cat news Singapore", "cat events Singapore", "Cat-Fest Singapore", "HDB cat policy", "TNR clinic Singapore", "cat welfare news"],
    jsonLd: { "@context": "https://schema.org", "@type": "Blog", name: "CatScape Cat-ch Up", description: "Singapore cat news, events and advisories." },
  });

  const [lead, ...rest] = newsItems;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-2">📰 Cat-ch Up</h1>
        <p className="text-muted-foreground max-w-md">
          Stay in the mew-s! All the latest cat-tivities, events, and feline news from Singapore.
        </p>
        <p className="text-primary/40 text-2xl mt-4 tracking-[0.5em]">🐾 🐾 🐾</p>
      </div>

      {/* Lead story */}
      {lead && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to={`/news/${lead.slug}`} className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border-2 border-border shadow-card hover:shadow-hover transition-all mb-10">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src={coverImages[lead.slug]}
                alt={lead.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-card/90 font-semibold text-primary">Latest</span>
            </div>
            <div className="p-6 md:p-8 bg-card flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-muted-foreground">{lead.date}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tagColors[lead.tag]}`}>{lead.tag}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{lead.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{lead.desc}</p>
              <p className="text-sm text-primary font-semibold mt-4">Read the full story →</p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Compact rows */}
      <div className="max-w-3xl space-y-3">
        {rest.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <Link
              to={`/news/${item.slug}`}
              className="flex gap-4 p-4 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all group"
            >
              <img
                src={coverImages[item.slug]}
                alt=""
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tagColors[item.tag]}`}>{item.tag}</span>
                </div>
                <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default News;
