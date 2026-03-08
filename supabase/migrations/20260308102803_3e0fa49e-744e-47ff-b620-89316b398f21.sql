
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================
-- PROFILES
-- ==================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================
-- COMMUNITY CATS
-- ==================
CREATE TABLE public.community_cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'hungry' CHECK (status IN ('fed', 'hungry', 'needs-help')),
  last_fed TIMESTAMPTZ,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_cats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cats viewable by everyone" ON public.community_cats FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add cats" ON public.community_cats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their cats" ON public.community_cats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their cats" ON public.community_cats FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_community_cats_updated_at BEFORE UPDATE ON public.community_cats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================
-- STORE PRODUCTS
-- ==================
CREATE TABLE public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products viewable by everyone" ON public.store_products FOR SELECT USING (true);

CREATE TRIGGER update_store_products_updated_at BEFORE UPDATE ON public.store_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================
-- FUNDRAISING
-- ==================
CREATE TABLE public.fundraising_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  goal_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fundraising_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by everyone" ON public.fundraising_campaigns FOR SELECT USING (true);

CREATE TRIGGER update_fundraising_campaigns_updated_at BEFORE UPDATE ON public.fundraising_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================
-- FUND UPDATES
-- ==================
CREATE TABLE public.fund_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.fundraising_campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount_used NUMERIC(10,2),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fund_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fund updates viewable by everyone" ON public.fund_updates FOR SELECT USING (true);

-- ==================
-- DONATIONS
-- ==================
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.fundraising_campaigns(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  donor_name TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations viewable by everyone" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can donate" ON public.donations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================
-- CAT PHOTOS STORAGE
-- ==================
INSERT INTO storage.buckets (id, name, public) VALUES ('cat-photos', 'cat-photos', true);

CREATE POLICY "Cat photos publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'cat-photos');
CREATE POLICY "Authenticated users can upload cat photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cat-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own cat photos" ON storage.objects FOR UPDATE USING (bucket_id = 'cat-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own cat photos" ON storage.objects FOR DELETE USING (bucket_id = 'cat-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
