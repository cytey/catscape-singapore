import { ReactNode } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color?: "primary" | "accent" | "rose" | "gold" | "teal";
  children?: ReactNode;
}

const colorMap = {
  primary: "bg-primary/10 border-primary/20",
  accent: "bg-accent/10 border-accent/20",
  rose: "bg-cat-rose/10 border-cat-rose/20",
  gold: "bg-cat-gold/10 border-cat-gold/20",
  teal: "bg-cat-teal/10 border-cat-teal/20",
};

const FeatureCard = ({ icon, title, description, color = "primary", children }: FeatureCardProps) => {
  return (
    <div className={`group p-6 rounded-2xl border-2 ${colorMap[color]} bg-card shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display text-lg font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      {children}
    </div>
  );
};

export default FeatureCard;
