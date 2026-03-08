import { useState } from "react";
import { Heart } from "lucide-react";

const fundUpdates = [
  { date: "Mar 2026", raised: 2450, spent: 1800, description: "Fur-nded TNR for 12 community cats in Tampines & bought kibble for 30+ void deck kitties! 🐱" },
  { date: "Feb 2026", raised: 1890, spent: 1650, description: "Vet bills for 3 injured strays in Ang Mo Kio & cat flu medicine for the Bedok clowder! 💊" },
  { date: "Jan 2026", raised: 3200, spent: 2900, description: "New fur-eeding stations installed in Jurong East. Spaying for 8 community queens! 👑" },
];

const Fundraising = () => {
  const [donationAmount, setDonationAmount] = useState("");

  const totalRaised = fundUpdates.reduce((sum, u) => sum + u.raised, 0);
  const totalSpent = fundUpdates.reduce((sum, u) => sum + u.spent, 0);

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
          <div className="flex gap-2 mb-4 justify-center">
            {[5, 10, 25, 50].map((amt) => (
              <button
                key={amt}
                onClick={() => setDonationAmount(String(amt))}
                className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all ${
                  donationAmount === String(amt)
                    ? "bg-card text-foreground shadow-card"
                    : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Or enter a custom amount..."
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card text-foreground font-body placeholder:text-muted-foreground mb-4 border-0 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full py-3 rounded-xl bg-card text-foreground font-display font-bold shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5">
            🐾 Paw-ceed to Donate
          </button>
          <p className="text-primary-foreground/70 text-xs mt-3">Payment integration coming soon! 🚀</p>
        </div>
      </div>

      {/* Updates */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
          📋 Fur-nd Usage Updates
        </h2>
        <div className="space-y-4">
          {fundUpdates.map((update) => (
            <div key={update.date} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-foreground">{update.date}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-accent font-semibold">+${update.raised}</span>
                  <span className="text-cat-rose font-semibold">-${update.spent}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{update.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fundraising;
