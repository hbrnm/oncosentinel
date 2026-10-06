import { createClient } from '@supabase/supabase-js';
import { DoseLog, SymptomLog, PatientProfile, ClinicalMilestone, MedicalDocument } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Patient Profile State for DCIS (Post-op, Post-RT, on Tamoxifen)
export const DEFAULT_PROFILE: PatientProfile = {
  full_name: 'Elena Popescu',
  date_of_birth: '1979-04-12',
  histology: 'Carcinom Ductal In Situ (DCIS)',
  stage: 'Grad 0 (TisN0M0, G2)',
  er_status: 'Pozitiv (>90%)',
  pr_status: 'Pozitiv (>80%)',
  her2_status: 'Negativ',
  tamoxifen_start_date: '2026-09-01',
  pill_stock_count: 24,
  daily_reminder_time: '08:30',
  oncologist_email: 'dr.oncologie@spital.ro'
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
    if (saved) return JSON.parse(saved);

    // Initial seed for sample data (last 5 days)
    const initial: DoseLog[] = [
      { id: '1', medication_name: 'Tamoxifen 20mg', scheduled_for: new Date(Date.now() - 4 * 86400000).toISOString(), taken_at: new Date(Date.now() - 4 * 86400000 + 10 * 60000).toISOString(), status: 'taken' },
      { id: '2', medication_name: 'Tamoxifen 20mg', scheduled_for: new Date(Date.now() - 3 * 86400000).toISOString(), taken_at: new Date(Date.now() - 3 * 86400000 + 5 * 60000).toISOString(), status: 'taken' },
      { id: '3', medication_name: 'Tamoxifen 20mg', scheduled_for: new Date(Date.now() - 2 * 86400000).toISOString(), taken_at: new Date(Date.now() - 2 * 86400000 + 20 * 60000).toISOString(), status: 'taken' },
      { id: '4', medication_name: 'Tamoxifen 20mg', scheduled_for: new Date(Date.now() - 1 * 86400000).toISOString(), taken_at: new Date(Date.now() - 1 * 86400000 + 15 * 60000).toISOString(), status: 'taken' },
    ];
    localStorage.setItem('navimed_doses', JSON.stringify(initial));
    return initial;
  },
  saveDoseLogs(logs: DoseLog[]) {
    localStorage.setItem('navimed_doses', JSON.stringify(logs));
  },

  getSymptomLogs(): SymptomLog[] {
    const saved = localStorage.getItem('navimed_symptoms');
    if (saved) return JSON.parse(saved);

    const initial: SymptomLog[] = [
      {
        id: 's1',
        logged_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        hot_flashes_count: 3,
        hot_flashes_intensity: 2,
        night_sweats: true,
        fatigue_level: 2,
        sleep_quality: 3,
        mood_state: 'Echilibrată',
        joint_pain_level: 1,
        joint_pain_areas: ['genunchi'],
        mucosal_dryness: 1,
        water_intake_ml: 2200,
        notes: 'Ușor bufeu în jurul orei 14:00, rezolvat cu ceai rece de mentă.'
      },
      {
        id: 's2',
        logged_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        hot_flashes_count: 2,
        hot_flashes_intensity: 1,
        night_sweats: false,
        fatigue_level: 1,
        sleep_quality: 4,
        mood_state: 'Optimistă',
        joint_pain_level: 0,
        joint_pain_areas: [],
        mucosal_dryness: 0,
        water_intake_ml: 2500,
        notes: 'Zi foarte bună, plimbare de 45 de minute în parc.'
      }
    ];
    localStorage.setItem('navimed_symptoms', JSON.stringify(initial));
    return initial;
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
    if (saved) return JSON.parse(saved);

    const initial: MedicalDocument[] = [
      {
        id: 'doc1',
        milestone_id: 'm1',
        category: 'buletin_histopatologic',
        file_name: 'Buletin_Biopsie_Stereotaxica_DCIS.pdf',
        file_size_bytes: 420000,
        uploaded_at: '2026-05-16T10:00:00Z',
        notes: 'ER+ 95%, PR+ 85%, TisN0M0',
        is_demo: true
      },
      {
        id: 'doc2',
        milestone_id: 'm2',
        category: 'bilet_iesire',
        file_name: 'Bilet_Externare_Chirurgie_Sectorectomie.pdf',
        file_size_bytes: 850000,
        uploaded_at: '2026-06-27T14:30:00Z',
        notes: 'Margini R0 > 4mm',
        is_demo: true
      },
      {
        id: 'doc3',
        milestone_id: 'm3',
        category: 'alta',
        file_name: 'Fisa_Tratament_Radioterapie_VMAT.pdf',
        file_size_bytes: 620000,
        uploaded_at: '2026-08-11T09:15:00Z',
        notes: '15 fracții finalizate',
        is_demo: true
      }
    ];
    localStorage.setItem('navimed_docs', JSON.stringify(initial));
    return initial;
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
