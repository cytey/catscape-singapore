import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center px-4">
        <p className="text-7xl mb-6" aria-hidden="true">🙀</p>
        <p className="eyebrow mb-3">404 — Page not found</p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          This page has wandered off
        </h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto leading-relaxed">
          Somewhere out there, a cat knocked this page off the shelf. It'll turn up
          eventually — they always do.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft size={18} /> Herd me back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
