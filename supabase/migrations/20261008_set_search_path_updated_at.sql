-- Funcția trigger pentru 'updated_at' rulează cu search_path fix (gol),
-- ca să nu poată fi deturnată prin obiecte cu același nume din alte scheme.
-- timezone() și now() sunt în pg_catalog, care rămâne mereu disponibil.
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
