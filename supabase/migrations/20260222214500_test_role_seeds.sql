-- ============================================================
-- TEST ROLE SEEDS — run AFTER creating the 5 test accounts
-- in the Supabase Dashboard (Auth → Users → Add User)
--
-- Test credentials (set these when you create the accounts):
--   super_admin@biovolailles.test        / Test1234!
--   manager@biovolailles.test            / Test1234!
--   hatchery@biovolailles.test           / Test1234!
--   conditioning@biovolailles.test       / Test1234!
--   abattoir@biovolailles.test           / Test1234!
-- ============================================================

-- Helper: assign role by email (safe to re-run)
DO $$
DECLARE
  v_super_id    uuid;
  v_manager_id  uuid;
  v_hatchery_id uuid;
  v_cond_id     uuid;
  v_abattoir_id uuid;
BEGIN
  -- Lookup user IDs from auth.users by email
  SELECT id INTO v_super_id    FROM auth.users WHERE email = 'super_admin@biovolailles.test';
  SELECT id INTO v_manager_id  FROM auth.users WHERE email = 'manager@biovolailles.test';
  SELECT id INTO v_hatchery_id FROM auth.users WHERE email = 'hatchery@biovolailles.test';
  SELECT id INTO v_cond_id     FROM auth.users WHERE email = 'conditioning@biovolailles.test';
  SELECT id INTO v_abattoir_id FROM auth.users WHERE email = 'abattoir@biovolailles.test';

  -- Assign roles (ON CONFLICT DO NOTHING = safe to re-run)
  IF v_super_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_super_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  IF v_manager_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_manager_id, 'cooperative_manager')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  IF v_hatchery_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_hatchery_id, 'hatchery_tech')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  IF v_cond_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_cond_id, 'conditioning_operator')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  IF v_abattoir_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_abattoir_id, 'abattoir_operator')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RAISE NOTICE 'Role seeds applied. Results:';
  RAISE NOTICE '  super_admin    → %', COALESCE(v_super_id::text, 'USER NOT FOUND - create it first');
  RAISE NOTICE '  coop_manager   → %', COALESCE(v_manager_id::text, 'USER NOT FOUND - create it first');
  RAISE NOTICE '  hatchery_tech  → %', COALESCE(v_hatchery_id::text, 'USER NOT FOUND - create it first');
  RAISE NOTICE '  cond_operator  → %', COALESCE(v_cond_id::text, 'USER NOT FOUND - create it first');
  RAISE NOTICE '  abattoir_op    → %', COALESCE(v_abattoir_id::text, 'USER NOT FOUND - create it first');
END;
$$;

-- Verify result
SELECT
  u.email,
  r.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email LIKE '%@biovolailles.test'
ORDER BY u.email;
