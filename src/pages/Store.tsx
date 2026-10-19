import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

const Store = () => {
  useSEO({
    title: "Cat-alogue Store – Cat Products & Meow-chandise",
    description: "Shop the best cat products in Singapore: food, treats, toys, beds, scratchers and meow-chandise. Treat your fur-baby today!",
    keywords: ["cat products Singapore", "cat store Singapore", "cat food Singapore", "cat toys", "cat meow-chandise", "pet supplies Singapore"],
    jsonLd: { "@context": "https://schema.org", "@type": "Store", name: "CatScape Cat-alogue", description: "Online store for cat products in Singapore." },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["store-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("store_products").select("*").eq("in_stock", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-2">🛍️ Cat-alogue Store</h1>
        <p className="text-muted-foreground max-w-md">
          Paws-itively the best cat products! Treat your fur-baby to some meow-chandise.
        </p>
      </div>

      {/* Promo banner */}
      <motion.div
        className="bg-gradient-hero rounded-3xl p-6 md:p-8 mb-10 shadow-hover flex flex-col md:flex-row items-center gap-4 justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-primary-foreground mb-1">Free shipping over $50! 🚚</h2>
          <p className="text-primary-foreground/80 text-sm">Every purchase helps fund care for community cats. Shop with purr-pose!</p>
        </div>
        <ShoppingBag className="text-primary-foreground shrink-0" size={44} />
      </motion.div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              !activeCategory ? "bg-gradient-hero text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat ? "bg-gradient-hero text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card animate-pulse">
              <div className="w-full h-40 rounded-xl bg-muted mb-4" />
              <div className="h-5 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3 animate-paw-bounce">🐱</p>
          <p className="text-muted-foreground font-display text-lg">New products coming soon! Stay paw-sitive!</p>
          <p className="text-muted-foreground text-sm mt-2">Add products via the Cloud database to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all group"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-[1.03] transition-transform duration-300" />
              ) : (
                <div className="w-full h-40 rounded-xl mb-4 bg-secondary flex items-center justify-center text-5xl">🐱</div>
              )}
              <h3 className="font-display text-base font-bold text-foreground mb-1">{item.name}</h3>
              {item.category && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{item.category}</span>}
              <p className="text-xs text-muted-foreground mb-3 mt-2 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-gradient-hero">${Number(item.price).toFixed(2)}</span>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-hero text-primary-foreground text-xs font-display font-bold shadow-soft hover:shadow-hover transition-all">
                  Add to Cart 🐾
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
