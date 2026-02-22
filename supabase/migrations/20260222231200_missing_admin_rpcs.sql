-- ============================================================
-- Migration: Create missing admin RPCs
-- set_user_role_admin + set_user_cooperative_admin
-- These were in the generated types but never in the DB
-- ============================================================

-- 1. Set or replace a user's role (upsert pattern)
CREATE OR REPLACE FUNCTION public.set_user_role_admin(
  target_user_id UUID,
  new_role app_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: super_admin required';
  END IF;

  -- Delete existing role(s) for this user, then insert the new one
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_user_role_admin(UUID, app_role) TO authenticated;

-- 2. Set a user's cooperative assignment
CREATE OR REPLACE FUNCTION public.set_user_cooperative_admin(
  target_user_id UUID,
  new_coop_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: super_admin required';
  END IF;

  UPDATE public.profiles
  SET cooperative_id = new_coop_id, updated_at = now()
  WHERE id = target_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_user_cooperative_admin(UUID, UUID) TO authenticated;
