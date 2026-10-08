import React from 'react';
import { X, LifeBuoy, PhoneCall, AlertCircle, Mail, Wind, Sparkles, HeartHandshake, Phone } from 'lucide-react';
import { PatientProfile } from '../types';
import { HELP_LINES } from '../data/helpLines';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onOpenRedFlags: () => void;
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenSupporter: () => void;
  note?: string;
}

// Fereastra „Ajutor”: urgență, echipa medicală, liniștire și sprijin, într-un singur loc
export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenRedFlags,
  onOpenBreathing,
  onOpenGrounding,
  onOpenSupporter,
  note
}) => {
  if (!isOpen) return null;

  // Închide „Ajutor” și deschide fereastra aleasă
  const openInstead = (open: () => void) => () => {
    onClose();
    open();
  };

  const optionClass =
    'tap-scale w-full flex items-center gap-3 p-3.5 rounded-2xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-left hover:bg-sage-50 dark:hover:bg-darkbg-surface transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="bg-cream dark:bg-darkbg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-warmborder dark:border-darkbg-border overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-warmborder dark:border-darkbg-border flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage text-white flex items-center justify-center shadow-xs">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 id="help-title" className="text-lg font-bold text-ink dark:text-white leading-tight">Ajutor</h2>
              <p className="text-xs text-ink-soft dark:text-gray-300 mt-0.5">Nu ești singură. Alege ce ți se potrivește acum.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Închide"
            className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white border border-warmborder dark:border-darkbg-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {note && <p className="text-sm font-semibold text-sage-deep dark:text-sage-300">{note}</p>}
          {/* 1. Urgență */}
          <section className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Ești în pericol acum?
            </h3>
            <p className="text-xs text-rose-800/90 dark:text-rose-200/90 mt-1 leading-relaxed">
              Dacă ai brusc respirație grea, durere în piept, semne de accident vascular sau te gândești să-ți faci rău, sună acum la 112.
            </p>
            <a
              href="tel:112"
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold"
            >
              <PhoneCall className="w-4 h-4" /> Sună la 112
            </a>
            <button
              type="button"
              onClick={openInstead(onOpenRedFlags)}
              className="mt-2 w-full text-xs font-semibold text-rose-800 dark:text-rose-200 underline"
            >
              Vezi semnalele de alarmă
            </button>
          </section>

          {/* 2. Echipa medicală */}
          <section>
            <h3 className="micro-label mb-2">Echipa ta medicală</h3>
            {profile.oncologist_email ? (
              <a href={`mailto:${profile.oncologist_email}`} className={optionClass}>
                <Mail className="w-5 h-5 text-sage-deep shrink-0" />
                <span className="text-sm font-semibold text-ink dark:text-gray-100">Scrie-i medicului oncolog</span>
              </a>
            ) : (
              <p className="text-xs text-ink-soft dark:text-gray-400">
                Adaugă în Profil adresa de e-mail a medicului oncolog, ca să-i poți scrie de aici.
              </p>
            )}
            <p className="text-xs text-ink-soft dark:text-gray-400 mt-2 leading-relaxed">
              Psihologul sau asistentul social din spitalul tău oncologic te poate îndruma spre sprijin aproape de tine.
            </p>
          </section>

          {/* 3. Linii de sprijin (doar cele confirmate) */}
          {HELP_LINES.length > 0 && (
            <section>
              <h3 className="micro-label mb-2">Vrei să vorbești cu cineva?</h3>
              <div className="space-y-2">
                {HELP_LINES.map((line) => (
                  <a key={line.phone} href={`tel:${line.phone.replace(/\s/g, '')}`} className={optionClass}>
                    <Phone className="w-5 h-5 text-sage-deep shrink-0" />
                    <span>
                      <span className="block text-sm font-semibold text-ink dark:text-gray-100">{line.name}: {line.phone}</span>
                      <span className="block text-xs text-ink-soft dark:text-gray-400">{line.description} {line.hours}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 4. Liniștire */}
          <section>
            <h3 className="micro-label mb-2">Un moment de liniște</h3>
            <div className="space-y-2">
              <button type="button" onClick={openInstead(onOpenBreathing)} className={optionClass}>
                <Wind className="w-5 h-5 text-sage-deep shrink-0" />
                <span className="text-sm font-semibold text-ink dark:text-gray-100">Respirație lentă</span>
              </button>
              <button type="button" onClick={openInstead(onOpenGrounding)} className={optionClass}>
                <Sparkles className="w-5 h-5 text-sage-deep shrink-0" />
                <span className="text-sm font-semibold text-ink dark:text-gray-100">Exercițiul 5-4-3-2-1, ca să revii în prezent</span>
              </button>
            </div>
          </section>

          {/* 5. Persoana de sprijin */}
          <section>
            <h3 className="micro-label mb-2">Cineva drag</h3>
            <button type="button" onClick={openInstead(onOpenSupporter)} className={optionClass}>
              <HeartHandshake className="w-5 h-5 text-blush-deep shrink-0" />
              <span className="text-sm font-semibold text-ink dark:text-gray-100">Trimite un mesaj persoanei tale de sprijin</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
