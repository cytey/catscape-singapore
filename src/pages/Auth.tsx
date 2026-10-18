import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
import { useSEO } from "@/hooks/useSEO";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  useSEO({
    title: isSignUp ? "Join the Clowder – Create Account" : "Sign In to CatScape",
    description: "Sign in to CatScape, Singapore's cat superapp — post adoptions, track community cats, save favourites and get paw-date updates.",
    keywords: ["CatScape account", "join cat community Singapore"],
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: "Cat-astrophe! 😿", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Purr-fect! 😸", description: "Check your email to confirm your account!" });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Cat-astrophe! 😿", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back! 🐱", description: "You're now logged in!" });
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">
            {isSignUp ? "🐾 Join the Clowder" : "🐱 Welcome Back!"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your CatScape account and join the cat-munity!" : "Sign in to your fur-ever account!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-card border-2 border-border shadow-card space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your cat-tastic name..."
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="whiskers@catscape.sg"
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Paw-ssword</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Loading..." : isSignUp ? "🐾 Create Account" : "🐱 Sign In"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <button
            type="button"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) {
                toast({ title: "Cat-astrophe! 😿", description: String(error), variant: "destructive" });
              }
            }}
            className="w-full py-3 rounded-xl border-2 border-border bg-background text-foreground font-display font-bold hover:bg-secondary transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
              {isSignUp ? "Sign In" : "Join the Clowder!"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
