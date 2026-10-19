import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Plus, Upload, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { useSEO } from "@/hooks/useSEO";

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
  useSEO({
    title: "Whisker Watch – Track Community Cats in Singapore",
    description: "Register community cats, update their feeding status, and help care for Singapore's void deck kitties. Track every whisker in your neighbourhood.",
    keywords: ["community cats Singapore", "feed stray cats Singapore", "void deck cats", "cat feeding status", "TNR Singapore", "stray cat tracker"],
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "CatScape Whisker Watch", description: "Community cat tracker for Singapore neighbourhoods." },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-cats"] });
      toast({ title: "Paw-job well done! 🐾", description: "Status updated." });
    },
    onError: (err: any) => toast({ title: "Cat-astrophe! 😿", description: err.message, variant: "destructive" }),
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
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} className="mr-1" /> Add a Community Cat 🐾
          </Button>
        </div>
      )}

      {/* Add Cat Form */}
      {showForm && (
        <Card className="max-w-md mx-auto mb-10 shadow-card animate-fade-in-up">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Register a New Fur-riend!</h3>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label>Cat's name *</Label>
                <Input
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="Cat's name..."
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Location *</Label>
                <Input
                  value={newCat.location}
                  onChange={(e) => setNewCat({ ...newCat, location: e.target.value })}
                  placeholder="Location (e.g. Tampines Blk 201)"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select value={newCat.status} onValueChange={(v) => setNewCat({ ...newCat, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fed">😸 Fed & Happy</SelectItem>
                    <SelectItem value="hungry">😿 Hungry</SelectItem>
                    <SelectItem value="needs-help">🆘 Needs Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Notes</Label>
                <Textarea
                  value={newCat.notes}
                  onChange={(e) => setNewCat({ ...newCat, notes: e.target.value })}
                  placeholder="Notes about this fur-ball..."
                  rows={3}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-muted-foreground file:mr-3 file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold"
                />
              </div>
              <Button
                onClick={() => addCatMutation.mutate()}
                disabled={!newCat.name || !newCat.location || addCatMutation.isPending}
                className="w-full bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover"
              >
                {addCatMutation.isPending ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : "🐾 Register Cat"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={filter === null ? "default" : "secondary"}
          size="sm"
          className="rounded-full font-semibold"
          onClick={() => setFilter(null)}
        >
          All Cats 🐾
        </Button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "secondary"}
            size="sm"
            className="rounded-full font-semibold"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Cat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <CardContent className="p-5 space-y-2">
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3 animate-paw-bounce">😿</p>
          <p className="text-muted-foreground font-display text-lg">No cats found! Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((cat) => (
            <Card key={cat.id} className="overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all">
              {cat.image_url && (
                <img src={cat.image_url} alt={cat.name} className="w-full h-40 object-cover" />
              )}
              <CardContent className="p-5">
                <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin size={12} />{cat.location}
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
                  <div className="flex flex-wrap gap-2">
                    {cat.status !== "fed" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs font-semibold bg-accent/10 text-accent hover:bg-accent/20"
                        onClick={() => updateStatusMutation.mutate({ id: cat.id, status: "fed" })}
                      >
                        Mark as Fed 😸
                      </Button>
                    )}
                    {cat.status !== "needs-help" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20"
                        onClick={() => updateStatusMutation.mutate({ id: cat.id, status: "needs-help" })}
                      >
                        Needs Help 🆘
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!user && (
        <div className="text-center mt-12 p-6 rounded-2xl bg-secondary max-w-md mx-auto">
          <p className="text-muted-foreground text-sm">
            🐾 <Link to="/auth" className="text-primary font-semibold hover:underline">Sign in</Link> to add and manage community cats!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityCats;
