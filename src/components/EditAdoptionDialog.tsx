import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
}

interface Props {
  listing: AdoptionListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditAdoptionDialog = ({ listing, open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
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

  useEffect(() => {
    if (listing) {
      setForm({
        name: listing.name,
        breed: listing.breed ?? "",
        age: listing.age ?? "",
        gender: listing.gender ?? "unknown",
        description: listing.description ?? "",
        image_url: listing.image_url ?? "",
        location: listing.location,
        contact_info: listing.contact_info,
      });
    }
  }, [listing]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!listing) throw new Error("No listing");
      const { error } = await supabase
        .from("adoption_listings")
        .update({
          name: form.name,
          breed: form.breed || null,
          age: form.age || null,
          gender: form.gender,
          description: form.description || null,
          image_url: form.image_url || null,
          location: form.location,
          contact_info: form.contact_info,
        })
        .eq("id", listing.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoption-listings"] });
      onOpenChange(false);
      toast({ title: "✅ Listing updated!", description: "Your changes have been saved." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
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

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ Edit Listing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-2">
          <div>
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Breed</Label>
              <Input value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} />
            </div>
            <div>
              <Label>Age</Label>
              <Input value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
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
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          </div>
          <div>
            <Label>Photo</Label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-secondary transition-colors">
                <Upload size={16} /> {uploading ? "Uploading…" : "Change Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {form.image_url && <img src={form.image_url} alt="preview" className="h-12 w-12 rounded-md object-cover" />}
            </div>
          </div>
          <div>
            <Label>Location *</Label>
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <Label>Contact Info *</Label>
            <Input value={form.contact_info} onChange={(e) => setForm((f) => ({ ...f, contact_info: e.target.value }))} />
          </div>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={!form.name || !form.location || !form.contact_info || updateMutation.isPending}
            className="bg-gradient-hero text-primary-foreground"
          >
            {updateMutation.isPending ? "Saving…" : "💾 Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdoptionDialog;
