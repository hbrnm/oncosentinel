-- ==============================================================================
-- Migrare Supabase / PostgreSQL: Schema Completă NaviMed (Digital Health)
-- Fișier: supabase/migrations/20261006_complete_navimed_schema.sql
-- ==============================================================================

-- 1. Tipuri ENUM pentru Simptome și Etape Clinice
DO $$ BEGIN
    CREATE TYPE milestone_category AS ENUM ('diagnostic', 'chirurgie', 'radioterapie', 'terapie_adjuvanta');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_category AS ENUM ('bilet_iesire', 'buletin_histopatologic', 'analize_sange', 'mamografie_control', 'alta');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Tabela Profil Pacientă & Istoric Medical
CREATE TABLE IF NOT EXISTS patient_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    histology TEXT DEFAULT 'Carcinom Ductal In Situ (DCIS)',
    stage TEXT DEFAULT 'Grad 0 (TisN0M0)',
    er_status TEXT DEFAULT 'Pozitiv (>90%)',
    pr_status TEXT DEFAULT 'Pozitiv (>80%)',
    her2_status TEXT DEFAULT 'Negativ',
    tamoxifen_start_date DATE,
    pill_stock_count INT DEFAULT 30,
    daily_reminder_time TIME DEFAULT '08:30:00',
    oncologist_email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their profile"
ON patient_profiles FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Tabela Jurnal Simptome Zilnice
CREATE TABLE IF NOT EXISTS symptom_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Simptome Vasomotorii (Bufeuri & Transpirații)
    hot_flashes_count INT DEFAULT 0,
    hot_flashes_intensity INT CHECK (hot_flashes_intensity BETWEEN 0 AND 5) DEFAULT 0,
    night_sweats BOOLEAN DEFAULT FALSE,
    
    -- Stare Generală & Somn
    fatigue_level INT CHECK (fatigue_level BETWEEN 1 AND 5) DEFAULT 1,
    sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 5) DEFAULT 3,
    mood_state TEXT DEFAULT 'Echilibrată',
    
    -- Sănătate Musculo-scheletică
    joint_pain_level INT CHECK (joint_pain_level BETWEEN 0 AND 5) DEFAULT 0,
    joint_pain_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Mucoase & Hidratare
    mucosal_dryness INT CHECK (mucosal_dryness BETWEEN 0 AND 5) DEFAULT 0,
    water_intake_ml INT DEFAULT 2000,
    
    -- Notițe Libere
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_date ON symptom_logs(user_id, logged_at DESC);
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their symptom logs"
ON symptom_logs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Tabela Etape Cronologice (Timeline "Povestea Mea")
CREATE TABLE IF NOT EXISTS clinical_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category milestone_category NOT NULL,
    event_date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    key_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_milestones_user_date ON clinical_milestones(user_id, event_date ASC);
ALTER TABLE clinical_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their milestones"
ON clinical_milestones FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Tabela Documente Medicale (Sechestru Securizat)
CREATE TABLE IF NOT EXISTS medical_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES clinical_milestones(id) ON DELETE SET NULL,
    category document_category NOT NULL DEFAULT 'alta',
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON medical_documents(user_id);
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their documents"
ON medical_documents FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
