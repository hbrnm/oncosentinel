import React from 'react';
import { CalendarHeart, X, MapPin, Clock } from 'lucide-react';

interface AppointmentItem {
  id: string;
  date: string;
  time?: string;
  specialty: string;
  doctor?: string;
  center?: string;
  status: 'upcoming' | 'done' | 'cancelled';
}

interface AppointmentBannerProps {
  appointment?: AppointmentItem | null;
  onDismiss: () => void;
  onClick?: () => void;
}

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return null;
  const target = new Date(dateStr + (dateStr.length <= 10 ? 'T00:00:00' : ''));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (isNaN(target.getTime())) return null;
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

export const AppointmentBanner: React.FC<AppointmentBannerProps> = ({
  appointment,
  onDismiss,
  onClick
}) => {
  if (!appointment) return null;
  const d = daysUntil(appointment.date);
  if (d === null || d < 0 || d > 1) return null;
  const isToday = d === 0;
  const label = isToday ? 'Azi ai o programare' : 'Mâine ai o programare';

  // Format Romanian date (ex: Miercuri, 7 Octombrie 2026)
  const dateObj = new Date(appointment.date + (appointment.date.length <= 10 ? 'T00:00:00' : ''));
  const formattedFullDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : appointment.date;

  // Clean doctor name if it's "DR..", empty, or ill-formatted
  const rawDoctor = appointment.doctor?.trim();
  const cleanDoctor = rawDoctor && rawDoctor !== 'DR..' && rawDoctor !== 'Dr..' && rawDoctor !== 'Dr.' && rawDoctor !== 'DR.'
    ? rawDoctor
    : null;

  return (
    <div className="animate-fade-in blush-card rounded-3xl p-4 relative overflow-hidden shadow-xs border border-[#EAE5DE] dark:border-darkbg-border">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="tap-scale absolute top-3 right-3 w-7 h-7 rounded-full bg-white/60 dark:bg-darkbg-card/60 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
        aria-label="Închide"
      >
        <X className="w-3.5 h-3.5 text-[#C99A9D]" />
      </button>

      <div
        onClick={onClick}
        className="flex items-start gap-3.5 pr-6 cursor-pointer"
      >
        <span className="shrink-0 w-11 h-11 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-xs">
          <CalendarHeart className="w-5 h-5 text-[#C99A9D]" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-darkbg-card/80 text-[11px] font-semibold text-[#C99A9D] capitalize">
              {label}
            </span>
          </div>

          <p className="text-[14px] text-[#3A332E] dark:text-gray-200 mt-1 font-semibold leading-tight">
            {appointment.specialty || 'Control Oncologic'}
          </p>

          <p className="text-[12px] text-[#6B6259] dark:text-gray-300 font-medium capitalize mt-0.5">
            {formattedFullDate}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11.5px] text-[#6B6259] dark:text-gray-400">
            {appointment.time && (
              <span className="flex items-center gap-1 font-medium bg-white/50 dark:bg-darkbg-card/50 px-2 py-0.5 rounded-lg">
                <Clock className="w-3 h-3 text-[#C99A9D]" /> {appointment.time}
              </span>
            )}
            {cleanDoctor && (
              <span className="font-medium">{cleanDoctor}</span>
            )}
            {appointment.center && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C99A9D]" /> {appointment.center}
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#C99A9D] font-medium mt-2">
            Apasă pentru detalii și întrebări pentru medic →
          </p>
        </div>
      </div>
    </div>
  );
};
