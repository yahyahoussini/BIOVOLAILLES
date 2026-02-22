
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'cooperative_manager', 'hatchery_tech', 'conditioning_operator', 'abattoir_operator');

-- Cooperative table
CREATE TABLE public.cooperative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  photo_url TEXT,
  manager_name TEXT,
  certification_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  cooperative_id UUID REFERENCES public.cooperative(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles per security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Flock table
CREATE TABLE public.flock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES public.cooperative(id) ON DELETE CASCADE,
  breed TEXT NOT NULL,
  arrival_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity_hens INTEGER NOT NULL DEFAULT 0,
  quantity_males INTEGER NOT NULL DEFAULT 0,
  feed_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Packaging batch table
CREATE TABLE public.packaging_batch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id UUID NOT NULL REFERENCES public.flock(id) ON DELETE CASCADE,
  package_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity_eggs INTEGER NOT NULL DEFAULT 0,
  grade TEXT,
  batch_ref TEXT NOT NULL,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Slaughter batch table
CREATE TABLE public.slaughter_batch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id UUID NOT NULL REFERENCES public.flock(id) ON DELETE CASCADE,
  slaughter_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity_birds INTEGER NOT NULL DEFAULT 0,
  total_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
  batch_ref TEXT NOT NULL,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cooperative ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_batch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slaughter_batch ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user cooperative_id (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_cooperative_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cooperative_id FROM public.profiles WHERE id = _user_id
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ===================== RLS POLICIES =====================

-- PROFILES: users can read own, super_admin can manage all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR id = auth.uid());

-- USER_ROLES: only super_admin can manage, users can read own
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin manages roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin updates roles" ON public.user_roles
  FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin deletes roles" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- COOPERATIVE: all authenticated can read, super_admin full, coop_manager own
CREATE POLICY "Authenticated users can view cooperatives" ON public.cooperative
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin can insert cooperatives" ON public.cooperative
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin or manager can update cooperative" ON public.cooperative
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (public.has_role(auth.uid(), 'cooperative_manager') AND id = public.get_user_cooperative_id(auth.uid()))
  );

CREATE POLICY "Super admin can delete cooperative" ON public.cooperative
  FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- FLOCK: all authenticated can read, super_admin full, coop_manager own
CREATE POLICY "Authenticated users can view flocks" ON public.flock
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin or manager can insert flock" ON public.flock
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (public.has_role(auth.uid(), 'cooperative_manager') AND cooperative_id = public.get_user_cooperative_id(auth.uid()))
  );

CREATE POLICY "Super admin or manager can update flock" ON public.flock
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (public.has_role(auth.uid(), 'cooperative_manager') AND cooperative_id = public.get_user_cooperative_id(auth.uid()))
  );

CREATE POLICY "Super admin or manager can delete flock" ON public.flock
  FOR DELETE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (public.has_role(auth.uid(), 'cooperative_manager') AND cooperative_id = public.get_user_cooperative_id(auth.uid()))
  );

-- PACKAGING_BATCH: all authenticated can read, super_admin full, conditioning_operator can manage
CREATE POLICY "Authenticated users can view packaging batches" ON public.packaging_batch
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin or conditioning op can insert packaging" ON public.packaging_batch
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'conditioning_operator')
  );

CREATE POLICY "Super admin or conditioning op can update packaging" ON public.packaging_batch
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'conditioning_operator')
  );

CREATE POLICY "Super admin or conditioning op can delete packaging" ON public.packaging_batch
  FOR DELETE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'conditioning_operator')
  );

-- SLAUGHTER_BATCH: all authenticated can read, super_admin full, abattoir_operator can manage
CREATE POLICY "Authenticated users can view slaughter batches" ON public.slaughter_batch
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin or abattoir op can insert slaughter" ON public.slaughter_batch
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'abattoir_operator')
  );

CREATE POLICY "Super admin or abattoir op can update slaughter" ON public.slaughter_batch
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'abattoir_operator')
  );

CREATE POLICY "Super admin or abattoir op can delete slaughter" ON public.slaughter_batch
  FOR DELETE USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'abattoir_operator')
  );
