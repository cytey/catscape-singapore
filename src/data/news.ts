export interface NewsItem {
  slug: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  body: string[];
}

export const newsItems: NewsItem[] = [
  {
    slug: "cat-fest-2026-bishan-park",
    date: "Mar 7, 2026",
    title: "🎉 Cat-Fest 2026 at Bishan Park!",
    desc: "Singapore's biggest cat-lebration is back! Join us for a day of fur-n with adoption drives, cat yoga, and the Annual Chonk Purr-ade!",
    tag: "Event",
    body: [
      "Cat-Fest returns to Bishan-Ang Mo Kio Park bigger than ever, with over 40 vendor booths, 6 rescue groups, and — new this year — a cat-first-aid workshop run by Mount Pleasant's vets.",
      "The adoption drive runs from 10am to 5pm at the Fuchsia Garden. All participating rescues complete basic health checks and screening before the event, so you can meet adoptable cats on the day and start the paperwork on the spot. Bring a photo ID if you're serious about adopting.",
      "Highlights this year include cat yoga at 8am (bring your own mat, cats provided), the Annual Chonk Purr-ade at noon — yes, there are prizes for most impressive floof — and a scarecrow-building contest for window-mesh awareness.",
      "Entry is free. No personal pets allowed (it's stressful for them and safety rules require it), but there will be plenty of adoptable and café cats to meet. Nearest car park is Bishan Park Carpark 1; the park connector from Marymount MRT is a 12-minute walk.",
    ],
  },
  {
    slug: "hdb-cat-friendly-policy-update",
    date: "Mar 5, 2026",
    title: "📋 New HDB Cat-Friendly Purr-licy Update",
    desc: "Great mews! HDB has expanded the list of approved cat breeds. More fur-babies can now live in flats o-fur-cially!",
    tag: "News",
    body: [
      "Following the successful 2024 pilot, HDB and AVS have confirmed that all cat breeds may now be kept in HDB flats, subject to responsible ownership conditions — bringing HDB rules in line with private housing.",
      "Key requirements stay the same: one microchip, sterilisation, and registration through the AVS PetCat portal. Existing owners had until end-2024 to register their cats; new adoptions after the policy change just need the standard registration within 30 days.",
      "Households remain limited to two cats (or one dog from the approved breeds list, not both). Trapped community cats remain under Cat Welfare Society protocols and don't count toward your household limit.",
      "What this means practically: adoption is now officially supported for all flats, insurers have started adding pet liability riders for HDB homes, and town councils have published unified mesh-grille guidelines. If your neighbours have concerns, the AVS community mediation process is the first stop — not the town council hotline.",
    ],
  },
  {
    slug: "free-tnr-clinic-tampines",
    date: "Mar 2, 2026",
    title: "🏥 Free TNR Clinic at Tampines Hub",
    desc: "The Cat Welfare Society is offering free Trap-Neuter-Return services this weekend. Help control the community cat paw-pulation humanely!",
    tag: "Event",
    body: [
      "Cat Welfare Society volunteers will run a free Trap-Neuter-Return (TNR) clinic at Tampines Hub this Saturday and Sunday, with same-day recovery holding before cats are returned to their home grounds.",
      "TNR is the humane, proven way to manage community cat populations: cats are trapped humanely, sterilised by vets, ear-tipped (a universal 'already done' marker), and returned. Sterilised colonies stabilise, stop yowling and spraying, and don't produce new litters.",
      "If you feed or see community cats in Tampines, Pasir Ris or Bedok, you can register a trapping slot at the CWS booth or through their online form. Beginners are welcome — an experienced volunteer will pair with you. Cages, transport and post-op care are all provided.",
      "CWS is also recruiting town-council-approved feeders for the east district. Responsible feeding (fixed spots, timed feeding, clean-up) is what keeps colonies healthy and complaints down.",
    ],
  },
  {
    slug: "whiskers-void-deck-cat-viral",
    date: "Feb 28, 2026",
    title: "😻 Whiskers the Void Deck Cat Goes Viral!",
    desc: "A Toa Payoh community cat named Whiskers has gone viral for his daily routine of greeting residents. He's now a local cele-purr-ty!",
    tag: "Viral",
    body: [
      "Whiskers, a ginger tabby who has patrolled Block 93 Toa Payoh for an estimated eight years, went viral after a resident's video of him escorting schoolchildren to the bus stop hit two million views in a week.",
      "The block's residents have informally adopted him for years — a rota of four feeders keeps his meals on schedule, and the neighbourhood vet provides subsidised care. His ear-tip confirms he was sterilised years ago through a CWS programme.",
      "Following the viral moment, the Toa Payoh town council confirmed Whiskers is a registered community cat and has asked visitors to admire from a distance, not feed him from hand or car park — fixed-spot feeding keeps both the cats and the corridors clean.",
      "Whiskers remains available for a very slow blink at around 7am and 6pm daily, near the lift lobby. Bring your own chin scratches.",
    ],
  },
  {
    slug: "neko-no-niwa-10-years",
    date: "Feb 25, 2026",
    title: "🐾 Cat Café Neko no Niwa Cele-purr-ates 10 Years",
    desc: "Singapore's beloved cat café marks a fur-midable milestone! Special purr-motions all week.",
    tag: "News",
    body: [
      "Neko no Niwa, Singapore's first cat café, turns ten this week. The Boat Quay mainstay opened in 2013 when cat cafés were still a novelty here, and has since homed over 40 resident cats — most adopted from local rescues.",
      "To mark the anniversary, entry bundles include a limited-edition tenth-anniversary postcard set, and all weekend sessions come with a free house-made cat-shaped cookie (human-grade, they insist). Bookings are open online; weekend slots usually go by Thursday.",
      "House rules stay the same: no waking a sleeping cat, no flash photography, and no feeding — the residents are on a vet-managed diet. All ten resident cats, including veterans Mochi and Tofu, remain available for their customary supervise-from-the-cat-tree treatment.",
      "A portion of this week's entry fees goes to Cat Welfare Society's sterilisation fund — $5 per visit across the anniversary week.",
    ],
  },
  {
    slug: "monsoon-community-cat-shelters",
    date: "Feb 20, 2026",
    title: "🌧️ Monsoon Season: Keep Community Cats Safe!",
    desc: "Tips from local feeders on how to create rain shelters for void deck kitties during the wet season.",
    tag: "Advisory",
    body: [
      "Monsoon season is here, and community cats need dry ground more than extra food. Experienced feeders across the island shared their low-cost shelter setups.",
      "The classic: a styrofoam box lined with a folded old towel, lid on, entry hole cut 15cm from the bottom edge (keeps rain from wicking in), placed on two bricks. Total cost: under $10. Elevating is the key step most people skip — ground contact soaks the bedding within a day.",
      "Placement matters more than construction. Shelters go under covered walkways, behind pillar columns, or beside riser walls — spots cats already use. Avoid drain-adjacent spots even if they look covered; flash floods reach further than you'd expect.",
      "Feeders also remind: switch to feeding on raised surfaces during the wet months, remove wet food after 30 minutes, and check your regular colony's shelters after every storm. A soaked towel at 11pm is worse than no shelter at all.",
    ],
  },
];

export const getNewsItem = (slug: string | undefined) =>
  newsItems.find((n) => n.slug === slug);
