-- ==============================================================================
-- Migrare Supabase / PostgreSQL: Modulul de Aderență Tamoxifen (NaviMed)
-- Fișier: supabase/migrations/20261006_create_dose_logs.sql
-- ==============================================================================

-- 1. Tip ENUM pentru starea administrării dozei
DO $$ BEGIN
    CREATE TYPE dose_status AS ENUM ('taken', 'snoozed_15m', 'missed', 'skipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de înregistrare a dozelor
CREATE TABLE IF NOT EXISTS dose_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL DEFAULT 'Tamoxifen 20mg',
    scheduled_for TIMESTAMPTZ NOT NULL,
    taken_at TIMESTAMPTZ,
    status dose_status NOT NULL DEFAULT 'taken',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexare performantă pentru căutare rapidă pe pacient și intervale de timp
CREATE INDEX IF NOT EXISTS idx_dose_logs_user_scheduled 
ON dose_logs(user_id, scheduled_for DESC);

CREATE INDEX IF NOT EXISTS idx_dose_logs_user_status 
ON dose_logs(user_id, status);

-- 4. Activare Row Level Security (RLS)
ALTER TABLE dose_logs ENABLE ROW LEVEL SECURITY;

-- 5. Politici de Securitate RLS (SELECT, INSERT, UPDATE, DELETE)
-- Folosim atât USING cât și WITH CHECK pentru a preveni inserarea/modificarea datelor de către alți utilizatori
DROP POLICY IF EXISTS "Users can view their own dose logs" ON dose_logs;
CREATE POLICY "Users can view their own dose logs"
ON dose_logs FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own dose logs" ON dose_logs;
CREATE POLICY "Users can insert their own dose logs"
ON dose_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own dose logs" ON dose_logs;
CREATE POLICY "Users can update their own dose logs"
ON dose_logs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own dose logs" ON dose_logs;
CREATE POLICY "Users can delete their own dose logs"
ON dose_logs FOR DELETE
USING (auth.uid() = user_id);

-- 6. Trigger automat pentru actualizarea timestamp-ului 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_dose_logs_updated_at ON dose_logs;
CREATE TRIGGER trigger_dose_logs_updated_at
    BEFORE UPDATE ON dose_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
