import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { guides } from "@/data/guides";

const guideImages: Record<string, string> = {
  "purr-fect-diet": "https://images.pexels.com/photos/38151508/pexels-photo-38151508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "cat-proofing-your-hdb": "https://images.pexels.com/photos/40061529/pexels-photo-40061529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "vet-visit-purr-eparation": "https://images.pexels.com/photos/6900232/pexels-photo-6900232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "fur-niture-rescue": "https://images.pexels.com/photos/33855553/pexels-photo-33855553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "singapore-heat-purr-tection": "https://images.pexels.com/photos/4062842/pexels-photo-4062842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "travelling-with-cats-in-sg": "https://images.pexels.com/photos/8437362/pexels-photo-8437362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

const Guides = () => {
  useSEO({
    title: "Cat Care Guides & Tips in Singapore – Purr-fect Tips",
    description: "Practical cat care guides for Singapore owners: diet, HDB cat-proofing, vet visit prep, fur removal hacks, heat protection, and pet travel tips.",
    keywords: ["cat care Singapore", "cat care guide", "HDB cat proofing", "cat diet Singapore", "cat vet tips", "cat heat Singapore", "cat travel Singapore"],
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "CatScape Purr-fect Tips", description: "Cat care guides and tips for Singapore owners." },
  });

  const [first, ...rest] = guides;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-2">📚 Purr-fect Tips & Hacks</h1>
        <p className="text-muted-foreground max-w-md">
          Be-fur you scroll, know this: these guides will make you the most claw-ver cat purr-ent in Singapore!
        </p>
        <p className="text-primary/40 text-2xl mt-4 tracking-[0.5em]">🐾 🐾 🐾</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Featured guide */}
        {first && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to={`/guides/${first.slug}`}
              className="group block rounded-3xl overflow-hidden border-2 border-border shadow-card hover:shadow-hover transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={guideImages[first.slug]}
                  alt={first.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 bg-card">
                <div className="text-3xl mb-2">{first.icon}</div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{first.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{first.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {first.tips.slice(0, 3).map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">🐾</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-primary font-semibold">Read the full guide →</p>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Compact guide list */}
        <div className="space-y-3">
          {rest.map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link
                to={`/guides/${g.slug}`}
                className="flex gap-4 p-4 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all group"
              >
                <img
                  src={guideImages[g.slug]}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">{g.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{g.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
