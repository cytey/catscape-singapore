import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import catLogo from "@/assets/catscape-logo.png";

const navItems = [
  { path: "/", label: "🏠 Home" },
  { path: "/fundraising", label: "💰 Paw-Fund" },
  { path: "/store", label: "🛍️ Cat-alogue" },
  { path: "/community-cats", label: "🐱 Whisker Watch" },
  { path: "/dictionary", label: "📖 Meow-tionary" },
  { path: "/news", label: "📰 Cat-ch Up" },
  { path: "/guides", label: "📚 Purr-fect Tips" },
  { path: "/services", label: "🏥 Cat Care Hub" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={catLogo} alt="CatScape" className="w-8 h-8 animate-paw-bounce" />
            <span className="font-display text-xl font-bold text-gradient-hero">CatScape</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => signOut()}
                className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all inline-flex items-center gap-1"
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold shadow-soft hover:shadow-hover transition-all inline-flex items-center gap-1"
              >
                <LogIn size={16} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary text-left inline-flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold text-center">
                  🐾 Sign In / Join
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
