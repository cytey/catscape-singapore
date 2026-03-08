import FeatureCard from "@/components/FeatureCard";

const services = [
  { icon: "🏥", title: "Vets & Cat-linics", items: ["The Cat Clinic (Tanjong Pagar)", "Mount Pleasant Vet Centre", "Jireh Veterinary Clinic", "Animal & Avian Veterinary Clinic"], color: "teal" as const },
  { icon: "🏠", title: "Boarding & Fur-ster", items: ["The Cat Museum Boarding", "Neko no Niwa Cat Café", "Catopia Cat Boarding", "Kitty Care Haven"], color: "primary" as const },
  { icon: "🚕", title: "Pet Taxi & Trans-purr-t", items: ["SG Pet Taxi", "Pawfect Rides", "Meow Movers SG", "Cat Cab Express"], color: "gold" as const },
  { icon: "🧘", title: "Cat Whisker-ers", items: ["Paws & Whiskers Behaviorist", "The Cat Whisperer SG", "Feline Fur-endly Trainer", "Purr-sonal Cat Coach"], color: "rose" as const },
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🏥 Cat Care Hub</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Find the purr-fect services for your fur-baby. From vet cat-linics to pet taxi trans-purr-t!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {services.map((s) => (
          <FeatureCard key={s.title} icon={s.icon} title={s.title} description="" color={s.color}>
            <ul className="mt-3 space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">🐾</span> {item}
                </li>
              ))}
            </ul>
          </FeatureCard>
        ))}
      </div>

      <div className="text-center mt-12 p-8 rounded-3xl bg-card border-2 border-border shadow-card max-w-2xl mx-auto">
        <p className="text-4xl mb-3">🐱</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Know a Paw-some Service?</h2>
        <p className="text-muted-foreground text-sm">
          Help us grow the cat-munity directory! Contact us to add your fur-vourite cat services.
        </p>
      </div>
    </div>
  );
};

export default Services;
