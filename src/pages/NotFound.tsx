import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center px-4">
        <p className="text-7xl mb-4 animate-paw-bounce">🙀</p>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          This page has wandered off
        </h1>
        <p className="mb-2 text-lg text-muted-foreground max-w-md mx-auto">
          Somewhere out there, a cat knocked this page off the shelf. It'll turn up eventually — they always do.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          (Page not found: {location.pathname})
        </p>
        <Link to="/">
          <Button className="bg-gradient-hero text-primary-foreground shadow-soft font-display font-bold">
            🐾 Herd me back home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
