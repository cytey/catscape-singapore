import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-cats.jpg";
import { useSEO } from "@/hooks/useSEO";

const features = [
  { icon: "🛍️", title: "Cat-alogue Store", desc: "Paws-itively the best cat products, from meow-chandise to treats.", path: "/store" },
  { icon: "🐱", title: "Whisker Watch", desc: "Register community cats and keep tabs on every feeding station.", path: "/community-cats" },
  { icon: "📖", title: "Meow-tionary", desc: "From 'blep' to 'zoomies' — the definitive cat vocabulary.", path: "/dictionary" },
  { icon: "✨", title: "Cat-verter", desc: "Trans-fur your boring text into paw-some cat speak.", path: "/cat-verter" },
  { icon: "🏥", title: "Cat Care Hub", desc: "Vets, groomers, foster homes, pet taxis and boarding.", path: "/services" },
  { icon: "🏡", title: "Lost & Found", desc: "Reunite wandering whiskers with their worried humans.", path: "/lost-found" },
];

const communityPhotos = [
  {
    src: "https://images.pexels.com/photos/9978232/pexels-photo-9978232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Two ginger kittens in warm sunlight",
  },
  {
    src: "https://images.pexels.com/photos/4062842/pexels-photo-4062842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "A tabby cat napping under a knit blanket",
  },
  {
    src: "https://images.pexels.com/photos/6853522/pexels-photo-6853522.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "A ginger cat playing with a rope toy among plants",
  },
];

const communityStats = [
  { value: "89,000+", label: "community cats in Singapore" },
  { value: "600+", label: "feeding stations island-wide" },
  { value: "1,200+", label: "kitties rehomed every year" },
  { value: "24/7", label: "whisker watchers on patrol" },
];

const Index = () => {
  useSEO({
    title: "CatScape – Singapore's Purr-mier Cat Superapp",
    description: "Singapore's one-stop cat superapp: fundraise for community cats, adopt fur-ever homes, track Whisker Watch, browse the Meow-tionary, find vets & boarding, and more.",
    keywords: ["cat Singapore", "community cats Singapore", "cat adoption Singapore", "cat superapp", "cat care Singapore", "TNR Singapore", "cat boarding Singapore"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CatScape",
      url: "https://catscape.sg",
      description: "Singapore's one-stop cat superapp for fundraising, community cat care, adoption, vocabulary, guides and services.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://catscape.sg/dictionary?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["fundraising-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fundraising_campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(2);
      if (error) throw error;
      return data;
    },
  });

  const { data: adoptables = [] } = useQuery({
    queryKey: ["home-adoptables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adoption_listings")
        .select("id, name, breed, location, image_url, age, gender")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const showCampaigns = campaigns.length > 0;
  const showAdoptables = adoptables.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-warm">
        <div className="paw-pattern absolute inset-0" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="eyebrow mb-4">Singapore's community cat superapp</p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground">
                Every cat deserves a <em className="text-primary not-italic">clowder</em>.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-lg">
                Fund the care. Find the homes. Keep every whisker accounted for.
                CatScape brings Singapore's cat lovers together on one platform —
                powered by neighbours like you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/fundraising"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all"
                >
                  <Heart size={18} /> Donate
                </Link>
                <Link
                  to="/adoptions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all"
                >
                  Adopt a cat <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="rounded-3xl overflow-hidden shadow-hover rotate-1">
                <img src={heroImage} alt="Cats of Singapore" className="w-full aspect-[4/3] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-8 rounded-2xl bg-card border border-border shadow-card px-5 py-4">
                <p className="font-display text-2xl font-bold text-primary">89,000+</p>
                <p className="text-xs text-muted-foreground">community cats across Singapore</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live campaigns */}
      {showCampaigns && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-2">Paw-Fund</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Active campaigns</h2>
            </div>
            <Link to="/fundraising" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
              All campaigns <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {campaigns.map((campaign, i) => {
              const progress = campaign.goal_amount > 0 ? (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100 : 0;
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link
                    to="/fundraising"
                    className="block h-full p-6 md:p-7 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all"
                  >
                    <h3 className="font-display text-xl font-bold text-foreground">{campaign.title}</h3>
                    {campaign.description && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{campaign.description}</p>
                    )}
                    <div className="mt-5 w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-gradient-hero transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="mt-2.5 flex justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        ${Number(campaign.current_amount).toLocaleString()} raised
                      </span>
                      <span className="text-muted-foreground">of ${Number(campaign.goal_amount).toLocaleString()}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Adoptables preview */}
      {showAdoptables && (
        <section className="bg-gradient-warm py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-2">Fur-ever homes</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Waiting to meet you</h2>
              </div>
              <Link to="/adoptions" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                All adoptables <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {adoptables.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to="/adoptions"
                    className="group block rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-hover transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🐱</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
                        {cat.age && <span className="text-xs text-muted-foreground">{cat.age}</span>}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={13} /> {cat.location}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community mosaic */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-3xl overflow-hidden">
          {communityPhotos.map((photo, i) => (
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className={`w-full h-48 md:h-64 object-cover rounded-2xl ${i === 0 ? "col-span-2" : ""}`}
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <p className="eyebrow mb-2">Everything else</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Explore the clowder</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link
                to={f.path}
                className="flex gap-4 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all h-full"
              >
                <span className="text-3xl shrink-0" aria-hidden="true">{f.icon}</span>
                <span>
                  <span className="block font-display text-lg font-bold text-foreground">{f.title}</span>
                  <span className="block text-sm text-muted-foreground leading-relaxed mt-1">{f.desc}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          className="relative overflow-hidden bg-gradient-hero rounded-3xl p-10 md:p-16 text-center shadow-hover"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="paw-pattern absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to join the clowder?
            </h2>
            <p className="text-primary-foreground/85 mb-8 max-w-lg mx-auto leading-relaxed">
              Whether you're a seasoned cat parent or a kitten newbie, CatScape is your
              companion in Singapore's feline community.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-card text-foreground font-semibold shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all"
            >
              Join CatScape <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
