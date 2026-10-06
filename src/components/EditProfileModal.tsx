import React, { useState } from 'react';
import { X, User, Calendar, Clock, Pill, Mail, Save, Check } from 'lucide-react';
import { PatientProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onSave: (updated: PatientProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [fullName, setFullName] = useState(profile.full_name);
  const [reminderTime, setReminderTime] = useState(profile.daily_reminder_time);
  const [stock, setStock] = useState(profile.pill_stock_count);
  const [startDate, setStartDate] = useState(profile.tamoxifen_start_date);
  const [oncologistEmail, setOncologistEmail] = useState(profile.oncologist_email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      full_name: fullName,
      daily_reminder_time: reminderTime,
      pill_stock_count: Number(stock),
      tamoxifen_start_date: startDate,
      oncologist_email: oncologistEmail
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-darkbg-border mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Setări Profil & Tratament
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
              Nume și prenume pacientă:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Oră reminder zilnic:
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Stoc pastile în cutie:
              </label>
              <div className="relative">
                <Pill className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full pl-9 pr-2 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
              Data de începere a Tamoxifenului:
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
              E-mail medic oncolog (pentru rapoarte):
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={oncologistEmail}
                onChange={(e) => setOncologistEmail(e.target.value)}
                placeholder="dr.oncolog@exemplu.ro"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-md shadow-sage-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profil Salvat!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvează Modificările</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
