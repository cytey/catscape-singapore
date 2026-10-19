export interface Guide {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  intro: string;
  sections: { heading: string; body: string }[];
  tips: string[];
}

export const guides: Guide[] = [
  {
    slug: "purr-fect-diet",
    icon: "🍽️",
    title: "The Purr-fect Diet",
    desc: "What to fur-eed your cat: wet vs dry, raw diets, and Singapore-specific brands. No table scraps — that's a cat-astrophe waiting to happen!",
    intro: "Cats are obligate carnivores — they need meat, not carbohydrates. Getting their diet right is the single biggest thing you can do for their long-term health.",
    sections: [
      { heading: "Wet food vs dry food", body: "Wet food is closer to a cat's natural prey diet and keeps them hydrated — crucial in Singapore's heat. Dry food is convenient and cheaper, but many cats on dry-only diets drink too little water. A good rule: wet food as the main meal, dry food as treats or topping." },
      { heading: "Reading the label", body: "Look for a named protein (chicken, tuna, duck) as the first ingredient — not 'meat by-products'. Avoid foods where corn or wheat top the list. Taurine must be present; it's essential for cat heart and eye health." },
      { heading: "Singapore brands & where to buy", body: "Pet Lovers Centre, KKMart and Shopee carry quality options like Ziwi Peak, Feline Natural and Karma. Budget pick: wet pouches from brands like Nature Bridge are widely available at NTUC. Buy small packs first — cats are famously picky and you don't want 24 cans of rejected pâté." },
      { heading: "Foods that are dangerous", body: "Never feed: onions, garlic, chocolate, grapes, alcohol, caffeine, raw dough, or anything with xylitol (sugar-free gum and some peanut butters). Cooked bones can splinter. Lilies — even the pollen — are deadly and common in SG bouquets." },
    ],
    tips: ["Wet food for hydration", "Grain-free options available at Pet Lovers Centre", "Fresh water always — cats are notoriously fussy drinkers!"],
  },
  {
    slug: "cat-proofing-your-hdb",
    icon: "🏠",
    title: "Cat-Proofing Your HDB",
    desc: "Make your flat a fur-tress of safety! Window mesh, toxic plant removal, and hiding those tempting cables.",
    intro: "High-rise living is the biggest danger for indoor cats in Singapore — 'high-rise syndrome' sends cats to the vet every week. Cat-proofing is simple and affordable if you do it before your cat arrives.",
    sections: [
      { heading: "Window mesh (non-negotiable)", body: "All windows and balcony openings need mesh strong enough to hold a determined cat. HDB-approved invisible grilles with pet mesh cost around $10–20 per sq ft installed. Open windows only with mesh secured — an open window with a screen door is not enough, cats tear through fly screens easily." },
      { heading: "Remove toxic plants", body: "Lilies are the most dangerous plant for cats — ingesting even a tiny amount of pollen causes kidney failure. Also remove: pothos, devil's ivy, aloe, jade plant, and sago palm. Safe alternatives: spider plants, Boston ferns, and cat grass (sold at most pet shops)." },
      { heading: "Cables, blinds & small spaces", body: "Bundle loose cables in sleeves — cats chew. Loop blind cords up high. Check gaps behind washing machines and wardrobes; block any hole wider than your cat's head. Keep the toilet lid closed if you use chemical cleaners." },
      { heading: "Create vertical space", body: "Cats feel safest up high. A simple cat tree, wall shelves, or cleared wardrobe-top space gives them territory and keeps them away from the window ledge drama. A scratching post near their favourite sofa corner saves your furniture." },
    ],
    tips: ["Install window mesh (mandatory in SG!)", "Remove lilies — they're toxic to cats!", "Secure loose cables with cable organizers"],
  },
  {
    slug: "vet-visit-purr-eparation",
    icon: "💊",
    title: "Vet Visit Purr-eparation",
    desc: "Don't let vet visits be a hiss-terical experience! Tips for a calm journey to the cat-linic.",
    intro: "A stressful vet visit can make the next one twice as hard. A little preparation turns a yowling carrier horror show into a routine errand.",
    sections: [
      { heading: "Choose the right carrier", body: "Top-opening carriers let the vet lift your cat out without a wrestling match, and let you lower a scared cat in from above. Hard carriers are easier to clean and safer in a taxi. Leave the carrier out at home permanently with a blanket inside so it smells like home, not like doom." },
      { heading: "Before the visit", body: "Spray Feliway (calming pheromone) in the carrier 30 minutes before. Don't feed a big meal right before travel — many cats vomit in the car. Cover the carrier with a light towel in the waiting room to block the sight (and scent) of dogs." },
      { heading: "Finding a cat-friendly clinic", body: "Look for clinics with 'cat-only' hours or a separate cat waiting area — The Cat Clinic, Mount Pleasant (multiple branches) and Jireh all cater to felines. Ask if they have cat-quiet hours when booking. Early morning slots mean shorter waits." },
      { heading: "What to bring", body: "A list of symptoms with dates (phone notes work great), a photo or video of the odd behaviour — cats behave differently at the clinic, so evidence helps. Bring your cat's vaccination booklet if you have one." },
    ],
    tips: ["Get a sturdy carrier with top-opening", "Spray Feliway in carrier 30 mins before", "Book early morning appointments"],
  },
  {
    slug: "fur-niture-rescue",
    icon: "🧹",
    title: "Fur-niture Rescue: Hair Removal Hacks",
    desc: "Living with a cat means fur on everything. Here are some claw-ver hacks for a hair-free home!",
    intro: "Shedding peaks during weather changes — in Singapore that means roughly always. These cheap hacks beat expensive gadgets most of the time.",
    sections: [
      { heading: "The rubber glove trick", body: "Put on a slightly damp rubber dish glove and sweep your hand over upholstery — static makes fur clump into pick-up-able balls. Works on sofas, car seats and cat trees. Cheaper and more effective than most lint rollers." },
      { heading: "Damp sponge for rugs & upholstery", body: "Lightly dampen a sponge and wipe in one direction. The fur balls up without soaking the fabric. Great for velvet and microfibre. Rinse the sponge often." },
      { heading: "Laundry tricks", body: "Toss a half-cup of white vinegar into the rinse cycle — it loosens fur from fabric. A 10-minute tumble on air-only (no heat) before washing helps too. Skip fabric softener; it makes fur stick harder." },
      { heading: "Cut it at the source", body: "Brush your cat 2–3 times a week (daily during heavy shed) — most of the fur lands in the brush, not on your bed. A robot vacuum on a daily schedule handles floors and the hair under the sofa you never see. Your cat's coat also improves with a better diet — dry skin sheds more." },
    ],
    tips: ["Rubber gloves work better than lint rollers", "Damp sponge for upholstery", "Robot vacuum = your new best fur-end"],
  },
  {
    slug: "singapore-heat-purr-tection",
    icon: "🌡️",
    title: "Singapore Heat Purr-tection",
    desc: "It's always summer in SG! Keep your cat cool and com-fur-table in our tropical climate.",
    intro: "Cats overheat faster than you'd think — they can't sweat and only pant when seriously stressed. Indoor cats in non-aircon flats need help staying cool, especially in the midday heat.",
    sections: [
      { heading: "Ideal temperature", body: "Keep aircon between 24–26°C if you use it. Cats are comfortable at slightly warmer temperatures than humans, so you don't need to freeze the flat. If you're out all day, a fan plus closed blinds on the sun-facing side does a lot." },
      { heading: "Watch for heat stress", body: "Warning signs: panting, drooling, restlessness, bright red gums, lethargy. If you see these, move your cat to a cool room, offer water, and dampen their paws with a cool (not cold) wet cloth. Persistent symptoms need a vet immediately." },
      { heading: "Cheap cooling hacks", body: "Freeze a water bottle, wrap it in a thin towel, and place it near their bed. Cooling mats (from Shopee or pet stores, ~$15–25) are self-activating and cats genuinely use them. Elevated mesh beds let air flow underneath. Bonus: cat-safe frozen broth cubes — freeze diluted, salt-free chicken broth in an ice tray." },
      { heading: "Hydration matters double", body: "Cats drink little even in perfect health, and heat makes dehydration dangerous. Multiple water bowls away from food, a pet fountain for fussy drinkers, and wet food all help. Refresh water twice a day in Singapore's climate." },
    ],
    tips: ["Keep aircon at 24-26°C", "Frozen treats: cat-safe ice cubes!", "Cooling mats from Shopee work great"],
  },
  {
    slug: "travelling-with-cats-in-sg",
    icon: "✈️",
    title: "Travelling with Cats in SG",
    desc: "From pet taxis to boarding, here's your guide to cat trans-purr-tation in the Lion City!",
    intro: "Whether it's a vet trip or a two-week holiday, moving a cat in Singapore takes planning. Here's how to do it without stress — for you or the cat.",
    sections: [
      { heading: "Pet taxis", body: "Regular taxis and Grab often reject pets, so book a dedicated pet taxi — SG Pet Taxi, Pawfect Rides and Meow Movers all serve the whole island. Book a day ahead for vet appointments; peak periods need more lead time. Confirm the driver allows carriers inside the cabin, not the boot." },
      { heading: "Boarding & fosters", body: "Good boarding fills up fast — book at least 2 weeks ahead, more during festive seasons. Visit before booking: look for individual rooms (not stacked cages), daily photo updates, and separate ventilation for cats vs dogs. Bring your cat's own food, blanket and litter to reduce stress." },
      { heading: "Flying out of Singapore", body: "Export requires an AVS licence (apply online, takes about a week), an ISO microchip, and a valid rabies vaccination. Every destination has different import rules — some need months of preparation. Use a pet relocation agent for the first trip; the paperwork is genuinely complex." },
      { heading: "Moving house locally", body: "Set up one quiet room with litter, food and hiding spots BEFORE the movers come. Keep the cat confined there until the old flat is empty, transport in a covered carrier, and give them another single room in the new home for a few days before full access. Feliway spray in both locations helps a lot." },
    ],
    tips: ["Book AVS-approved pet taxi services", "Get microchipped at any vet", "Boarding: book 2 weeks in advance!"],
  },
];

export const getGuide = (slug: string | undefined) =>
  guides.find((g) => g.slug === slug);
