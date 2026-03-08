import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface AdoptionListing {
  id: string;
  name: string;
  breed: string | null;
  age: string | null;
  gender: string | null;
  description: string | null;
  image_url: string | null;
  location: string;
  contact_info: string;
  created_at: string;
}

interface Props {
  listing: AdoptionListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genderLabel = (g: string | null) => {
  if (g === "male") return "♂ Boy";
  if (g === "female") return "♀ Girl";
  return "Unknown";
};

const AdoptionDetailDialog = ({ listing, open, onOpenChange }: Props) => {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {listing.image_url ? (
          <div className="relative w-full aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
            <img
              src={listing.image_url}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
              {genderLabel(listing.gender)}
            </Badge>
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center text-7xl">
            🐱
            <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
              {genderLabel(listing.gender)}
            </Badge>
          </div>
        )}

        <div className="p-6 pt-2 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">{listing.name}</DialogTitle>
            <div className="flex gap-2 text-sm text-muted-foreground">
              {listing.breed && <span>{listing.breed}</span>}
              {listing.age && <span>• {listing.age}</span>}
            </div>
          </DialogHeader>

          {listing.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          )}

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={14} className="text-primary" /> {listing.location}
            </p>
            <p className="text-muted-foreground">📞 {listing.contact_info}</p>
            <p className="text-xs text-muted-foreground/60">
              Posted {new Date(listing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdoptionDetailDialog;
