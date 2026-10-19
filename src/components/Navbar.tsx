import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Sun,
  Moon,
  Heart,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import catLogo from "@/assets/catscape-logo.png";

const primaryItems = [
  { path: "/adoptions", label: "Adopt" },
  { path: "/fundraising", label: "Paw-Fund" },
  { path: "/news", label: "News" },
  { path: "/guides", label: "Guides" },
];

const exploreItems = [
  { path: "/community-cats", label: "Whisker Watch" },
  { path: "/lost-found", label: "Lost & Found" },
  { path: "/dictionary", label: "Meow-tionary" },
  { path: "/cat-verter", label: "Cat-verter" },
  { path: "/services", label: "Vets & Services" },
  { path: "/store", label: "Store" },
];

const allItems = [...primaryItems, ...exploreItems];

const isActive = (pathname: string, current: string) =>
  current === pathname || (pathname !== "/" && current.startsWith(pathname));

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const current = useLocation().pathname;
  const active = isActive(to, current);
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" aria-hidden="true" />
      )}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={catLogo} alt="CatScape" className="w-9 h-9" />
            <span className="font-display text-xl font-bold text-foreground tracking-tight">CatScape</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none inline-flex items-center gap-1">
                Explore <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>More features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exploreItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`p-2 rounded-lg transition-colors inline-flex items-center ${
                    isActive("/profile", pathname)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                  aria-label="Profile"
                  title="Profile"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                aria-label="Sign in"
                title="Sign in"
              >
                <LogIn size={18} />
              </Link>
            )}
            <Link
              to="/fundraising"
              className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all"
            >
              <Heart size={15} /> Donate
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/60"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to="/fundraising"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
            >
              <Heart size={15} />
              <span className="hidden sm:inline">Donate</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/60"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-0.5">
              {allItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path, pathname)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors inline-flex items-center gap-2"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => { signOut(); closeMenu(); }}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors text-left inline-flex items-center gap-2"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg border border-border text-sm font-semibold text-foreground text-center inline-flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} /> Sign In / Join
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
