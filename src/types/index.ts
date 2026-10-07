export type DoseStatus = 'taken' | 'snoozed_15m' | 'missed' | 'skipped';

export interface DoseLog {
  id: string;
  user_id?: string;
  medication_name: string;
  scheduled_for: string; // ISO string
  taken_at?: string;     // ISO string
  status: DoseStatus;
  notes?: string;
}

export interface SymptomLog {
  id: string;
  user_id?: string;
  logged_at: string;
  hot_flashes_count: number;
  hot_flashes_intensity: number; // 0 - 5
  night_sweats: boolean;
  fatigue_level: number;         // 1 - 5
  sleep_quality: number;         // 1 - 5
  mood_state: string;            // 'Calmă' | 'Anxioasă' | 'Obosită' | 'Optimistă' | 'Echilibrată'
  joint_pain_level: number;      // 0 - 5
  bone_pain_level?: number;      // 0 - 5
  joint_pain_areas: string[];
  mucosal_dryness: number;       // 0 - 5
  nausea_level?: number;         // 0 - 5
  brain_fog?: number;            // 0 - 5
  headache?: number;             // 0 - 5
  water_intake_ml: number;
  notes?: string;
}

export type MilestoneCategory = 'diagnostic' | 'chirurgie' | 'radioterapie' | 'terapie_adjuvanta';

export interface ClinicalMilestone {
  id: string;
  category: MilestoneCategory;
  event_date: string;
  title: string;
  description: string;
  key_details: Record<string, string>;
  documentsCount?: number;
}

export type DocumentCategory = 'bilet_iesire' | 'buletin_histopatologic' | 'analize_sange' | 'mamografie_control' | 'alta';

export interface MedicalDocument {
  id: string;
  milestone_id?: string;
  category: DocumentCategory;
  file_name: string;
  file_url?: string;
  file_data?: string; // base64 or object URL for downloading / viewing real file
  file_size_bytes?: number;
  uploaded_at: string;
  notes?: string;
  is_demo?: boolean;
}

export interface PatientProfile {
  full_name: string;
  date_of_birth?: string;
  histology: string;
  stage: string;
  er_status: string;
  pr_status: string;
  her2_status: string;
  tamoxifen_start_date: string;
  pill_stock_count: number;
  daily_reminder_time: string;
  medication_name?: string;
  medication_dose?: string;
  medication_frequency?: string;
  oncologist_email?: string;
}

export interface DrugInteraction {
  substance: string;
  category: 'antidepresiv' | 'planta' | 'analgezic' | 'supliment' | 'aliment' | 'altele';
  riskLevel: 'SAFE' | 'CAUTION' | 'CONTRAINDICATED';
  riskLabel: string;
  mechanism: string;
  recommendation: string;
  details: string;
}
