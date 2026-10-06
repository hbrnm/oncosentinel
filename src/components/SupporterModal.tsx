import React, { useState, useEffect } from 'react';
import { X, HeartHandshake, Phone, MessageCircle, Send, Check, ShieldCheck, Heart, User } from 'lucide-react';
import { PatientProfile } from '../types';

interface SupporterData {
  name: string;
  relationship: string;
  phone: string;
  notifyOnMissedDose: boolean;
}

interface SupporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
}

export const SupporterModal: React.FC<SupporterModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const [supporter, setSupporter] = useState<SupporterData>(() => {
    const saved = localStorage.getItem('navimed_supporter');
    return saved ? JSON.parse(saved) : {
      name: 'Andrei',
      relationship: 'Soț',
      phone: '',
      notifyOnMissedDose: true
    };
  });
  const [messageType, setMessageType] = useState<'stare_buna' | 'memento_doza'>('stare_buna');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem('navimed_supporter', JSON.stringify(supporter));
  }, [supporter]);

  if (!isOpen) return null;

  // Calculate days on Tamoxifen
  const startDate = new Date(profile.tamoxifen_start_date || '2026-09-01');
  const now = new Date();
  const diffDays = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));

  const patientFirstName = profile.full_name.split(' ')[0] || 'Eu';

  const currentMessage = messageType === 'stare_buna'
    ? `Bună, ${supporter.name || 'dragă'}! Sunt în ziua ${diffDays} de tratament și azi am o stare bună. Îți mulțumesc din suflet că îmi ești aproape! 🌸 - ${patientFirstName}`
    : `Bună, ${supporter.name || 'dragă'}! Te rog să-mi amintești să iau doza de Tamoxifen (20mg) de astăzi dacă nu am luat-o încă. Mulțumesc că ai grijă de mine! 💊🌸 - ${patientFirstName}`;

  const handleOpenWhatsApp = () => {
    const cleanPhone = supporter.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(currentMessage);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleOpenSMS = () => {
    const cleanPhone = supporter.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(currentMessage);
    window.open(`sms:${cleanPhone}?body=${encoded}`, '_self');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('navimed_supporter', JSON.stringify(supporter));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl relative overflow-hidden">
        
        {/* Soft decorative glow */}
        <div className="absolute w-40 h-40 bg-petal-100 dark:bg-petal-900/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-petal-300 dark:bg-petal-900/60 text-petal-950 dark:text-petal-100 flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5 text-petal-700 dark:text-petal-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Cercul de Sprijin
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Conectează o persoană dragă de încredere
            </p>
          </div>
        </div>

        {/* 1-Click Message Box with Type Selector */}
        <div className="p-3.5 rounded-2xl bg-petal-50/80 dark:bg-darkbg-card border border-petal-100 dark:border-darkbg-border mb-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-petal-800 dark:text-petal-300 uppercase tracking-wider block">
              Trimite un mesaj rapid:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMessageType('stare_buna')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  messageType === 'stare_buna'
                    ? 'bg-petal-600 text-white shadow-2xs'
                    : 'bg-white/80 dark:bg-darkbg-surface text-gray-600 dark:text-gray-400'
                }`}
              >
                🌸 Stare bună
              </button>
              <button
                type="button"
                onClick={() => setMessageType('memento_doza')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  messageType === 'memento_doza'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white/80 dark:bg-darkbg-surface text-gray-600 dark:text-gray-400'
                }`}
              >
                💊 Memento Doză
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 italic bg-white dark:bg-darkbg-surface p-2.5 rounded-xl border border-gray-100 dark:border-darkbg-border leading-relaxed">
            "{currentMessage}"
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleOpenWhatsApp}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleOpenSMS}
              className="py-2 px-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>SMS Direct</span>
            </button>
          </div>
        </div>

        {/* Supporter Config Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Nume persoană:
              </label>
              <input
                type="text"
                value={supporter.name}
                onChange={(e) => setSupporter({ ...supporter, name: e.target.value })}
                placeholder="ex: Andrei"
                className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Relație:
              </label>
              <select
                value={supporter.relationship}
                onChange={(e) => setSupporter({ ...supporter, relationship: e.target.value })}
                className="w-full px-2 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
              >
                <option value="Soț">Soț / Partener</option>
                <option value="Fiică">Fiică</option>
                <option value="Fiu">Fiu</option>
                <option value="Mamă">Mamă</option>
                <option value="Soră">Soră</option>
                <option value="Prietenă">Prietenă apropiată</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
              Număr de telefon:
            </label>
            <input
              type="tel"
              value={supporter.phone}
              onChange={(e) => setSupporter({ ...supporter, phone: e.target.value })}
              placeholder="ex: 0722123456"
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
            />
          </div>

          <label className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={supporter.notifyOnMissedDose}
              onChange={(e) => setSupporter({ ...supporter, notifyOnMissedDose: e.target.checked })}
              className="rounded text-sage-600 focus:ring-sage-500"
            />
            <span>Reamintește-i discret dacă omit pastila 2 zile la rând</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvat cu succes!</span>
              </>
            ) : (
              <span>Salvează Persoana de Sprijin</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
