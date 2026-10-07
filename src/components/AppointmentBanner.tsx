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

  return (
    <div className="animate-fade-in blush-card rounded-3xl p-4 relative overflow-hidden">
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
        className="flex items-start gap-3 pr-6 cursor-pointer"
      >
        <span className="shrink-0 w-11 h-11 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-xs">
          <CalendarHeart className="w-5 h-5 text-[#C99A9D]" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[15px] text-[#C99A9D] font-semibold">
            {label}
          </p>
          <p className="text-[13px] text-[#3A332E] dark:text-gray-200 mt-0.5 font-semibold">
            {appointment.specialty}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-[#6B6259] dark:text-gray-400">
            {appointment.time && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> {appointment.time}
              </span>
            )}
            {appointment.doctor && <span>{appointment.doctor}</span>}
            {appointment.center && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C99A9D]" /> {appointment.center}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
