import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-cats.jpg";
import FeatureCard from "@/components/FeatureCard";

const features = [
  { icon: "💰", title: "Paw-Fund", desc: "Fur-ndraising for community cats and your fur-babies. Every purr-ny counts!", path: "/fundraising", color: "primary" as const },
  { icon: "🛍️", title: "Cat-alogue Store", desc: "Paws-itively the best cat products! From meow-chandise to treats.", path: "/store", color: "gold" as const },
  { icon: "🐱", title: "Whisker Watch", desc: "Register community cats, update their fur-eeding status, and keep tabs on every whisker.", path: "/community-cats", color: "accent" as const },
  { icon: "📖", title: "Meow-tionary", desc: "The purr-fect dictionary of all cat vocab-mew-lary. From 'blep' to 'zoomies'!", path: "/dictionary", color: "teal" as const },
  { icon: "📰", title: "Cat-ch Up News", desc: "Stay in the mew-s! Events, cat-tivities, and all things feline in Singapore.", path: "/news", color: "rose" as const },
  { icon: "📚", title: "Purr-fect Tips", desc: "Hiss-terical hacks and claw-ver guides for cat care. Be the best cat purr-ent!", path: "/guides", color: "primary" as const },
  { icon: "✨", title: "Cat-verter", desc: "Trans-fur your boring text into paw-some cat vocab-mew-lary! Meow-gical!", path: "/dictionary", color: "gold" as const },
  { icon: "🏥", title: "Cat Care Hub", desc: "Find vets, cat whisker-ers, fur-ster homes, pet taxis, and boarding fur-cilities.", path: "/services", color: "teal" as const },
  { icon: "🏡", title: "Fur-ever Homes", desc: "Browse adorable cats waiting for their fur-ever families. Adopt, don't shop!", path: "/adoptions", color: "rose" as const },
];

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Happy cats of Singapore" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-hero">CatScape</span>
              <span className="block text-2xl md:text-3xl mt-2 text-foreground">
                Singapore's Purr-mier Cat Superapp 🇸🇬
              </span>
            </h1>
            <p className="text-lg text-foreground/80 mb-8 max-w-lg">
              The one-stop paw-tal for every cat lover in the Lion City. 
              From fur-ndraising to fur-ster care — we've got every whisker covered!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/fundraising"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-semibold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5"
              >
                🐾 Donate Meow
              </Link>
              <Link
                to="/community-cats"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border-2 border-primary/20 text-foreground font-display font-semibold shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5"
              >
                🐱 Whisker Watch
              </Link>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Claw-some Fur-tures 🐾
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything a cat purr-ent needs, all in one paw-some app!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            >
              <Link to={f.path} className="block">
                <FeatureCard icon={f.icon} title={f.title} description={f.desc} color={f.color} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-center shadow-hover" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Join the Clowder? 😸
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-lg mx-auto">
            Whether you're a seasoned cat purr-ent or a kitten newbie, 
            CatScape is your fur-ever companion in Singapore's feline community!
          </p>
          <Link
            to="/fundraising"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-card text-foreground font-display font-bold shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5"
          >
            🐾 Start Your Purr-ney
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
