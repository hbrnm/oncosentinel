import type { SupabaseClient } from '@supabase/supabase-js';
import { DoseLog, SymptomLog, PatientProfile, ClinicalMilestone, MedicalDocument } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clientul Supabase se încarcă doar când e cerut (aplicația lucrează acum local),
// ca biblioteca să nu intre în pachetul de pornire. Fără variabile: null.
let client: Promise<SupabaseClient | null> | null = null;
export const getSupabase = (): Promise<SupabaseClient | null> => {
  if (!supabaseUrl || !supabaseAnonKey) return Promise.resolve(null);
  client ??= import('@supabase/supabase-js')
    .then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey))
    .catch((e) => { client = null; throw e; }); // fără rețea: se poate reîncerca
  return client;
};

// Initial Patient Profile State for DCIS (Post-op, Post-RT, on Tamoxifen)
export const DEFAULT_PROFILE: PatientProfile = {
  full_name: '',
  date_of_birth: '',
  histology: '',
  stage: '',
  er_status: '',
  pr_status: '',
  her2_status: '',
  tamoxifen_start_date: new Date().toISOString().slice(0, 10),
  pill_stock_count: 30,
  daily_reminder_time: '08:30',
  oncologist_email: ''
};

export const STORAGE_FULL_MESSAGE =
  'Nu am putut salva: spațiul pentru date de pe acest dispozitiv e plin. Șterge câteva documente din Cronologie (cele mari ocupă cel mai mult) și încearcă din nou.';

// Salvează în localStorage; când spațiul e plin, spune utilizatoarei în loc să piardă datele în tăcere
const save = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('Salvare locală eșuată:', err);
    alert(STORAGE_FULL_MESSAGE);
    return false;
  }
};

// Helper functions for Local Storage & Supabase Sync
export const storageService = {
  getProfile(): PatientProfile {
    const saved = localStorage.getItem('navimed_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  },
  saveProfile(profile: PatientProfile) {
    return save('navimed_profile', profile);
  },
  
  getDoseLogs(): DoseLog[] {
    const saved = localStorage.getItem('navimed_doses');
    if (saved) {
      try {
        const parsed: DoseLog[] = JSON.parse(saved);
        // Exclude legacy mock seed doses (IDs '1', '2', '3', '4')
        const real = parsed.filter(d => d.id !== '1' && d.id !== '2' && d.id !== '3' && d.id !== '4');
        if (real.length !== parsed.length) {
          localStorage.setItem('navimed_doses', JSON.stringify(real));
        }
        return real;
      } catch (e) {
        return [];
      }
    }
    return [];
  },
  saveDoseLogs(logs: DoseLog[]) {
    return save('navimed_doses', logs);
  },

  getSymptomLogs(): SymptomLog[] {
    const saved = localStorage.getItem('navimed_symptoms');
    if (saved) {
      try {
        const parsed: SymptomLog[] = JSON.parse(saved);
        // Exclude legacy mock seed symptoms (IDs 's1', 's2')
        const real = parsed.filter(s => s.id !== 's1' && s.id !== 's2');
        if (real.length !== parsed.length) {
          localStorage.setItem('navimed_symptoms', JSON.stringify(real));
        }
        return real;
      } catch (e) {
        return [];
      }
    }
    return [];
  },
  saveSymptomLogs(logs: SymptomLog[]) {
    return save('navimed_symptoms', logs);
  },

  saveMilestones(milestones: ClinicalMilestone[]) {
    return save('navimed_milestones', milestones);
  },

  getMilestones(): ClinicalMilestone[] {
    const saved = localStorage.getItem('navimed_milestones');
    return saved ? JSON.parse(saved) : [];
  },

  getDocuments(): MedicalDocument[] {
    const saved = localStorage.getItem('navimed_docs');
    if (saved) {
      try {
        const parsed: MedicalDocument[] = JSON.parse(saved);
        // Exclude legacy demo documents
        const real = parsed.filter(d => !d.is_demo && d.id !== 'doc1' && d.id !== 'doc2' && d.id !== 'doc3');
        if (real.length !== parsed.length) {
          localStorage.setItem('navimed_docs', JSON.stringify(real));
        }
        return real;
      } catch (e) {
        return [];
      }
    }
    return [];
  },
  saveDocuments(docs: MedicalDocument[]) {
    return save('navimed_docs', docs);
  }
};
