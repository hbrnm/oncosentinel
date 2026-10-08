import React from 'react';
import { X, AlertCircle, Phone, PhoneCall, CheckCircle } from 'lucide-react';
import { PatientProfile } from '../types';

interface RedFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
}

export const RedFlagsModal: React.FC<RedFlagsModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const redFlags = [
    {
      title: 'Tromboză Venoasă Profundă (TVP)',
      symptoms: 'Umflare dureroasă la un singur picior/gambă, roșeață caldă sau sensibilitate la atingere în mușchiul gambei.',
      action: 'Necesită ecografie Doppler de urgență. Contactează medicul imediat.'
    },
    {
      title: 'Tromboembolism Pulmonar (TEP)',
      symptoms: 'Sufocare bruscă, lipsă bruscă de aer, durere ascuțită în piept la respirație sau tuse inexplicabilă.',
      action: 'Urgență medicală majoră. Apelează direct 112.'
    },
    {
      title: 'Sângerare Vaginală Anormală',
      symptoms: 'Spotting, sângerare între menstre sau orice sângerare dacă ești la menopauză.',
      action: 'Tamoxifenul stimulează endometrul. Anunță medicul ginecolog/oncolog pentru ecografie transvaginală.'
    },
    {
      title: 'Tulburări Vizuale Acute',
      symptoms: 'Scădere bruscă a acuității vizuale, vedere încețoșată persistentă.',
      action: 'Necesită control oftalmologic pentru evaluarea retinei.'
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
                Ghid de Semnale de Alarmă
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                Când trebuie să contactezi medicul de urgență (Red Flags)
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
            <strong>Notă de liniște:</strong> În marea majoritate a cazurilor de DCIS, Tamoxifenul este bine tolerat. Aceste semnale sunt măsuri de precauție pentru protecția ta maximă.
          </p>

          <div className="space-y-3">
            {redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg-card border border-gray-200/80 dark:border-darkbg-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    {flag.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                  <strong>Ce simți:</strong> {flag.symptoms}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-2.5 py-1 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="font-medium">{flag.action}</span>
                </div>
              </div>
            ))}
          </div>
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
        </div>

      </div>
    </div>
  );
};
