import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, Loader2, ClipboardList } from "lucide-react";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [myListings, setMyListings] = useState<{ id: string; name: string; status: string }[]>([]);
  const [myReports, setMyReports] = useState<{ id: string; name: string; type: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    };
    fetchProfile();

    const fetchMyPosts = async () => {
      const [listingsRes, reportsRes] = await Promise.all([
        supabase.from("adoption_listings").select("id, name, status").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("lost_found_cats").select("id, name, type").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (listingsRes.data) setMyListings(listingsRes.data);
      if (reportsRes.data) setMyReports(reportsRes.data);
    };
    fetchMyPosts();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cat-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("cat-photos").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    setUploading(false);
    toast({ title: "Avatar uploaded! 📸" });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, avatar_url: avatarUrl })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated! 🐾", description: "Looking paw-some!" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-4xl animate-paw-bounce">🐱</p>
        <p className="text-muted-foreground mt-2">Loading your purr-ofile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="font-display text-3xl font-bold text-gradient-hero text-center mb-8">
        🐾 My Purr-ofile
      </h1>

      <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-card space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-4xl border-4 border-primary/30">
                🐱
              </div>
            )}
            <label className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-primary-foreground" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Click to change avatar</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-display font-semibold text-foreground mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Sir Whiskers McFluff"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-display font-semibold text-foreground mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your fur-miliy... 🐈"
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-display font-semibold text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-hero text-primary-foreground font-display font-bold shadow-soft hover:shadow-hover transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes 🐾"}
        </button>
      </div>

      {/* My Posts */}
      <div className="mt-8 bg-card border-2 border-border rounded-2xl p-6 shadow-card">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 inline-flex items-center gap-2">
          <ClipboardList size={20} className="text-primary" /> My Posts
        </h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Adoption listings 🐾</p>
            {myListings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No listings yet — <Link to="/adoptions" className="text-primary font-semibold hover:underline">post one</Link>!
              </p>
            ) : (
              <ul className="space-y-2">
                {myListings.map((listing) => (
                  <li key={listing.id} className="flex items-center justify-between gap-2 text-sm">
                    <Link to="/adoptions" className="text-foreground hover:text-primary transition-colors">🐱 {listing.name}</Link>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{listing.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Lost & Found reports 🔍</p>
            {myReports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reports yet — <Link to="/lost-found" className="text-primary font-semibold hover:underline">file one</Link>!
              </p>
            ) : (
              <ul className="space-y-2">
                {myReports.map((report) => (
                  <li key={report.id} className="flex items-center justify-between gap-2 text-sm">
                    <Link to="/lost-found" className="text-foreground hover:text-primary transition-colors">
                      {report.type === "lost" ? "🙀" : "😺"} {report.name}
                    </Link>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{report.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
