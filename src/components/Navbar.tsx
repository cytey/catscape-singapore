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
  { path: "/fundraising", label: "Fundraising" },
  { path: "/adoptions", label: "Adopt" },
  { path: "/news", label: "News" },
  { path: "/guides", label: "Guides" },
];

const exploreItems = [
  { path: "/store", label: "Store" },
  { path: "/community-cats", label: "Community Cats" },
  { path: "/lost-found", label: "Lost & Found" },
  { path: "/dictionary", label: "Dictionary" },
  { path: "/cat-verter", label: "Cat-verter" },
  { path: "/services", label: "Vet & Services" },
];

const allItems = [...primaryItems, ...exploreItems];

const isActive = (pathname: string, current: string) =>
  current === pathname || (pathname !== "/" && current.startsWith(pathname));

const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => {
  const current = useLocation().pathname;
  const active = isActive(to, current);
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "text-foreground bg-secondary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={catLogo} alt="CatScape" className="w-8 h-8" />
            <span className="font-display text-xl font-bold text-foreground">CatScape</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primaryItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus:outline-none">
                <span className="inline-flex items-center gap-1">
                  Explore <ChevronDown size={14} />
                </span>
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

            <div className="ml-3 flex items-center gap-1">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`p-2 rounded-lg transition-colors inline-flex items-center ${
                      isActive("/profile", location.pathname)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                    aria-label="Profile"
                    title="Profile"
                  >
                    <User size={18} />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors inline-flex items-center gap-1.5"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                >
                  <LogIn size={16} /> Sign In
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
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
            <div className="flex flex-col gap-1">
              {allItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path, location.pathname)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
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
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors text-left inline-flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
                >
                  Sign In / Join
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
