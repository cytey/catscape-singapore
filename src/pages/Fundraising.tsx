import { useState } from "react";
import { Heart, Mail, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

const Fundraising = () => {
  useSEO({
    title: "Paw-Fund – Donate to Singapore's Community Cats",
    description: "Donate to help Singapore's community cats and fur-babies in need. See live fundraising progress and transparent fund-usage updates for cat care, TNR, and vet bills.",
    keywords: ["donate cats Singapore", "community cat donation", "cat fundraising Singapore", "TNR funding", "cat welfare donation"],
    jsonLd: { "@context": "https://schema.org", "@type": "DonateAction", name: "CatScape Paw-Fund", recipient: { "@type": "NGO", name: "CatScape Singapore" } },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["fundraising-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fundraising_campaigns").select("*").eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: updates = [] } = useQuery({
    queryKey: ["fund-updates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fund_updates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goal_amount), 0);
  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.current_amount), 0);
  const totalSpent = updates.reduce((sum, u) => sum + Number(u.amount_used || 0), 0);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("paw_date_subscribers")
        .insert({ email: email.trim().toLowerCase() });
      if (error) {
        // Unique violation means already subscribed — treat as success
        if ((error as { code?: string }).code === "23505") return;
        throw error;
      }
    },
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">💰 Paw-Fund</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Every purr-ny counts! Help us care for Singapore's community cats and fur-babies in need.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
        <div className="p-6 rounded-2xl bg-card border-2 border-primary/20 shadow-card text-center">
          <p className="text-3xl font-display font-bold text-gradient-hero">${totalRaised.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Fur-nds Raised</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border-2 border-accent/20 shadow-card text-center">
          <p className="text-3xl font-display font-bold text-accent">${totalSpent.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Spent on Cat Care</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border-2 border-cat-gold/20 shadow-card text-center">
          <p className="text-3xl font-display font-bold text-cat-gold">${(totalRaised - totalSpent).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Available Fur-nds</p>
        </div>
      </div>

      {/* Donate */}
      <div className="max-w-md mx-auto mb-12">
        <div className="p-8 rounded-3xl bg-gradient-hero shadow-hover text-center">
          <Heart className="mx-auto mb-4 text-primary-foreground" size={40} />
          <h2 className="font-display text-2xl font-bold text-primary-foreground mb-4">Donate Meow!</h2>
          <p className="text-primary-foreground/70 text-sm">Payment integration coming soon! Contact us to donate directly. 🐾</p>
        </div>
      </div>

      {/* Email updates */}
      <div className="max-w-md mx-auto mb-12">
        <div className="p-8 rounded-3xl bg-card border-2 border-accent/25 shadow-card text-center">
          <Mail className="mx-auto mb-3 text-accent" size={32} />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Get Paw-date Updates 📬</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Be the first to know about new campaigns, cat care milestones and community cat news.
          </p>
          {subscribed ? (
            <p className="text-accent font-semibold text-sm">😸 You're on the list! Watch your inbox for paw-dates.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); subscribeMutation.mutate(); }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@catscape.sg"
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold text-sm shadow-soft hover:shadow-hover transition-all disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
              >
                {subscribeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">🎯 Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const progress = campaign.goal_amount > 0 ? (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100 : 0;
              const reached = progress >= 100;
              return (
                <div key={campaign.id} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-foreground">{campaign.title}</h3>
                    {reached && <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">🎉 Goal reached!</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                  <div className="w-full bg-secondary rounded-full h-3 mb-2 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${reached ? "bg-accent" : "bg-gradient-hero"}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">${Number(campaign.current_amount).toLocaleString()} raised</span>
                    <span className="font-semibold text-foreground">${Number(campaign.goal_amount).toLocaleString()} goal</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Updates */}
      {updates.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">📋 Fur-nd Usage Updates</h2>
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-foreground">{update.title}</span>
                  {update.amount_used && <span className="text-cat-rose font-semibold text-sm">-${Number(update.amount_used).toLocaleString()}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{update.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {campaigns.length === 0 && updates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No campaigns yet. Add them via the Cloud database! 🐾</p>
        </div>
      )}
    </div>
  );
};

export default Fundraising;
