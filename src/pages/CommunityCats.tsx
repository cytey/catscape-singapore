import { useState } from "react";
import { MapPin, Clock } from "lucide-react";

interface CatEntry {
  id: number;
  name: string;
  location: string;
  status: "fed" | "hungry" | "needs-help";
  lastFed: string;
  notes: string;
  image: string;
}

const initialCats: CatEntry[] = [
  { id: 1, name: "Whiskers", location: "Tampines Blk 201 Void Deck", status: "fed", lastFed: "2 hours ago", notes: "Friendly tabby, loves scritches! Regular at this spot.", image: "🐱" },
  { id: 2, name: "Shadow (The Void)", location: "Bedok North Blk 456", status: "hungry", lastFed: "8 hours ago", notes: "Black cat, shy at first but warms up. Purr-fers wet food.", image: "🐈‍⬛" },
  { id: 3, name: "Mochi", location: "Ang Mo Kio Town Garden", status: "fed", lastFed: "1 hour ago", notes: "Chonky calico, very vocal! Will meow-nipulate you for treats.", image: "🐈" },
  { id: 4, name: "Ginger Snap", location: "Jurong East Blk 303", status: "needs-help", lastFed: "12 hours ago", notes: "Orange tabby, limping on right paw. Needs vet visit!", image: "🐱" },
  { id: 5, name: "Princess Floof", location: "Bishan Blk 150 Garden", status: "fed", lastFed: "30 mins ago", notes: "Long-haired beauty, purr-fers to be admired from afar. Very floof.", image: "😺" },
];

const statusColors = {
  fed: "bg-accent/10 text-accent border-accent/20",
  hungry: "bg-cat-gold/10 text-cat-gold border-cat-gold/20",
  "needs-help": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels = {
  fed: "😸 Fed & Happy",
  hungry: "😿 Hungry",
  "needs-help": "🆘 Needs Help!",
};

const CommunityCats = () => {
  const [cats] = useState<CatEntry[]>(initialCats);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? cats.filter((c) => c.status === filter) : cats;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🐱 Whisker Watch</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Track and care for Singapore's community cats! Update fur-eeding status and keep every whisker accounted for.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!filter ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          All Cats 🐾
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === key ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filtered.map((cat) => (
          <div key={cat.id} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{cat.image}</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {cat.location}
                  </div>
                </div>
              </div>
            </div>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${statusColors[cat.status]}`}>
              {statusLabels[cat.status]}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock size={12} />
              Last fed: {cat.lastFed}
            </div>
            <p className="text-sm text-muted-foreground">{cat.notes}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 p-6 rounded-2xl bg-secondary max-w-md mx-auto">
        <p className="text-muted-foreground text-sm">
          🚧 Cat registration & photo uploads coming soon with backend integration! Stay paw-sitive!
        </p>
      </div>
    </div>
  );
};

export default CommunityCats;
