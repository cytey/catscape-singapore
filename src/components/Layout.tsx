import { ReactNode } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-warm paw-pattern">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-display text-lg font-bold text-gradient-hero">CatScape 🐾</p>
            <p className="text-sm text-muted-foreground">
              Made with 😻 for Singapore's fur-babies. © 2026 CatScape. All paws reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
