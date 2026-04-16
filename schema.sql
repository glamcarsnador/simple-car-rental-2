-- ==========================================
-- 1. Table Creation (using IF NOT EXISTS)
-- ==========================================

-- CARS TABLE
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    plate_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    daily_rate NUMERIC(10, 2) DEFAULT 0 -- NOT NULL removed to fix your error
);

-- CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    license_number TEXT UNIQUE
);

-- RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC(10, 2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- ==========================================
-- 2. Security Activation (Enable RLS)
-- ==========================================

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Permissions (Public Development Policies)
-- ==========================================

-- Car Policies
DROP POLICY IF EXISTS "Public full access to cars" ON public.cars;
CREATE POLICY "Public full access to cars" ON public.cars FOR ALL USING (true) WITH CHECK (true);

-- Client Policies
DROP POLICY IF EXISTS "Public full access to clients" ON public.clients;
CREATE POLICY "Public full access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Reservation Policies
DROP POLICY IF EXISTS "Public full access to reservations" ON public.reservations;
CREATE POLICY "Public full access to reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);