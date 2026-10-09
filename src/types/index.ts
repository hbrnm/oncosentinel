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
  // 'note' = stare + gânduri, 'symptoms' = formularul de simptome; lipsă = intrare veche, cu ambele
  kind?: 'note' | 'symptoms';
  hot_flashes_count?: number;
  hot_flashes_intensity?: number; // 0 - 5
  night_sweats?: boolean;
  fatigue_level?: number;         // 0 - 5 (0 = nenotat)
  sleep_quality?: number;         // 1 - 5
  mood_state?: string;            // 'Foarte bine' | 'Bine' | 'Echilibrată' | 'Rău' | 'Foarte rău'
  joint_pain_level?: number;      // 0 - 5
  bone_pain_level?: number;      // 0 - 5
  joint_pain_areas?: string[];
  mucosal_dryness?: number;       // 0 - 5
  nausea_level?: number;         // 0 - 5
  brain_fog?: number;            // 0 - 5
  headache?: number;             // 0 - 5
  water_intake_ml?: number;
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
  email?: string;
  oncologist_email?: string;
  avatar_url?: string;
}

export interface DrugInteraction {
  substance: string;
  level: 'avoid' | 'tell' | 'ask';
  levelLabel: string;
  advice: string;
  source: string;
  /** Cuvintele (fără diacritice) după care se recunoaște în „Medicamentele mele”, doar din `substance` */
  match: string[];
}

/** „Medicamentele mele”: celelalte medicamente, doar notate (fără bifă zilnică) */
export interface OtherMedicine {
  id: string;
  name: string;
  dose?: string;
  when?: string;
  reason?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  recipeSource?: string;
  isBought: boolean;
  addedAt: string;
}
