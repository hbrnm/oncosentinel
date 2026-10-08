import React, { useState, useEffect } from 'react';
import { X, HeartHandshake, Send, Check, ShieldCheck, Heart, User } from 'lucide-react';
import { PatientProfile } from '../types';
import { MOOD_LINES, HELP_IDEAS, buildSupporterMessage, SHARE_COPIED, SHARE_FAILED } from '../data/circle';

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
      name: '',
      relationship: 'Partener/ă',
      phone: '',
      notifyOnMissedDose: true
    };
  });
  const [moodLine, setMoodLine] = useState<string>(MOOD_LINES[1].line);
  const [ideas, setIdeas] = useState<string[]>([]);
  // Textul modificat de pacientă; se resetează când schimbă starea sau ideile
  const [editedMessage, setEditedMessage] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem('navimed_supporter', JSON.stringify(supporter));
  }, [supporter]);

  if (!isOpen) return null;

  const patientFirstName = profile.full_name?.trim() ? profile.full_name.trim().split(' ')[0] : '';
  const message = editedMessage ?? buildSupporterMessage(supporter.name, patientFirstName, moodLine, ideas);

  const toggleIdea = (idea: string) => {
    setIdeas(ideas.includes(idea) ? ideas.filter((i) => i !== idea) : [...ideas, idea]);
    setEditedMessage(null);
  };

  // Nimic nu pleacă automat: meniul de partajare al telefonului, altfel copiere
  const handleShare = async () => {
    setShareNotice('');
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') setShareNotice(SHARE_FAILED);
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setShareNotice(SHARE_COPIED);
    } catch {
      setShareNotice(SHARE_FAILED);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('navimed_supporter', JSON.stringify(supporter));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div role="dialog" aria-modal="true" aria-labelledby="supporter-title" className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl relative overflow-hidden">
        
        {/* Soft decorative glow */}
        <div className="absolute w-40 h-40 bg-petal-100 dark:bg-petal-900/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>

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
          <div className="w-10 h-10 rounded-2xl bg-petal-300 dark:bg-petal-900/60 text-petal-950 dark:text-petal-100 flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5 text-petal-700 dark:text-petal-200" />
          </div>
          <div>
            <h3 id="supporter-title" className="text-sm font-bold text-gray-900 dark:text-white">
              Cercul de Sprijin
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Conectează o persoană dragă de încredere
            </p>
          </div>
        </div>

        {/* Mesajul către persoana de sprijin: îl compune și îl trimite ea */}
        <div className="max-h-[60vh] overflow-y-auto -mx-1 px-1 mb-4 space-y-3">
          <fieldset>
            <legend className="text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Cum mă simt azi</legend>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_LINES.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  aria-pressed={moodLine === m.line}
                  onClick={() => { setMoodLine(m.line); setEditedMessage(null); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${moodLine === m.line ? 'bg-sage-deep text-white' : 'bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-gray-200'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Cum mă poți ajuta</legend>
            <div className="space-y-1">
              {HELP_IDEAS.map((idea) => (
                <label key={idea} className="flex items-start gap-2 text-[12px] text-ink dark:text-gray-200 cursor-pointer">
                  <input type="checkbox" checked={ideas.includes(idea)} onChange={() => toggleIdea(idea)} className="mt-0.5 rounded" />
                  <span>{idea}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block mb-1.5">Mesajul tău (îl poți schimba)</span>
            <textarea
              value={message}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows={6}
              className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-gray-100 leading-relaxed"
            />
          </label>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-2.5 rounded-xl bg-sage-deep hover:bg-sage-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Trimite
          </button>
          {shareNotice && <p role="status" className="text-[11px] text-ink dark:text-gray-200">{shareNotice}</p>}
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
