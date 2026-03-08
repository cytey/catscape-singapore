import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Search, Plus, X, AlertTriangle, Heart } from "lucide-react";
import { format } from "date-fns";

type ReportType = "lost" | "found";

const LostFound = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | ReportType>("all");
  const [showForm, setShowForm] = useState(false);
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
  });

  const resetForm = () => {
    setShowForm(false);
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
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f === "all" ? "🐾 All" : f === "lost" ? "🙀 Lost" : "😺 Found"}
            </button>
          ))}
        </div>
        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <Plus size={18} /> Report a Cat
          </button>
        )}
        {!user && (
          <p className="text-sm text-muted-foreground">
            <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a> to file a report
          </p>
        )}
      </div>

      {/* Report Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border-2 border-border shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {formType === "lost" ? "🙀 Report Lost Cat" : "😺 Report Found Cat"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><X size={20} /></button>
            </div>

            <div className="flex gap-2 mb-5">
              {(["lost", "found"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFormType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    formType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {t === "lost" ? "🙀 Lost" : "😺 Found"}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); reportMutation.mutate(); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Cat's Name</label>
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={formType === "lost" ? "What's your cat called?" : "Any name on the collar?"}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breed, colour, distinguishing features..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Location</label>
                <input
                  required value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was the cat last seen?"
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Contact Info</label>
                <input
                  required value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Phone number or email"
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Photo</label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold file:cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={reportMutation.isPending}
                className="w-full py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {reportMutation.isPending ? "Submitting..." : "🐾 Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reports Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-lg">No {filter === "all" ? "" : filter} reports yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="rounded-3xl bg-card border-2 border-border shadow-card overflow-hidden hover:shadow-hover transition-all hover:-translate-y-1">
              {report.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={report.image_url} alt={report.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    report.type === "lost"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {report.type === "lost" ? <><AlertTriangle size={12} className="inline mr-1" />LOST</> : <><Heart size={12} className="inline mr-1" />FOUND</>}
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
                {user && report.user_id === user.id && report.status === "active" && (
                  <button
                    onClick={() => resolveMutation.mutate(report.id)}
                    className="mt-3 w-full py-2 rounded-xl bg-accent text-accent-foreground text-sm font-bold hover:bg-accent/90 transition-all"
                  >
                    ✅ Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFound;
