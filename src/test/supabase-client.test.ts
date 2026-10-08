import { describe, it, expect } from 'vitest';
import { getSupabase } from '../lib/supabase';

describe('Clientul Supabase', () => {
  it('fără variabile de mediu, aplicația lucrează local (clientul e null)', async () => {
    expect(await getSupabase()).toBeNull();
  });
});
