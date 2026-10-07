import React from 'react';
import { X, AlertCircle, Phone, BookOpen, HeartPulse } from 'lucide-react';
import { SymptomLog } from '../types';

interface SevereSymptomModalProps {
  symptoms: Partial<SymptomLog>;
  onClose: () => void;
  onNavigateToGuide?: () => void;
}

export const SevereSymptomModal: React.FC<SevereSymptomModalProps> = ({ symptoms, onClose, onNavigateToGuide }) => {
  // Determine which symptoms triggered the alert
  const getAlerts = () => {
    const alerts = [];
    if ((symptoms.hot_flashes_intensity || 0) >= 4) {
      alerts.push({
        title: 'Bufeuri Severe',
        advice: 'Evită hainele strâmte și materialele sintetice. Ceaiul de salvie rece te poate ajuta. Nu ezita să contactezi medicul dacă îți afectează somnul major.'
      });
    }
    if ((symptoms.joint_pain_level || 0) >= 4 || (symptoms.bone_pain_level || 0) >= 4) {
      alerts.push({
        title: 'Dureri Articulare / Osoase',
        advice: 'Este o reacție des întâlnită la medicația hormonală. Mișcarea ușoară (stretching) ajută la "ungerea" articulațiilor, însă discută cu medicul pentru un antiinflamator adecvat dacă durerea devine insuportabilă.'
      });
    }
    if ((symptoms.nausea_level || 0) >= 4) {
      alerts.push({
        title: 'Greață',
        advice: 'Încearcă să mănânci porții mici și dese (ex: biscuiți uscați). Ceaiul de ghimbir din secțiunea Ghiduri face minuni.'
      });
    }
    if ((symptoms.fatigue_level || 0) >= 4) {
      alerts.push({
        title: 'Oboseală Extremă',
        advice: 'Ascultă-ți corpul și odihnește-te. Dacă această oboseală persistă mai mult de câteva zile la rând, medicul tău ar trebui informat pentru a verifica analizele de sânge (ex: hemograma, fierul).'
      });
    }
    if ((symptoms.brain_fog || 0) >= 4) {
      alerts.push({
        title: 'Ceață Mentală',
        advice: 'Scade ritmul astăzi. Este un efect cunoscut (chemobrain/tamoxifen fog). Notează-ți lucrurile importante ca să nu te stresezi amintindu-ți-le.'
      });
    }
    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) return null; // Fallback just in case

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-darkbg-card rounded-3xl p-5 shadow-2xl relative animate-fade-in border-t-4 border-rose-400">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-darkbg-body text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alerta Simptome</h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Ai raportat disconfort sever</p>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto space-y-4 mb-5 pr-1">
          {alerts.map((alert, idx) => (
            <div key={idx} className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-3">
              <h3 className="text-xs font-bold text-orange-800 dark:text-orange-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {alert.title}
              </h3>
              <p className="text-[11.5px] leading-relaxed text-gray-700 dark:text-gray-300">
                {alert.advice}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {onNavigateToGuide && (
            <button 
              onClick={() => { onClose(); onNavigateToGuide(); }}
              className="w-full h-10 bg-sage-50 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:bg-sage-100"
            >
              <BookOpen className="w-4 h-4" /> Citește Ghidurile de Suport
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full h-10 bg-gray-100 dark:bg-darkbg-body text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors hover:bg-gray-200"
          >
            Am înțeles
          </button>
        </div>

      </div>
    </div>
  );
};
