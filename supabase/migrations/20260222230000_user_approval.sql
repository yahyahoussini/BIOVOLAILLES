-- ============================================================
-- Migration: User approval system
-- Adds approved column to profiles + approve_user_admin RPC
-- ============================================================

-- 1. Add approved column (defaults false for new signups)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- 2. Mark ALL existing users as approved (so current users aren't locked out)
UPDATE public.profiles SET approved = true WHERE approved = false;

-- 3. RPC: approve or reject a user (super_admin only)
CREATE OR REPLACE FUNCTION public.approve_user_admin(
  target_user_id UUID,
  is_approved BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only super_admin can call this
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: super_admin required';
  END IF;

  UPDATE public.profiles
  SET approved = is_approved, updated_at = now()
  WHERE id = target_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_user_admin(UUID, BOOLEAN) TO authenticated;

-- 4. Update get_all_users_admin to include approved status
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  cooperative_id UUID,
  approved BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: super_admin required';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::TEXT,
    COALESCE(p.full_name, '')::TEXT,
    COALESCE(ur.role::TEXT, ''),
    p.cooperative_id,
    COALESCE(p.approved, false),
    p.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  ORDER BY p.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_users_admin() TO authenticated;
