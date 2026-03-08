import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isLoading } = useQuery({
    queryKey: ["adoption-favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adoption_favorites")
        .select("listing_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((f) => f.listing_id);
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Must be signed in");
      const isFav = favoriteIds.includes(listingId);
      if (isFav) {
        const { error } = await supabase
          .from("adoption_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("adoption_favorites")
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
      }
      return { listingId, added: !isFav };
    },
    onSuccess: ({ added }) => {
      queryClient.invalidateQueries({ queryKey: ["adoption-favorites"] });
      toast({ title: added ? "💕 Added to favorites!" : "Removed from favorites" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const isFavorite = (listingId: string) => favoriteIds.includes(listingId);

  return { favoriteIds, isFavorite, toggleFavorite, isLoading };
};
