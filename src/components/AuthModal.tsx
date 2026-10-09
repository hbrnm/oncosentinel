import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Download, Upload, Trash2, Lock } from 'lucide-react';
import { backupService } from '../lib/backupService';
import { vault } from '../lib/vault';
import { lastBackupText } from '../lib/backupReminder';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Aplicația funcționează doar local: fereastra explică unde stau datele și oferă copie de siguranță.
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => vault.isEnabled());
  const [choosingPin, setChoosingPin] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [pinAgain, setPinAgain] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pinBusy, setPinBusy] = useState<boolean>(false);
  const [lastBackup, setLastBackup] = useState<string>(() => lastBackupText());

  // Fereastra rămâne montată: data ultimei copii se recalculează la fiecare deschidere („azi” devine „ieri”)
  useEffect(() => {
    if (isOpen) setLastBackup(lastBackupText());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    backupService.exportCompleteBackup();
    setLastBackup(lastBackupText());
  };

  const handleEnablePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return setPinError('PIN-ul are 4 cifre.');
    if (pin !== pinAgain) return setPinError('PIN-urile nu se potrivesc. Scrie-l din nou.');
    setPinBusy(true);
    try {
      await vault.enable(pin);
      setPinEnabled(true);
      setChoosingPin(false);
      setPin('');
      setPinAgain('');
      setPinError('');
    } catch {
      setPinError('Nu am putut activa PIN-ul. Încearcă din nou; datele tale au rămas neschimbate.');
    } finally {
      setPinBusy(false);
    }
  };

  const handleDisablePin = async () => {
    if (!confirm('Scoți PIN-ul? Datele vor rămâne pe telefon necriptate.')) return;
    try {
      await vault.disable();
      setPinEnabled(false);
    } catch {
      setPinError('Nu am putut scoate PIN-ul: spațiul de pe telefon e plin. Datele tale au rămas criptate; șterge câteva documente și încearcă din nou.');
    }
  };

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

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {pinEnabled
              ? 'Datele sunt criptate cu PIN-ul tău. Copia de siguranță pe care o descarci nu e criptată: păstreaz-o într-un loc sigur.'
              : 'Datele nu sunt criptate: oricine poate deschide acest browser le poate vedea. Folosește un telefon blocat cu parolă sau amprentă și nu folosi aplicația pe un dispozitiv comun.'}
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Spațiul e limitat (aproximativ 5 MB în total, documente de cel mult 1,5 MB fiecare). Dacă se umple, aplicația îți spune și poți șterge documente din Cronologie.
          </p>

          <p className="text-xs font-semibold text-ink dark:text-white">{lastBackup}</p>

          <button
            onClick={handleExport}
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

          {/* Protejează cu PIN (texte aprobate, docs/etapa4-texte.md) */}
          <section aria-labelledby="pin-title" className="p-3.5 rounded-2xl border border-sage-200 dark:border-darkbg-border bg-sage-50/60 dark:bg-darkbg-card space-y-2.5">
            <h4 id="pin-title" className="text-xs font-bold text-ink dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sage-deep" /> Protejează cu PIN
            </h4>
            {pinEnabled ? (
              <>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  PIN-ul e activ. Aplicația îl cere la fiecare deschidere și după 5 minute în fundal.
                </p>
                <button type="button" onClick={handleDisablePin} className="w-full py-2 rounded-xl border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-ink dark:text-gray-100">
                  Scoate PIN-ul
                </button>
                {pinError && <p role="alert" className="text-[11px] text-rose-700 dark:text-rose-300">{pinError}</p>}
              </>
            ) : !choosingPin ? (
              <>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Datele tale de pe acest telefon vor fi criptate cu un PIN de 4 cifre. Fără PIN nu le poate citi nimeni, nici tu. Dacă îl uiți, datele nu se pot recupera decât dintr-o copie de siguranță. Descarcă o copie înainte.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={handleExport} className="py-2 rounded-xl border border-sage-200 dark:border-darkbg-border text-xs font-semibold text-sage-800 dark:text-sage-200">
                    Descarcă o copie
                  </button>
                  <button type="button" onClick={() => setChoosingPin(true)} className="py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold">
                    Alege PIN-ul
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEnablePin} className="space-y-2">
                <label className="block text-[11px] font-semibold text-ink-soft">
                  PIN nou (4 cifre)
                  <input type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinError(''); }} className="mt-1 w-full px-3 py-2 rounded-xl text-sm tracking-[0.4em] bg-white dark:bg-darkbg-surface border border-gray-200 dark:border-darkbg-border text-ink dark:text-white" />
                </label>
                <label className="block text-[11px] font-semibold text-ink-soft">
                  Scrie-l încă o dată
                  <input type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={pinAgain} onChange={(e) => { setPinAgain(e.target.value.replace(/\D/g, '')); setPinError(''); }} className="mt-1 w-full px-3 py-2 rounded-xl text-sm tracking-[0.4em] bg-white dark:bg-darkbg-surface border border-gray-200 dark:border-darkbg-border text-ink dark:text-white" />
                </label>
                {pinError && <p role="alert" className="text-[11px] text-rose-700 dark:text-rose-300">{pinError}</p>}
                <button type="submit" disabled={pinBusy} className="w-full py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold disabled:opacity-50">
                  Activează PIN-ul
                </button>
              </form>
            )}
          </section>

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
