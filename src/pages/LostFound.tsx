import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Search, Plus, AlertTriangle, Heart } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/hooks/useSEO";
import ShareButtons from "@/components/ShareButtons";

type ReportType = "lost" | "found";

const LostFound = () => {
  useSEO({
    title: "Lost & Found Cats in Singapore",
    description: "Lost your cat or spotted a missing one? Report and browse lost and found cats across Singapore to help reunite kitties with their families.",
    keywords: ["lost cat Singapore", "found cat Singapore", "missing cat Singapore", "reunite lost pets Singapore"],
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "CatScape Lost & Found", description: "Lost and found cat reports for Singapore." },
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | ReportType>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<ReportType>("lost");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["lost-found-cats", filter],
    queryFn: async () => {
      let query = supabase
        .from("lost_found_cats")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("type", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be signed in");
      let image_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `lost-found/${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("cat-photos").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("cat-photos").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
      const { error } = await supabase.from("lost_found_cats").insert({
        user_id: user.id,
        type: formType,
        name,
        description,
        location,
        contact_info: contactInfo,
        image_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lost-found-cats"] });
      toast({ title: formType === "lost" ? "🙀 Report Filed!" : "😺 Sighting Reported!", description: "Your report is now live." });
      resetForm();
    },
    onError: (err: any) => toast({ title: "Cat-astrophe! 😿", description: err.message, variant: "destructive" }),
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lost_found_cats").update({ status: "resolved" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lost-found-cats"] });
      toast({ title: "Purr-fect news! 🎉", description: "Report marked as resolved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setFormOpen(false);
    setName("");
    setDescription("");
    setLocation("");
    setContactInfo("");
    setImageFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-hero mb-3">
          🔍 Lost & Found
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Help reunite cats with their families! Report a missing cat or a furry friend you've spotted.
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex gap-2">
          {(["all", "lost", "found"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "secondary"}
              size="sm"
              className="rounded-xl font-semibold"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "🐾 All" : f === "lost" ? "🙀 Lost" : "😺 Found"}
            </Button>
          ))}
        </div>
        {user ? (
          <Dialog open={formOpen} onOpenChange={(o) => !o && resetForm()}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero text-primary-foreground shadow-soft font-display font-bold">
                <Plus size={18} className="mr-1" /> Report a Cat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {formType === "lost" ? "🙀 Report Lost Cat" : "😺 Report Found Cat"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex gap-2 mb-1">
                {(["lost", "found"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={formType === t ? "default" : "secondary"}
                    className="flex-1 rounded-xl text-sm font-semibold"
                    onClick={() => setFormType(t)}
                  >
                    {t === "lost" ? "🙀 Lost" : "😺 Found"}
                  </Button>
                ))}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); reportMutation.mutate(); }}
                className="grid gap-4"
              >
                <div className="grid gap-1.5">
                  <Label>Cat's Name *</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={formType === "lost" ? "What's your cat called?" : "Any name on the collar?"}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breed, colour, distinguishing features..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Location *</Label>
                  <Input
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where was the cat last seen?"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Contact Info *</Label>
                  <Input
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Phone number or email"
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
                  type="submit"
                  disabled={reportMutation.isPending}
                  className="bg-gradient-hero text-primary-foreground font-display font-bold"
                >
                  {reportMutation.isPending ? "Submitting..." : "🐾 Submit Report"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary font-semibold hover:underline">Sign in</Link> to file a report
          </p>
        )}
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-5 space-y-2">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-lg">No {filter === "all" ? "" : filter} reports yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report: any) => (
            <Card key={report.id} className="overflow-hidden hover:shadow-hover transition-all hover:-translate-y-1">
              {report.image_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img src={report.image_url} alt={report.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${
                    report.type === "lost"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {report.type === "lost" ? <><AlertTriangle size={12} className="mr-1" />LOST</> : <><Heart size={12} className="mr-1" />FOUND</>}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-1">{report.name}</h3>
                {report.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <MapPin size={14} /> {report.location}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Clock size={12} /> {format(new Date(report.created_at), "MMM d, yyyy")}
                </div>
                <p className="text-sm font-medium text-foreground">📞 {report.contact_info}</p>
                <ShareButtons title={`🐾 ${report.type === "lost" ? "Lost" : "Found"} cat: ${report.name}`} className="mt-2" />
                {user && report.user_id === user.id && report.status === "active" && (
                  <Button
                    variant="secondary"
                    className="mt-3 w-full rounded-xl text-sm font-bold bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => resolveMutation.mutate(report.id)}
                  >
                    ✅ Mark as Resolved
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFound;
