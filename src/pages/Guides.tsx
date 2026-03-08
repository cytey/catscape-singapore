const guides = [
  { icon: "🍽️", title: "The Purr-fect Diet", desc: "What to fur-eed your cat: wet vs dry, raw diets, and Singapore-specific brands. No table scraps — that's a cat-astrophe waiting to happen!", tips: ["Wet food for hydration", "Grain-free options available at Pet Lovers Centre", "Fresh water always — cats are notoriously fussy drinkers!"] },
  { icon: "🏠", title: "Cat-Proofing Your HDB", desc: "Make your flat a fur-tress of safety! Window mesh, toxic plant removal, and hiding those tempting cables.", tips: ["Install window mesh (mandatory in SG!)", "Remove lilies — they're toxic to cats!", "Secure loose cables with cable organizers"] },
  { icon: "💊", title: "Vet Visit Purr-eparation", desc: "Don't let vet visits be a hiss-terical experience! Tips for a calm journey to the cat-linic.", tips: ["Get a sturdy carrier with top-opening", "Spray Feliway in carrier 30 mins before", "Book early morning appointments"] },
  { icon: "🧹", title: "Fur-niture Rescue: Hair Removal Hacks", desc: "Living with a cat means fur on everything. Here are some claw-ver hacks for a hair-free home!", tips: ["Rubber gloves work better than lint rollers", "Damp sponge for upholstery", "Robot vacuum = your new best fur-end"] },
  { icon: "🌡️", title: "Singapore Heat Purr-tection", desc: "It's always summer in SG! Keep your cat cool and com-fur-table in our tropical climate.", tips: ["Keep aircon at 24-26°C", "Frozen treats: cat-safe ice cubes!", "Cooling mats from Shopee work great"] },
  { icon: "✈️", title: "Travelling with Cats in SG", desc: "From pet taxis to boarding, here's your guide to cat trans-purr-tation in the Lion City!", tips: ["Book AVS-approved pet taxi services", "Get microchipped at any vet", "Boarding: book 2 weeks in advance!"] },
];

const Guides = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">📚 Purr-fect Tips & Hacks</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Be-fur you scroll, know this: these guides will make you the most claw-ver cat purr-ent in Singapore!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {guides.map((g) => (
          <div key={g.title} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover transition-all">
            <div className="text-4xl mb-3">{g.icon}</div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{g.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{g.desc}</p>
            <ul className="space-y-2">
              {g.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">🐾</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guides;
