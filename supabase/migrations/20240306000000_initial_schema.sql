-- Enable required extension for UUID generation (pgcrypto preferred on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------
-- SCHEMA / TABLES
------------------------

-- 1) profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- 2) organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  owner_id uuid NOT NULL
);

-- 3) shops
CREATE TABLE IF NOT EXISTS public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  location_data jsonb,
  is_active boolean NOT NULL DEFAULT true
);

-- ✅ FIX #1: CREATE TYPE tidak mendukung IF NOT EXISTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typname = 'membership_role'
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE TYPE public.membership_role AS ENUM ('Admin', 'Staff', 'Owner');
  END IF;
END
$$;

-- 4) memberships
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  role public.membership_role NOT NULL DEFAULT 'Staff',
  CONSTRAINT memberships_user_shop_unique UNIQUE (user_id, shop_id)
);

-- 5) categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true
);

-- 6) products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(12,2) NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_visible boolean NOT NULL DEFAULT true
);

-- 7) product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  additional_price numeric(12,2) DEFAULT 0.00
);

-- 8) subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  status text NOT NULL,
  current_period_end timestamptz
);

-- 9) analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

------------------------
-- INDEXES (performance)
------------------------
CREATE INDEX IF NOT EXISTS idx_memberships_user_shop      ON public.memberships       (user_id, shop_id);
CREATE INDEX IF NOT EXISTS idx_categories_shop_id         ON public.categories        (shop_id);
CREATE INDEX IF NOT EXISTS idx_products_shop_id           ON public.products          (shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id       ON public.products          (category_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_shop_product     ON public.analytics_events  (shop_id, product_id);

------------------------
-- ROW LEVEL SECURITY (RLS)
------------------------
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events  ENABLE ROW LEVEL SECURITY;

------------------------
-- POLICIES: PUBLIC (anon) READ-ONLY
------------------------

CREATE POLICY "anon_select_active_shops" ON public.shops
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "anon_select_visible_categories" ON public.categories
  FOR SELECT TO anon
  USING (is_visible = true);

CREATE POLICY "anon_select_visible_products" ON public.products
  FOR SELECT TO anon
  USING (is_visible = true);

------------------------
-- POLICIES: profiles
------------------------

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

------------------------
-- POLICIES: organizations
------------------------

CREATE POLICY "org_owner_all" ON public.organizations
  FOR ALL TO authenticated
  USING    (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

------------------------
-- POLICIES: shops
------------------------

CREATE POLICY "shops_members_all" ON public.shops
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.shops.id
        AND m.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.shops.id
        AND m.user_id = (SELECT auth.uid())
    )
  );

------------------------
-- POLICIES: memberships
------------------------

CREATE POLICY "memberships_user_select" ON public.memberships
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "memberships_user_insert_own" ON public.memberships
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "memberships_update_owner_or_self" ON public.memberships
  FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.memberships m2
      WHERE m2.user_id = (SELECT auth.uid())
        AND m2.shop_id = public.memberships.shop_id
        AND m2.role = 'Owner'
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.memberships m2
      WHERE m2.user_id = (SELECT auth.uid())
        AND m2.shop_id = public.memberships.shop_id
        AND m2.role = 'Owner'
    )
  );

CREATE POLICY "memberships_delete_owner_or_self" ON public.memberships
  FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.memberships m2
      WHERE m2.user_id = (SELECT auth.uid())
        AND m2.shop_id = public.memberships.shop_id
        AND m2.role = 'Owner'
    )
  );

------------------------
-- POLICIES: categories
------------------------

CREATE POLICY "categories_members_all" ON public.categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.categories.shop_id
        AND m.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.categories.shop_id
        AND m.user_id = (SELECT auth.uid())
    )
  );

------------------------
-- POLICIES: products
------------------------

CREATE POLICY "products_members_all" ON public.products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.products.shop_id
        AND m.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.products.shop_id
        AND m.user_id = (SELECT auth.uid())
    )
  );

------------------------
-- POLICIES: product_variants
------------------------

CREATE POLICY "product_variants_members_all" ON public.product_variants
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.memberships m ON m.shop_id = p.shop_id
      WHERE public.product_variants.product_id = p.id
        AND m.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.memberships m ON m.shop_id = p.shop_id
      WHERE public.product_variants.product_id = p.id
        AND m.user_id = (SELECT auth.uid())
    )
  );

------------------------
-- POLICIES: subscriptions
------------------------

CREATE POLICY "subscriptions_org_owner_all" ON public.subscriptions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = public.subscriptions.org_id
        AND o.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = public.subscriptions.org_id
        AND o.owner_id = (SELECT auth.uid())
    )
  );

------------------------
-- POLICIES: analytics_events
------------------------

CREATE POLICY "analytics_members_insert" ON public.analytics_events
  FOR INSERT TO authenticated
  WITH CHECK (
    CASE
      WHEN public.analytics_events.shop_id IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.shop_id = public.analytics_events.shop_id
          AND m.user_id = (SELECT auth.uid())
      )
    END
  );

CREATE POLICY "analytics_members_select" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (
    public.analytics_events.shop_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.shop_id = public.analytics_events.shop_id
        AND m.user_id = (SELECT auth.uid())
    )
  );
