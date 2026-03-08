import { useState } from "react";
import { MapPin, Clock, Plus, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
  fed: "bg-accent/10 text-accent border-accent/20",
  hungry: "bg-cat-gold/10 text-cat-gold border-cat-gold/20",
  "needs-help": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels = {
  fed: "😸 Fed & Happy",
  hungry: "😿 Hungry",
  "needs-help": "🆘 Needs Help!",
};

const CommunityCats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", location: "", status: "hungry", notes: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: cats = [], isLoading } = useQuery({
    queryKey: ["community-cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("community_cats").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addCatMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      let image_url = null;

      if (imageFile) {
        const filePath = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from("cat-photos").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("cat-photos").getPublicUrl(filePath);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("community_cats").insert({
        user_id: user.id,
        name: newCat.name,
        location: newCat.location,
        status: newCat.status,
        notes: newCat.notes,
        image_url,
        last_fed: newCat.status === "fed" ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-cats"] });
      setShowForm(false);
      setNewCat({ name: "", location: "", status: "hungry", notes: "" });
      setImageFile(null);
      toast({ title: "Meow-velous! 😸", description: "Cat added to Whisker Watch!" });
    },
    onError: (err: any) => toast({ title: "Cat-astrophe! 😿", description: err.message, variant: "destructive" }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("community_cats").update({
        status,
        last_fed: status === "fed" ? new Date().toISOString() : undefined,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community-cats"] }),
  });

  const filtered = filter ? cats.filter((c) => c.status === filter) : cats;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🐱 Whisker Watch</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Track and care for Singapore's community cats! Update fur-eeding status and keep every whisker accounted for.
        </p>
      </div>

      {/* Add Cat Button */}
      {user && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <Plus size={20} /> Add a Community Cat 🐾
          </button>
        </div>
      )}

      {/* Add Cat Form */}
      {showForm && (
        <div className="max-w-md mx-auto mb-10 p-6 rounded-2xl bg-card border-2 border-border shadow-card animate-fade-in-up">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Register a New Fur-riend!</h3>
          <div className="space-y-3">
            <input
              placeholder="Cat's name..."
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground"
            />
            <input
              placeholder="Location (e.g. Tampines Blk 201)"
              value={newCat.location}
              onChange={(e) => setNewCat({ ...newCat, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground"
            />
            <select
              value={newCat.status}
              onChange={(e) => setNewCat({ ...newCat, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground"
            >
              <option value="fed">😸 Fed & Happy</option>
              <option value="hungry">😿 Hungry</option>
              <option value="needs-help">🆘 Needs Help</option>
            </select>
            <textarea
              placeholder="Notes about this fur-ball..."
              value={newCat.notes}
              onChange={(e) => setNewCat({ ...newCat, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors">
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Upload a photo of the cat..."}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
            <button
              onClick={() => addCatMutation.mutate()}
              disabled={!newCat.name || !newCat.location || addCatMutation.isPending}
              className="w-full py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all disabled:opacity-50"
            >
              {addCatMutation.isPending ? "Adding..." : "🐾 Register Cat"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setFilter(null)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!filter ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
          All Cats 🐾
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === key ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Cat Cards */}
      {isLoading ? (
        <div className="text-center py-12"><p className="text-4xl animate-paw-bounce">🐱</p><p className="text-muted-foreground mt-2">Loading fur-riends...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><p className="text-4xl">😿</p><p className="text-muted-foreground mt-2">No cats found! Be the first to add one!</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((cat) => (
            <div key={cat.id} className="p-6 rounded-2xl bg-card border-2 border-border shadow-card hover:shadow-hover transition-all">
              {cat.image_url && (
                <img src={cat.image_url} alt={cat.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />{cat.location}
                  </div>
                </div>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${statusColors[cat.status as keyof typeof statusColors] || ""}`}>
                {statusLabels[cat.status as keyof typeof statusLabels] || cat.status}
              </div>
              {cat.last_fed && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Clock size={12} />Last fed: {formatDistanceToNow(new Date(cat.last_fed), { addSuffix: true })}
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-3">{cat.notes}</p>
              {user && cat.user_id === user.id && (
                <div className="flex gap-2">
                  {cat.status !== "fed" && (
                    <button onClick={() => updateStatusMutation.mutate({ id: cat.id, status: "fed" })} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors">
                      Mark as Fed 😸
                    </button>
                  )}
                  {cat.status !== "needs-help" && (
                    <button onClick={() => updateStatusMutation.mutate({ id: cat.id, status: "needs-help" })} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                      Needs Help 🆘
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!user && (
        <div className="text-center mt-12 p-6 rounded-2xl bg-secondary max-w-md mx-auto">
          <p className="text-muted-foreground text-sm">
            🐾 <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a> to add and manage community cats!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityCats;
