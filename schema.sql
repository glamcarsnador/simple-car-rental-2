-- Table Creation (using IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS public.cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    plate_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    daily_rate NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_number TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC(10, 2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Security Activation (Enable RLS for all tables)

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Permissions (Define specific Policies/Roles)

-- Car Policies: Public access for all operations during development
DROP POLICY IF EXISTS "Public cars are viewable by everyone" ON public.cars;
CREATE POLICY "Public full access to cars" ON public.cars FOR ALL USING (true) WITH CHECK (true);

-- Client Policies: Public access for all operations during development
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON public.clients;
CREATE POLICY "Public full access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Reservation Policies: Public access for all operations during development
DROP POLICY IF EXISTS "Authenticated users can manage reservations" ON public.reservations;
CREATE POLICY "Public full access to reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);
