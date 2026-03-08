const storeItems = [
  { icon: "🍖", name: "Purr-emium Kibble", price: 24.90, desc: "Grain-free, fur-mula-ted for Singapore's tropical climate cats!" },
  { icon: "🧸", name: "Catnip Mouse Toy", price: 8.90, desc: "Fur-illed with organic catnip. Warning: may cause extreme zoomies!" },
  { icon: "🛏️", name: "Cozy Cat Loaf Bed", price: 39.90, desc: "The purr-fect bed for your fur-baby to make biscuits in!" },
  { icon: "🪮", name: "De-shedding Fur-minator", price: 19.90, desc: "Say bye-bye to fur-niture covered in cat hair. A must-have!" },
  { icon: "🎾", name: "Interactive Laser Toy", price: 15.90, desc: "Auto-rotating laser pointer for when you're too tired to play!" },
  { icon: "👕", name: "CatScape Meow-ch Tee", price: 29.90, desc: "Rep the cat-munity! Available in sizes XS to XXL. Paw-some quality!" },
  { icon: "🍣", name: "Tuna Treats (SG Edition)", price: 6.90, desc: "Made with locally-sourced tuna. Your cat will go absolutely mental!" },
  { icon: "🏠", name: "Cat Condo Tower", price: 89.90, desc: "A fur-tress of fun! 5-tier cat tree with scratching posts and hidey-holes." },
];

const Store = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🛍️ Cat-alogue Store</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Paws-itively the best cat products! Treat your fur-baby to some meow-chandise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {storeItems.map((item) => (
          <div key={item.name} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all group">
            <div className="text-5xl mb-4 group-hover:animate-paw-bounce">{item.icon}</div>
            <h3 className="font-display text-base font-bold text-foreground mb-1">{item.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-gradient-hero">${item.price.toFixed(2)}</span>
              <button className="px-3 py-1.5 rounded-lg bg-gradient-hero text-primary-foreground text-xs font-display font-bold shadow-soft hover:shadow-hover transition-all">
                Add to Cart 🐾
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 p-6 rounded-2xl bg-secondary max-w-md mx-auto">
        <p className="text-muted-foreground text-sm">
          🚧 Full e-com-mew-rce coming soon! Products will be purr-chaseable with backend integration.
        </p>
      </div>
    </div>
  );
};

export default Store;
