import { useState } from "react";
import { Heart, Mail, Loader2, Target, HandCoins, Wallet } from "lucide-react";
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
        if ((error as { code?: string }).code === "23505") return;
        throw error;
      }
    },
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
    },
  });

  const stats = [
    { icon: HandCoins, value: `$${totalRaised.toLocaleString()}`, label: "Total raised" },
    { icon: Target, value: `$${totalGoal.toLocaleString()}`, label: "Combined goal" },
    { icon: Wallet, value: `$${(totalRaised - totalSpent).toLocaleString()}`, label: "Available funds" },
  ];

  return (
    <div>
      {/* Page hero */}
      <section className="relative bg-gradient-warm border-b border-border overflow-hidden">
        <div className="paw-pattern absolute inset-0" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <p className="eyebrow mb-3">CatScape Paw-Fund</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground max-w-2xl">
            Every purr-ny counts.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Donations go directly to community cat care, TNR programmes, and emergency
            vet bills — with every dollar accounted for below.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="p-6 rounded-2xl bg-card border border-border shadow-card text-center">
              <s.icon className="mx-auto mb-3 text-primary" size={24} />
              <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      {campaigns.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <p className="eyebrow mb-2">Where the money goes</p>
              <h2 className="font-display text-3xl font-bold text-foreground">Active campaigns</h2>
            </div>
            <div className="space-y-5">
              {campaigns.map((campaign) => {
                const progress = campaign.goal_amount > 0 ? (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100 : 0;
                const reached = progress >= 100;
                return (
                  <div key={campaign.id} className="p-6 md:p-7 rounded-2xl bg-card border border-border shadow-card">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-xl font-bold text-foreground">{campaign.title}</h3>
                      {reached && (
                        <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                          Goal reached
                        </span>
                      )}
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{campaign.description}</p>
                    )}
                    <div className="w-full bg-secondary rounded-full h-2.5 mb-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all ${reached ? "bg-accent" : "bg-gradient-hero"}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        ${Number(campaign.current_amount).toLocaleString()} raised
                      </span>
                      <span className="text-muted-foreground">
                        ${Number(campaign.goal_amount).toLocaleString()} goal
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Donate + newsletter */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden bg-gradient-hero rounded-2xl p-8 text-center shadow-hover">
            <Heart className="mx-auto mb-4 text-primary-foreground" size={36} />
            <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">Donate today</h2>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Online payments are coming soon. In the meantime, reach out and we'll
              help you contribute directly.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border shadow-card text-center">
            <Mail className="mx-auto mb-4 text-primary" size={32} />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Get paw-date updates</h2>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              New campaigns, care milestones and community cat news — straight to your inbox.
            </p>
            {subscribed ? (
              <p className="text-accent font-semibold text-sm">You're on the list! Watch your inbox.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); subscribeMutation.mutate(); }}
                className="flex flex-col gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.sg"
                  className="px-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-hover transition-all disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                >
                  {subscribeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Updates */}
      {updates.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <p className="eyebrow mb-2">Transparency</p>
              <h2 className="font-display text-3xl font-bold text-foreground">Fund usage updates</h2>
            </div>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg font-bold text-foreground">{update.title}</h3>
                    {update.amount_used != null && (
                      <span className="shrink-0 font-semibold text-sm text-destructive">
                        -${Number(update.amount_used).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {update.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{update.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {campaigns.length === 0 && updates.length === 0 && (
        <div className="container mx-auto px-4 pb-24 text-center">
          <p className="text-muted-foreground">No campaigns yet — check back soon.</p>
        </div>
      )}
    </div>
  );
};

export default Fundraising;
