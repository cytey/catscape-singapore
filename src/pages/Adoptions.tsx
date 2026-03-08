import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Heart, MapPin, Plus, Trash2, Upload, Search, X, Star } from "lucide-react";
import AdoptionDetailDialog from "@/components/AdoptionDetailDialog";
import { useFavorites } from "@/hooks/useFavorites";

interface AdoptionListing {
  id: string;
  user_id: string;
  name: string;
  breed: string | null;
  age: string | null;
  gender: string | null;
  description: string | null;
  image_url: string | null;
  location: string;
  contact_info: string;
  status: string;
  created_at: string;
  poster_name: string | null;
  poster_avatar: string | null;
}

const Adoptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [detailCat, setDetailCat] = useState<AdoptionListing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterBreed, setFilterBreed] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "unknown",
    description: "",
    image_url: "",
    location: "",
    contact_info: "",
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["adoption-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adoption_listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [] as AdoptionListing[];
      
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);
      
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return data.map((r) => ({
        ...r,
        poster_name: profileMap.get(r.user_id)?.display_name ?? null,
        poster_avatar: profileMap.get(r.user_id)?.avatar_url ?? null,
      })) as AdoptionListing[];
    },
  });

  const uniqueBreeds = useMemo(() => [...new Set(listings.map((c) => c.breed).filter(Boolean))].sort(), [listings]);
  const uniqueLocations = useMemo(() => [...new Set(listings.map((c) => c.location).filter(Boolean))].sort(), [listings]);

  const filtered = useMemo(() => {
    return listings.filter((cat) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.breed?.toLowerCase().includes(q) ||
        cat.location.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q);
      const matchesGender = filterGender === "all" || cat.gender === filterGender;
      const matchesBreed = filterBreed === "all" || cat.breed === filterBreed;
      const matchesLocation = filterLocation === "all" || cat.location === filterLocation;
      const matchesFavorites = !showFavoritesOnly || favoriteIds.includes(cat.id);
      return matchesSearch && matchesGender && matchesBreed && matchesLocation && matchesFavorites;
    });
  }, [listings, searchQuery, filterGender, filterBreed, filterLocation, showFavoritesOnly, favoriteIds]);

  const hasActiveFilters = searchQuery || filterGender !== "all" || filterBreed !== "all" || filterLocation !== "all" || showFavoritesOnly;

  const clearFilters = () => {
    setSearchQuery("");
    setFilterGender("all");
    setFilterBreed("all");
    setFilterLocation("all");
    setShowFavoritesOnly(false);
  };

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be signed in");
      const { error } = await supabase.from("adoption_listings").insert({
        user_id: user.id,
        name: form.name,
        breed: form.breed || null,
        age: form.age || null,
        gender: form.gender,
        description: form.description || null,
        image_url: form.image_url || null,
        location: form.location,
        contact_info: form.contact_info,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoption-listings"] });
      setOpen(false);
      setForm({ name: "", breed: "", age: "", gender: "unknown", description: "", image_url: "", location: "", contact_info: "" });
      toast({ title: "🐱 Listing posted!", description: "Your fur-baby is now visible to adopters." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("adoption_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoption-listings"] });
      toast({ title: "Listing removed" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `adoptions/${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("cat-photos").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("cat-photos").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const genderLabel = (g: string | null) => {
    if (g === "male") return "♂ Boy";
    if (g === "female") return "♀ Girl";
    return "Unknown";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Heart className="text-primary" /> Fur-ever Homes
          </h1>
          <p className="text-muted-foreground mt-1">Find your purr-fect companion or help a cat find a loving home.</p>
        </div>
        {user && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero text-primary-foreground shadow-soft">
                <Plus size={18} className="mr-1" /> Post a Cat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>🐾 Post a Cat for Adoption</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 mt-2">
                <div>
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Whiskers" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Breed</Label>
                    <Input value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} placeholder="Tabby" />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} placeholder="2 years" />
                  </div>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">♂ Male</SelectItem>
                      <SelectItem value="female">♀ Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Friendly, loves belly rubs…" rows={3} />
                </div>
                <div>
                  <Label>Photo</Label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-secondary transition-colors">
                      <Upload size={16} /> {uploading ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {form.image_url && <img src={form.image_url} alt="preview" className="h-12 w-12 rounded-md object-cover" />}
                  </div>
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="City, State" />
                </div>
                <div>
                  <Label>Contact Info *</Label>
                  <Input value={form.contact_info} onChange={(e) => setForm((f) => ({ ...f, contact_info: e.target.value }))} placeholder="email or phone" />
                </div>
                <Button
                  onClick={() => addMutation.mutate()}
                  disabled={!form.name || !form.location || !form.contact_info || addMutation.isPending}
                  className="bg-gradient-hero text-primary-foreground"
                >
                  {addMutation.isPending ? "Posting…" : "🐾 Post Listing"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, breed, location…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">♂ Male</SelectItem>
              <SelectItem value="female">♀ Female</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBreed} onValueChange={setFilterBreed}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Breed" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Breeds</SelectItem>
              {uniqueBreeds.map((b) => (
                <SelectItem key={b} value={b!}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((l) => (
                <SelectItem key={l} value={l!}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {user && (
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly((v) => !v)}
              className={showFavoritesOnly ? "bg-primary text-primary-foreground" : ""}
            >
              <Star size={14} className={`mr-1 ${showFavoritesOnly ? "fill-current" : ""}`} />
              Favorites{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ""}
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X size={14} className="mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {!user && (
        <p className="text-center text-muted-foreground mb-6">
          <a href="/auth" className="text-primary underline">Sign in</a> to post a cat for adoption.
        </p>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🐱</p>
          <p className="text-muted-foreground">
            {hasActiveFilters ? "No cats match your filters. Try adjusting your search." : "No cats up for adoption yet. Be the first to post!"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>Clear filters</Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(filtered.indexOf(cat) * 0.08, 0.4) }}
            >
            <Card className="overflow-hidden hover:shadow-hover transition-shadow group cursor-pointer h-full" onClick={() => setDetailCat(cat)}>
              <div className="relative h-52 bg-muted">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🐱</div>
                )}
                <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">{genderLabel(cat.gender)}</Badge>
                {user && (
                  <button
                    className={`absolute top-2 left-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${isFavorite(cat.id) ? "text-primary" : "text-muted-foreground"}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite.mutate(cat.id); }}
                    aria-label={isFavorite(cat.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={16} className={isFavorite(cat.id) ? "fill-current" : ""} />
                  </button>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {cat.breed && <span>{cat.breed}</span>}
                  {cat.age && <span>• {cat.age}</span>}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {cat.description && <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>}
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {cat.location}
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={cat.poster_avatar ?? undefined} />
                    <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                      {(cat.poster_name ?? "?")[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">{cat.poster_name ?? "Anonymous"}</span>
                </div>
              </CardContent>
              {user?.id === cat.user_id && (
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(cat.id); }}
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </Button>
                </CardFooter>
              )}
            </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AdoptionDetailDialog listing={detailCat} open={!!detailCat} onOpenChange={(o) => !o && setDetailCat(null)} />
    </div>
  );
};

export default Adoptions;
