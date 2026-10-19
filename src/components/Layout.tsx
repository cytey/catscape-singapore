import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "./Navbar";

const exploreLinks = [
  { path: "/adoptions", label: "Adopt a Cat" },
  { path: "/community-cats", label: "Whisker Watch" },
  { path: "/lost-found", label: "Lost & Found" },
  { path: "/guides", label: "Care Guides" },
  { path: "/dictionary", label: "Meow-tionary" },
  { path: "/cat-verter", label: "Cat-verter" },
];

const siteLinks = [
  { path: "/news", label: "News" },
  { path: "/services", label: "Vets & Services" },
  { path: "/store", label: "Store" },
  { path: "/fundraising", label: "Paw-Fund" },
  { path: "/auth", label: "Join / Sign In" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <Link to="/" className="inline-block font-display text-2xl font-bold text-foreground">
                CatScape
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xs">
                Singapore's community cat superapp. Fund the care, find the homes,
                keep every whisker accounted for.
              </p>
            </div>
            <div>
              <p className="eyebrow mb-4">Adopt & Care</p>
              <ul className="space-y-2.5">
                {exploreLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Explore</p>
              <ul className="space-y-2.5">
                {siteLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Support the Cause</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Every donation goes directly to community cat care, TNR, and vet bills.
              </p>
              <Link
                to="/fundraising"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all"
              >
                <Heart size={15} /> Donate
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© 2026 CatScape. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made for Singapore's community cats.</p>
          </div>
          <p className="mt-4 text-center text-2xl opacity-20 select-none" aria-hidden="true">🐾</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
