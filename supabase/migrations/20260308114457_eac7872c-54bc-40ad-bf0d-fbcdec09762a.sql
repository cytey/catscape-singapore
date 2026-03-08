
CREATE TABLE public.adoption_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  gender TEXT DEFAULT 'unknown',
  description TEXT,
  image_url TEXT,
  location TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.adoption_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adoption listings viewable by everyone"
  ON public.adoption_listings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post listings"
  ON public.adoption_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their listings"
  ON public.adoption_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their listings"
  ON public.adoption_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_adoption_listings_updated_at
  BEFORE UPDATE ON public.adoption_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
