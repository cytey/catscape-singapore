import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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
