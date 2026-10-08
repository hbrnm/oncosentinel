import React from 'react';
import { X, AlertCircle, Phone, PhoneCall } from 'lucide-react';
import { PatientProfile } from '../types';

interface RedFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onOpenHelp?: () => void;
}

export const RedFlagsModal: React.FC<RedFlagsModalProps> = ({ isOpen, onClose, profile, onOpenHelp }) => {
  if (!isOpen) return null;

  // Text aprobat de proprietară (docs/rescriere-etapa0.md, partea a treia)
  const groups = [
    {
      heading: 'Sună la 112',
      tone: 'urgent',
      flags: [
        { title: 'Respirație grea apărută brusc sau durere în piept', note: 'Pot fi semnele unui cheag de sânge ajuns la plămâni.' },
        { title: 'Semne de accident vascular cerebral', note: 'Vorbire neclară, vedere încețoșată brusc, amorțeală bruscă la față, braț sau picior.' },
        { title: 'Umflare bruscă a feței, a buzelor sau a gâtului', note: 'Mai ales cu greutate la respirat: poate fi o reacție alergică.' }
      ]
    },
    {
      heading: 'Anunță repede medicul',
      tone: 'soon',
      flags: [
        { title: 'Durere sau umflare la un singur picior', note: 'Mai ales la gambă: poate fi un cheag de sânge.' },
        { title: 'Orice sângerare vaginală neobișnuită', note: 'Ori scurgere cu sânge sau maronie, mai ales după menopauză.' },
        { title: 'Schimbări ale vederii', note: '' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-darkbg-border overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-rose-50/90 dark:bg-darkbg-card p-5 border-b border-rose-100 dark:border-darkbg-border flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Semnale de alarmă
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                Când suni la 112 și când anunți repede medicul
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-surface flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors border border-gray-100 dark:border-darkbg-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          <p className="text-xs text-gray-700 dark:text-gray-200 bg-sage-50 dark:bg-sage-900/30 p-3 rounded-2xl border border-sage-200/80 dark:border-sage-800/40">
            <strong>Notă de liniște:</strong> lista e aici ca să știi ce să faci, dacă va fi nevoie. Nu înseamnă că ți se va întâmpla.
          </p>

          {groups.map((group) => (
            <section key={group.heading} className="space-y-2">
              <h3 className={`text-sm font-bold flex items-center gap-1.5 ${group.tone === 'urgent' ? 'text-rose-700 dark:text-rose-300' : 'text-ink dark:text-white'}`}>
                {group.tone === 'urgent' ? <PhoneCall className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {group.heading}
              </h3>
              {group.flags.map((flag) => (
                <div
                  key={flag.title}
                  className={`p-3.5 rounded-2xl border ${group.tone === 'urgent' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' : 'bg-gray-50 dark:bg-darkbg-card border-gray-200/80 dark:border-darkbg-border'}`}
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{flag.title}</p>
                  {flag.note && <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">{flag.note}</p>}
                </div>
              ))}
            </section>
          ))}

          <p className="text-[11px] text-ink-soft dark:text-gray-400 italic">
            Surse: prospectul tamoxifenului; Macmillan Cancer Support și Breast Cancer Now, paginile despre tamoxifen.
          </p>
        </div>

        {/* Footer Contact Actions */}
        <div className="p-4 bg-gray-50 dark:bg-darkbg-card border-t border-gray-100 dark:border-darkbg-border grid grid-cols-2 gap-2.5">
          <a
            href="tel:112"
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Apelează 112 (Urgențe)</span>
          </a>

          <a
            href={`mailto:${profile.oncologist_email || ''}?subject=Semnal%20alarm%C4%83%20OncoSentinel`}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Contactează Medicul</span>
          </a>
          {onOpenHelp && (
            <button
              type="button"
              onClick={onOpenHelp}
              className="col-span-2 text-xs font-semibold text-sage-deep dark:text-sage-300 underline py-1"
            >
              Alte forme de ajutor și sprijin
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
