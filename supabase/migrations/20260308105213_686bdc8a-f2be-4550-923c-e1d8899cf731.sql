
CREATE TABLE public.lost_found_cats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'lost' CHECK (type IN ('lost', 'found')),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lost_found_cats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lost found cats viewable by everyone" ON public.lost_found_cats FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report" ON public.lost_found_cats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their reports" ON public.lost_found_cats FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their reports" ON public.lost_found_cats FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_lost_found_cats_updated_at BEFORE UPDATE ON public.lost_found_cats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
