import React, { useState } from 'react';
import {
  CheckCircle2, FileText, Upload, Plus, ChevronDown, ChevronUp, ShieldCheck, Download, Calendar, Activity, Edit3, Trash2
} from 'lucide-react';
import { ClinicalMilestone, MedicalDocument, PatientProfile } from '../types';
import { MilestoneModal } from './MilestoneModal';
import { useBackToClose } from '../lib/backNavigation';

interface TimelineTabProps {
  profile: PatientProfile;
  milestones: ClinicalMilestone[];
  documents: MedicalDocument[];
  onAddDocument: (doc: Partial<MedicalDocument>) => void;
  onDeleteDocument?: (id: string) => void;
  onUpdateMilestones?: (milestones: ClinicalMilestone[]) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  profile,
  milestones,
  documents,
  onAddDocument,
  onDeleteDocument,
  onUpdateMilestones
}) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<ClinicalMilestone | 'new' | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  useBackToClose(editingMilestone !== null, () => setEditingMilestone(null));
  useBackToClose(showUploadModal, () => setShowUploadModal(false));
  const [docName, setDocName] = useState<string>('');
  const [docCategory, setDocCategory] = useState<any>('buletin_histopatologic');
  const [selectedRealFile, setSelectedRealFile] = useState<File | null>(null);

  const handleSaveMilestone = (saved: ClinicalMilestone) => {
    const others = milestones.filter(m => m.id !== saved.id);
    const updated = [...others, saved].sort((a, b) => a.event_date.localeCompare(b.event_date));
    onUpdateMilestones?.(updated);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (m: ClinicalMilestone) => {
    if (confirm(`Sigur dorești să ștergi etapa "${m.title}" din cronologie?`)) {
      onUpdateMilestones?.(milestones.filter(x => x.id !== m.id));
    }
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRealFile) {
      alert('Alege mai întâi fișierul (PDF sau poză) pe care vrei să-l păstrezi.');
      return;
    }

    // Validate file size to prevent localStorage quota crash
    if (selectedRealFile.size > 1.5 * 1024 * 1024) {
      alert('Pentru performanță și stocare securizată pe dispozitiv, fișierul trebuie să fie sub 1.5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      onAddDocument({
        file_name: docName.trim() || selectedRealFile.name,
        category: docCategory,
        file_size_bytes: selectedRealFile.size,
        file_data: base64Data,
        uploaded_at: new Date().toISOString(),
        is_demo: false
      });
      setSelectedRealFile(null);
      setDocName('');
      setShowUploadModal(false);
    };
    reader.onerror = () => {
      alert('A apărut o problemă la citirea fișierului de pe dispozitiv.');
    };
    reader.readAsDataURL(selectedRealFile);
  };

  const categoryBadges: Record<string, { label: string; color: string }> = {
    diagnostic: { label: 'Etapa 1: Diagnostic', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
    chirurgie: { label: 'Etapa 2: Chirurgie', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
    radioterapie: { label: 'Etapa 3: Radioterapie', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    terapie_adjuvanta: { label: 'Etapa 4: Adjuvant (Activ)', color: 'bg-sage-100 dark:bg-sage-900/50 text-sage-800 dark:text-sage-300' }
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* 1. Clinical Diagnosis Profile Card */}
      <div className="bg-gradient-to-br from-white to-sage-50/50 dark:from-darkbg-card dark:to-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sage-700 dark:text-sage-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Fișă Diagnostic Onco-Mamologie</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {profile.histology || 'Diagnostic necompletat'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {profile.stage || 'Stadiu necompletat'}
            </p>
          </div>
        </div>

        {/* Receptor status badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-sage-100/80 dark:border-darkbg-border">
          <div className="p-2 rounded-xl bg-white dark:bg-darkbg-surface border border-gray-100 dark:border-darkbg-border text-center">
            <span className="text-[10px] text-gray-500 block">Receptor ER</span>
            <span className="text-xs font-bold text-sage-700 dark:text-sage-300">{profile.er_status || '—'}</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-darkbg-surface border border-gray-100 dark:border-darkbg-border text-center">
            <span className="text-[10px] text-gray-500 block">Receptor PR</span>
            <span className="text-xs font-bold text-sage-700 dark:text-sage-300">{profile.pr_status || '—'}</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-darkbg-surface border border-gray-100 dark:border-darkbg-border text-center">
            <span className="text-[10px] text-gray-500 block">Status HER2</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{profile.her2_status || '—'}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Clinical Timeline */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sage-600" />
            <span>Povestea Mea Medicală (Cronologie)</span>
          </h3>
          <button
            onClick={() => setEditingMilestone('new')}
            className="text-xs text-sage-700 dark:text-sage-300 font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Adaugă etapă
          </button>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-sage-200 dark:before:bg-darkbg-border">
          {milestones.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Încă nu ai adăugat nicio etapă. Apasă „Adaugă etapă” ca să-ți notezi diagnosticul, operația sau tratamentele, cu data lor.
            </p>
          )}
          {milestones.map((m) => {
            const isExpanded = expandedMilestone === m.id;
            const badge = categoryBadges[m.category] || { label: m.title, color: 'bg-gray-100 text-gray-700' };

            return (
              <div key={m.id} className="relative group">
                {/* Node icon on timeline line */}
                <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-darkbg-surface ${
                  m.category === 'terapie_adjuvanta'
                    ? 'bg-sage-500 text-white ring-4 ring-sage-100 dark:ring-sage-900/40'
                    : 'bg-sage-200 dark:bg-sage-800 text-sage-700 dark:text-sage-300'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div 
                  onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                  className="cursor-pointer bg-gray-50/70 dark:bg-darkbg-card p-3.5 rounded-2xl border border-gray-100 dark:border-darkbg-border hover:border-sage-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(m.event_date).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1.5 flex items-center justify-between">
                    <span>{m.title}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </h4>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Expanded clinical details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-darkbg-border space-y-1.5 animate-fade-in">
                      {Object.entries(m.key_details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-[11px]">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-end gap-3 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingMilestone(m); }}
                          className="text-[11px] font-semibold text-sage-700 dark:text-sage-300 flex items-center gap-1 hover:underline"
                        >
                          <Edit3 className="w-3 h-3" /> Modifică
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteMilestone(m); }}
                          className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 hover:underline"
                        >
                          <Trash2 className="w-3 h-3" /> Șterge
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Secure Document Vault */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-sage-100 dark:bg-sage-900/40 text-sage-600 dark:text-sage-300 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Seif Documente Medicale
              </h3>
              <p className="text-[11px] text-gray-500">Stocare privată și securizată pe dispozitivul tău</p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1 bg-sage-500 hover:bg-sage-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Încarcă PDF</span>
          </button>
        </div>

        {/* Documents list */}
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="text-center py-6 px-4 bg-gray-50/50 dark:bg-darkbg-card/50 rounded-2xl border border-dashed border-gray-200 dark:border-darkbg-border">
              <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nu ai încărcat niciun document</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Apasă butonul „Încarcă PDF” de mai sus pentru a salva primul bilet de ieșire, mamografie sau raport histopatologic.
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border hover:bg-sage-50/40 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    doc.is_demo 
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' 
                      : 'bg-petal-100 dark:bg-petal-900/40 text-petal-700 dark:text-petal-300'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {doc.file_name}
                      </p>
                      {doc.is_demo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {new Date(doc.uploaded_at).toLocaleDateString('ro-RO')} • {Math.round((doc.file_size_bytes || 200000) / 1024)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      if (doc.file_data) {
                        const link = document.createElement('a');
                        link.href = doc.file_data;
                        link.download = doc.file_name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        alert(`Descărcare document: ${doc.file_name}`);
                      }
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-sage-600 hover:bg-white dark:hover:bg-darkbg-surface transition-colors"
                    title="Descarcă documentul"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {onDeleteDocument && (
                    <button
                      onClick={() => {
                        if (confirm(`Sigur dorești să ștergi documentul "${doc.file_name}" din dosar?`)) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Șterge documentul din dosar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingMilestone && (
        <MilestoneModal
          milestone={editingMilestone === 'new' ? undefined : editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSave={handleSaveMilestone}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-xl">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Încarcă Document Medical Propriu
            </h3>
            <p className="text-[11px] text-gray-500 mb-3">
              Documentele sunt salvate doar pe acest dispozitiv.
            </p>
            <form onSubmit={handleUploadFile} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Alege fișierul (PDF sau Poză):
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedRealFile(file);
                      if (!docName.trim()) {
                        setDocName(file.name);
                      }
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sage-100 file:text-sage-800 dark:file:bg-sage-900/40 dark:file:text-sage-300 hover:file:bg-sage-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Denumire fișier / descriere:
                </label>
                <input
                  type="text"
                  placeholder="ex: Mamografie_Control_Octombrie.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border focus:outline-none focus:border-sage-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Categorie document:
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border focus:outline-none focus:border-sage-500"
                >
                  <option value="buletin_histopatologic">Buletin Histopatologic</option>
                  <option value="bilet_iesire">Bilet de Externare</option>
                  <option value="mamografie_control">Mamografie / Ecografie de Control</option>
                  <option value="analize_sange">Analize de Sânge</option>
                  <option value="alta">Alt Document Medical</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRealFile(null);
                    setShowUploadModal(false);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300 text-xs font-medium"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-semibold shadow-xs"
                >
                  Salvează în Dosar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
