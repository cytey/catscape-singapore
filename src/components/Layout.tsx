import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const footerLinks = [
  { path: "/adoptions", label: "Adopt" },
  { path: "/fundraising", label: "Fundraise" },
  { path: "/community-cats", label: "Community Cats" },
  { path: "/lost-found", label: "Lost & Found" },
  { path: "/guides", label: "Care Guides" },
  { path: "/auth", label: "Join the Clowder" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-warm paw-pattern flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3 items-center">
            <div>
              <p className="font-display text-lg font-bold text-gradient-hero">CatScape 🐾</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Singapore's community cat superapp. Feed a whisker, find a fur-ever friend, or lend a paw.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-center">
              {footerLinks.map((l) => (
                <Link key={l.path} to={l.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground md:text-right">
              Made with 😻 for Singapore's fur-babies. © 2026 CatScape.
              <span className="block mt-1">All paws reserved. 🐈</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
