import { useQuery } from "@tanstack/react-query";
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🛍️ Cat-alogue Store</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Paws-itively the best cat products! Treat your fur-baby to some meow-chandise.
        </p>
      </div>

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
          {products.map((item) => (
            <div key={item.id} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all group">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              ) : (
                <div className="w-full h-40 rounded-xl mb-4 bg-secondary flex items-center justify-center text-5xl">🐱</div>
              )}
              <h3 className="font-display text-base font-bold text-foreground mb-1">{item.name}</h3>
              {item.category && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{item.category}</span>}
              <p className="text-xs text-muted-foreground mb-3 mt-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-gradient-hero">${Number(item.price).toFixed(2)}</span>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-hero text-primary-foreground text-xs font-display font-bold shadow-soft hover:shadow-hover transition-all">
                  Add to Cart 🐾
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
