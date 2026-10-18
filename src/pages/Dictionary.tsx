import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const catVocabulary = [
  { term: "Blep", definition: "When a cat sticks out just the tip of their tongue and fur-gets to put it back. Absolutely purr-cious!", category: "Expressions" },
  { term: "Biscuits / Making Biscuits", definition: "The kneading motion cats do with their paws, like they're purr-paring dough. A sign of con-tent-ment!", category: "Behavior" },
  { term: "Zoomies", definition: "Sudden bursts of fur-antic energy where a cat races around the house at 3am. Also called the 'Midnight Crazies'!", category: "Behavior" },
  { term: "Toe Beans", definition: "The adorable, squishy paw pads on a cat's feet. They look like little jelly beans!", category: "Anatomy" },
  { term: "Mlem", definition: "A slow, deliberate lick, usually in the air. More in-ten-tional than a blep!", category: "Expressions" },
  { term: "Sploot", definition: "When a cat lies flat on their belly with legs stretched out behind them. Maximum fur-laxation!", category: "Positions" },
  { term: "Loaf / Cat Loaf", definition: "When a cat tucks all their paws underneath them and looks like a loaf of bread. Purr-fectly baked!", category: "Positions" },
  { term: "Chirp / Chirrup", definition: "A short, bird-like trill cats make when excited or greeting their hooman. A meow-sical sound!", category: "Sounds" },
  { term: "Void", definition: "An affectionate term for a black cat. They're like adorable little fur-holes of darkness!", category: "Types" },
  { term: "Murder Mittens", definition: "The sharp claws hidden inside those cute paws. Danger beans activated!", category: "Anatomy" },
  { term: "Scritches", definition: "The act of scratching or petting a cat in their favorite spots. Behind the ears = purr-adise!", category: "Interactions" },
  { term: "Slow Blink", definition: "A cat's way of saying 'I love mew!' Blink back to show your a-fur-ction!", category: "Communication" },
  { term: "Chonk / Chonker", definition: "An affectionate term for a round, well-fed cat. Extra floof, extra love!", category: "Types" },
  { term: "Floof", definition: "An extremely fluffy cat, or the state of being paw-sitively covered in fur!", category: "Types" },
  { term: "Teefies", definition: "When a cat's teeth are visible, especially the little fangs. Tiny vampurr!", category: "Anatomy" },
  { term: "Catloaf Position", definition: "See 'Loaf'. The international fur-mula for comfort!", category: "Positions" },
  { term: "Purrito", definition: "A cat wrapped snugly in a blanket, resembling a burrito. Warm and purr-fect!", category: "Positions" },
  { term: "SIC (Standard Issue Cat)", definition: "A brown/grey tabby cat — the default fur-mware of cats!", category: "Types" },
  { term: "Tuxedo", definition: "A black and white cat that looks like they're wearing a fancy suit. Always fur-mally dressed!", category: "Types" },
  { term: "Clowder", definition: "A group of cats. When one cat isn't enough, you need a whole clowder!", category: "Groups" },
  { term: "Kindle", definition: "A group of kittens. Not the e-reader, the fur-reader!", category: "Groups" },
  { term: "Cattitude", definition: "The unique, often sass-paw-rated personality only a cat can have!", category: "Behavior" },
  { term: "Hiss-terical", definition: "Something so funny it makes you hiss with laughter. Cat comedy gold!", category: "Expressions" },
  { term: "Paw-sitive", definition: "Looking on the bright side, the cat way. Always stay paw-sitive!", category: "Expressions" },
  { term: "Fur-ever", definition: "Forever, but with more fur. As in 'fur-ever home' — a cat's purr-manent family!", category: "Expressions" },
  { term: "Meow-velous", definition: "Something wonderful, amazing, or cat-tastic!", category: "Expressions" },
  { term: "Cat-astrophe", definition: "When something goes terribly wrong, usually involving a knocked-over vase!", category: "Expressions" },
  { term: "Purr-fect", definition: "Absolute per-fur-ction. The highest compliment in cat vocab-mew-lary!", category: "Expressions" },
  { term: "Fur-midable", definition: "Impressive and powerful, like a cat staring down a cucumber!", category: "Expressions" },
  { term: "TNR", definition: "Trap-Neuter-Return. A humane method to manage community cat populations in Singapore!", category: "Community" },
  { term: "Community Cat", definition: "A free-roaming cat cared for by the neighborhood. Singapore's beloved void deck residents!", category: "Community" },
  { term: "Feeder", definition: "A kind soul who regularly feeds community cats. The unsung heroes of Singapore's cat-munity!", category: "Community" },
  { term: "Void Deck Cat", definition: "A community cat commonly found in Singapore HDB void decks. Part of kampung spirit!", category: "Community" },
];

const categories = [...new Set(catVocabulary.map((v) => v.category))];

const Dictionary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync search with URL ?q= for shareable/indexable links
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (search) setSearchParams({ q: search }, { replace: true });
      else if (searchParams.get("q")) setSearchParams({}, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [search, searchParams, setSearchParams]);

  const activeTerm = catVocabulary.find((v) => v.term.toLowerCase() === search.toLowerCase().trim());

  useSEO({
    title: activeTerm ? `${activeTerm.term} – Cat Term Definition` : "Cat Vocabulary Dictionary (Meow-tionary)",
    description: activeTerm
      ? `${activeTerm.term}: ${activeTerm.definition.slice(0, 140)}`
      : "The complete cat vocabulary dictionary — learn blep, mlem, zoomies, toe beans, sploot, chonk, floof, purrito, TNR and 30+ more cat terms.",
    keywords: ["cat vocabulary", "cat terms", "cat slang dictionary", "blep", "zoomies", "toe beans", "sploot", "chonk", "floof", "cat language"],
    jsonLd: activeTerm
      ? { "@context": "https://schema.org", "@type": "DefinedTerm", name: activeTerm.term, description: activeTerm.definition, inDefinedTermSet: "CatScape Meow-tionary" }
      : { "@context": "https://schema.org", "@type": "CollectionPage", name: "CatScape Meow-tionary", description: "Complete cat vocabulary dictionary with definitions of cat slang, behavior, anatomy, and community terms." },
  });

  const filtered = catVocabulary.filter((v) => {
    const matchesSearch =
      v.term.toLowerCase().includes(search.toLowerCase()) ||
      v.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">📖 The Meow-tionary</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your com-purr-hensive guide to cat vocab-mew-lary! Learn the lingo and speak fluent feline.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search fur a term..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border-2 border-border focus:border-primary focus:outline-none shadow-card font-body text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            !selectedCategory ? "bg-gradient-hero text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          All 🐾
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === cat ? "bg-gradient-hero text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {filtered.map((v) => (
          <div
            key={v.term}
            className="p-5 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg font-bold text-foreground">{v.term}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold">
                {v.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.definition}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">😿</p>
          <p className="text-muted-foreground font-display text-lg">No results found! That's a real cat-astrophe!</p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
