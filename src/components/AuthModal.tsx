import React from 'react';
import { X, ShieldCheck, Download, Upload, Trash2 } from 'lucide-react';
import { backupService } from '../lib/backupService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Aplicația funcționează doar local: fereastra explică unde stau datele și oferă copie de siguranță.
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDeleteAll = () => {
    if (confirm('Sigur ștergi toate datele de pe acest dispozitiv (profil, doze, jurnal, documente)? Nu pot fi recuperate fără o copie de siguranță descărcată înainte.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl relative overflow-hidden">

        {/* Soft decorative glow */}
        <div className="absolute w-40 h-40 bg-sage-100 dark:bg-sage-900/20 rounded-full blur-3xl -top-10 -left-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Închide"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Siguranța datelor
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Datele tale stau doar pe acest dispozitiv
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Profilul, dozele, jurnalul și documentele sunt salvate doar în acest browser, nu în cloud. Dacă ștergi datele browserului sau schimbi telefonul, le pierzi. Descarcă din când în când o copie de siguranță și păstreaz-o într-un loc sigur: conține date medicale.
          </p>

          <button
            onClick={() => backupService.exportCompleteBackup()}
            className="w-full py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Descarcă o copie de siguranță</span>
          </button>

          <label className="w-full py-2 rounded-xl border border-sage-200 dark:border-darkbg-border hover:bg-sage-50 text-sage-800 dark:text-sage-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restaurează dintr-o copie</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  backupService.importBackupFromFile(file);
                }
              }}
            />
          </label>

          <button
            onClick={handleDeleteAll}
            className="w-full py-2 rounded-xl border border-gray-200 dark:border-darkbg-border hover:bg-gray-100 dark:hover:bg-darkbg-card text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Șterge toate datele de pe acest dispozitiv</span>
          </button>
        </div>

      </div>
    </div>
  );
};
