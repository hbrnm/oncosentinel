import { createClient } from '@supabase/supabase-js';
import { DoseLog, SymptomLog, PatientProfile, ClinicalMilestone, MedicalDocument } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Patient Profile State for DCIS (Post-op, Post-RT, on Tamoxifen)
export const DEFAULT_PROFILE: PatientProfile = {
  full_name: '',
  date_of_birth: '',
  histology: 'Carcinom Ductal In Situ (DCIS)',
  stage: 'Grad 0 (TisN0M0, G2)',
  er_status: 'Pozitiv (>90%)',
  pr_status: 'Pozitiv (>80%)',
  her2_status: 'Negativ',
  tamoxifen_start_date: new Date().toISOString().slice(0, 10),
  pill_stock_count: 30,
  daily_reminder_time: '08:30',
  oncologist_email: ''
};

export const DEFAULT_MILESTONES: ClinicalMilestone[] = [
  {
    id: 'm1',
    category: 'diagnostic',
    event_date: '2026-05-14',
    title: 'Descoperire & Biopsie Mamara',
    description: 'Mamografie screening: microcalcificări pleomorfe cadran supero-extern sân stâng. Biopsie stereotaxică confirmă DCIS.',
    key_details: {
      'Examinare': 'Mamografie digitală bilaterală',
      'Histopatologie': 'Carcinom ductal in situ, pattern cribriform/solid',
      'Receptori': 'ER+ 95%, PR+ 85%, Ki-67 12%'
    },
    documentsCount: 2
  },
  {
    id: 'm2',
    category: 'chirurgie',
    event_date: '2026-06-25',
    title: 'Sectorectomie (Chirurgie Conservatoare)',
    description: 'Intervenție chirurgicală conservatoare cu reperaj harpon. Excizie completă cu margini de rezecție libere (>2mm - R0). Ganglion santinelă negativ.',
    key_details: {
      'Tip Operație': 'Sectorectomie sân stâng + Biopsie Ganglion Santinelă',
      'Margini Rezecție': 'R0 (Libere microscopic, > 4 mm)',
      'Evoluție': 'Vindecare per primam, fără complicații post-operatorii'
    },
    documentsCount: 2
  },
  {
    id: 'm3',
    category: 'radioterapie',
    event_date: '2026-08-10',
    title: 'Radioterapie Adjuvantă (15 Fracții)',
    description: 'Protocol de hipofracționare: 40.05 Gy în 15 fracții pe tot volumul mamar stâng. Toleranță excelentă, eritem cutanat grad 1 rezolvat.',
    key_details: {
      'Doză Totală': '40.05 Gy / 15 fracții',
      'Tehnică': 'VMAT cu inspirație profundă blocată (DIBH)',
      'Îngrijire Piele': 'Cremă hidratantă fără parfum, protecție mecanică'
    },
    documentsCount: 1
  },
  {
    id: 'm4',
    category: 'terapie_adjuvanta',
    event_date: '2026-09-01',
    title: 'Start Tratament Adjuvant Tamoxifen (20 mg/zi)',
    description: 'Inițierea hormonoterapiei adjuvante pentru reducerea riscului de recidivă locală și cancer contralateral. Durată planificată: 5 ani.',
    key_details: {
      'Medicament': 'Tamoxifen 20 mg/zi, oral, dimineața',
      'Durată': '5 ani (2026 - 2031)',
      'Monitorizare': 'Control ecografic/mamografic anual, ecografie transvaginală la 6-12 luni'
    },
    documentsCount: 1
  }
];

// Helper functions for Local Storage & Supabase Sync
export const storageService = {
  getProfile(): PatientProfile {
    const saved = localStorage.getItem('navimed_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  },
  saveProfile(profile: PatientProfile) {
    localStorage.setItem('navimed_profile', JSON.stringify(profile));
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
    localStorage.setItem('navimed_doses', JSON.stringify(logs));
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
    localStorage.setItem('navimed_symptoms', JSON.stringify(logs));
  },

  getMilestones(): ClinicalMilestone[] {
    const saved = localStorage.getItem('navimed_milestones');
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
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
    try {
      localStorage.setItem('navimed_docs', JSON.stringify(docs));
    } catch (err) {
      console.error('LocalStorage quota exceeded for documents:', err);
      alert('Memoria locală a browserului pentru documente este plină. Încearcă să încarci un fișier mai mic.');
    }
  }
};
