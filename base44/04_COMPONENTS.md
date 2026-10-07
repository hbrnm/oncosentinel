\# 04 — Componente custom

\#\# \`src/components/AppLayout.jsx\`

\`\`\`jsx  
import React from "react";  
import { Outlet } from "react-router-dom";  
import BottomNav from "@/components/BottomNav";

export default function AppLayout() {  
  return (  
    \<div className="app-shell flex flex-col"\>  
      \<main className="flex-1 pb-28"\>  
        \<Outlet /\>  
      \</main\>  
      \<BottomNav /\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/BottomNav.jsx\`

\`\`\`jsx  
import React from "react";  
import { NavLink } from "react-router-dom";  
import { Home, Pill, BookOpen, Library, User } from "lucide-react";

const TABS \= \[  
  { to: "/", label: "Astăzi", icon: Home, end: true },  
  { to: "/tratament", label: "Tratament", icon: Pill },  
  { to: "/jurnal", label: "Jurnal", icon: BookOpen },  
  { to: "/ghiduri", label: "Ghiduri", icon: Library },  
  { to: "/profil", label: "Profil", icon: User },  
\];

export default function BottomNav() {  
  return (  
    \<nav className="fixed bottom-0 left-1/2 \-translate-x-1/2 w-full max-w-\[440px\] z-50"\>  
      \<div className="mx-3 mb-3 organic-card rounded-\[28px\] px-2 py-2 flex items-center justify-around shadow-organic"\>  
        {TABS.map(({ to, label, icon: Icon, end }) \=\> (  
          \<NavLink key={to} to={to} end={end}  
            className={({ isActive }) \=\>  
              \`tap-scale flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 min-w-\[60px\] transition-colors duration-300 \${  
                isActive ? "text-sage-deep" : "text-ink-soft/60"  
              }\`  
            }  
          \>  
            {({ isActive }) \=\> (  
              \<\>  
                \<span className={\`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 \${  
                  isActive ? "bg-sage-soft scale-105" : "bg-transparent"  
                }\`}\>  
                  \<Icon className="w-\[18px\] h-\[18px\]" strokeWidth={isActive ? 2.4 : 2} /\>  
                \</span\>  
                \<span className="text-\[10px\] font-semibold tracking-wide"\>{label}\</span\>  
              \</\>  
            )}  
          \</NavLink\>  
        ))}  
      \</div\>  
    \</nav\>  
  );  
}  
\`\`\`

\#\# \`src/components/StatusBar.jsx\`

\`\`\`jsx  
import React from "react";  
import { Signal, Wifi, BatteryFull } from "lucide-react";

export default function StatusBar() {  
  return (  
    \<div className="flex items-center justify-between px-6 pt-3 pb-1 text-ink select-none"\>  
      \<span className="text-\[13px\] font-semibold tracking-tight"\>9:41\</span\>  
      \<div className="flex items-center gap-1.5"\>  
        \<Signal className="w-3.5 h-3.5" strokeWidth={2.2} /\>  
        \<Wifi className="w-3.5 h-3.5" strokeWidth={2.2} /\>  
        \<BatteryFull className="w-4 h-4" strokeWidth={2.2} /\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/MedicationHeroCard.jsx\`

\`\`\`jsx  
import React from "react";  
import { Check, ChevronRight } from "lucide-react";  
import { PillIcon } from "@/components/Botanical";  
import { nextDoseLabel } from "@/lib/onco";

export default function MedicationHeroCard({ medication, taken, onMarkTaken, onSeeDetails }) {  
  const time \= medication?.time\_of\_day || "08:00";  
  return (  
    \<div className="sage-card rounded-\[28px\] p-5 relative overflow-hidden"\>  
      \<div className="flex items-start justify-between gap-3"\>  
        \<div className="flex items-center gap-3.5 min-w-0"\>  
          \<div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-soft"\>  
            \<PillIcon className="w-9 h-9" /\>  
          \</div\>  
          \<div className="min-w-0"\>  
            \<h3 className="font-heading text-xl text-sage-deep leading-tight truncate"\>  
              {medication?.name || "Tamoxifen"}  
            \</h3\>  
            \<p className="text-\[13px\] text-ink-soft mt-0.5"\>  
              {medication?.dose || "20 mg"} • {medication?.frequency || "1 comprimat/zi"}  
            \</p\>  
          \</div\>  
        \</div\>  
        {taken ? (  
          \<span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage text-white text-\[11px\] font-semibold shadow-soft"\>  
            \<Check className="w-3.5 h-3.5" strokeWidth={3} /\> Azi • Luat  
          \</span\>  
        ) : (  
          \<span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 text-sage-deep text-\[11px\] font-semibold border border-sage/30"\>  
            De luat  
          \</span\>  
        )}  
      \</div\>  
      \<div className="mt-4 pt-4 border-t border-sage/15 flex items-center justify-between"\>  
        \<div\>  
          \<p className="micro-label"\>Următoarea doză\</p\>  
          \<p className="text-\[13px\] font-semibold text-ink mt-0.5"\>  
            {taken ? \`Mâine, \${time}\` : nextDoseLabel(time)}  
          \</p\>  
        \</div\>  
        {\!taken ? (  
          \<button onClick={onMarkTaken}  
            className="tap-scale inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-sage text-white text-\[13px\] font-semibold shadow-soft hover:bg-sage-deep transition-colors"\>  
            \<Check className="w-4 h-4" strokeWidth={2.5} /\> Marchează doza  
          \</button\>  
        ) : (  
          \<button onClick={onSeeDetails}  
            className="tap-scale inline-flex items-center gap-0.5 text-sage-deep text-\[13px\] font-semibold"\>  
            Vezi detalii \<ChevronRight className="w-4 h-4" /\>  
          \</button\>  
        )}  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/QuickActions.jsx\`

\`\`\`jsx  
import React from "react";  
import { useNavigate } from "react-router-dom";  
import { CalendarDays, FileText, Stethoscope, HeartHandshake } from "lucide-react";

const ACTIONS \= \[  
  { label: "Calendar\\ntratament", icon: CalendarDays, to: "/tratament", tint: "bg-sage-soft text-sage-deep" },  
  { label: "Ghiduri\\nmedicale", icon: FileText, to: "/ghiduri", tint: "bg-blush text-blush-deep" },  
  { label: "Medici și\\ncentre", icon: Stethoscope, to: "/profil", tint: "bg-sage-soft text-sage-deep" },  
  { label: "Resurse\\nutile", icon: HeartHandshake, to: "/ghiduri", tint: "bg-blush text-blush-deep" },  
\];

export default function QuickActions() {  
  const navigate \= useNavigate();  
  return (  
    \<div className="grid grid-cols-4 gap-2.5"\>  
      {ACTIONS.map(({ label, icon: Icon, to, tint }) \=\> {  
        const \[l1, l2\] \= label.split("\\n");  
        return (  
          \<button key={label} onClick={() \=\> navigate(to)}  
            className="tap-scale flex flex-col items-center gap-2.5 organic-card rounded-3xl p-3 pt-4 hover:shadow-soft transition-shadow"\>  
            \<span className={\`flex items-center justify-center w-12 h-12 rounded-2xl \${tint}\`}\>  
              \<Icon className="w-5 h-5" strokeWidth={2} /\>  
            \</span\>  
            \<span className="text-\[10.5px\] font-semibold text-ink leading-tight text-center"\>  
              {l1}\<br /\>{l2}  
            \</span\>  
          \</button\>  
        );  
      })}  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/MoodPicker.jsx\`

\`\`\`jsx  
import React from "react";  
import { MOODS, getMood } from "@/lib/onco";

export default function MoodPicker({ value, onChange, compact \= false }) {  
  const selected \= value ? getMood(value) : null;  
  return (  
    \<div\>  
      \<div className={\`flex items-center justify-between \${compact ? "gap-1.5" : "gap-2"}\`}\>  
        {MOODS.map((m) \=\> {  
          const active \= value \=== m.level;  
          return (  
            \<button key={m.level} type="button" onClick={() \=\> onChange?.(m.level)}  
              aria-pressed={active} aria-label={m.label}  
              className="tap-scale flex flex-col items-center gap-2 group"\>  
              \<span className={\`flex items-center justify-center rounded-full transition-all duration-300 \${  
                compact ? "w-12 h-12 text-2xl" : "w-14 h-14 text-3xl"  
              } \${  
                active  
                  ? "bg-sage text-white scale-110 shadow-\[0\_8px\_20px\_-6px\_rgba(94,122,104,0.5)\] ring-4 ring-sage-soft"  
                  : "bg-cream-deep/70 group-hover:bg-cream-deep"  
              }\`}\>  
                \<span className={active ? "grayscale-0" : "opacity-90"}\>{m.emoji}\</span\>  
              \</span\>  
              \<span className={\`text-\[10px\] font-semibold tracking-wide transition-colors \${  
                active ? "text-sage-deep" : "text-ink-soft/70"  
              }\`}\>{m.label}\</span\>  
            \</button\>  
          );  
        })}  
      \</div\>  
      {selected && (  
        \<div className="mt-4 px-1"\>  
          \<p className="text-\[13px\] leading-relaxed text-ink-soft font-body italic animate-fade-in"\>  
            {selected.feedback}  
          \</p\>  
        \</div\>  
      )}  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/AppointmentBanner.jsx\`

\`\`\`jsx  
import React from "react";  
import { CalendarHeart, X, MapPin, Clock } from "lucide-react";  
import { formatDateRo, daysUntil } from "@/lib/onco";

export default function AppointmentBanner({ appointment, onDismiss }) {  
  if (\!appointment) return null;  
  const d \= daysUntil(appointment.date);  
  if (d \=== null || d \< 0 || d \> 1\) return null;  
  const isToday \= d \=== 0;  
  const label \= isToday ? "Azi ai o programare" : "Mâine ai o programare";

  return (  
    \<div className="animate-fade-in blush-card rounded-3xl p-4 relative overflow-hidden"\>  
      \<button onClick={onDismiss}  
        className="tap-scale absolute top-3 right-3 w-7 h-7 rounded-full bg-white/50 flex items-center justify-center"  
        aria-label="Închide"\>  
        \<X className="w-3.5 h-3.5 text-blush-deep" /\>  
      \</button\>  
      \<div className="flex items-start gap-3 pr-6"\>  
        \<span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center"\>  
          \<CalendarHeart className="w-5 h-5 text-blush-deep" strokeWidth={1.8} /\>  
        \</span\>  
        \<div className="min-w-0 flex-1"\>  
          \<p className="font-heading text-\[15px\] text-blush-deep font-semibold"\>{label}\</p\>  
          \<p className="text-\[13px\] text-ink mt-1 font-semibold"\>{appointment.specialty}\</p\>  
          \<div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5"\>  
            {appointment.time && (  
              \<span className="text-\[11px\] text-ink-soft flex items-center gap-1"\>  
                \<Clock className="w-3 h-3" /\> {appointment.time}  
              \</span\>  
            )}  
            {appointment.doctor && \<span className="text-\[11px\] text-ink-soft"\>{appointment.doctor}\</span\>}  
            {appointment.center && (  
              \<span className="text-\[11px\] text-ink-soft flex items-center gap-1"\>  
                \<MapPin className="w-3 h-3" /\> {appointment.center}  
              \</span\>  
            )}  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/Botanical.jsx\`

\`\`\`jsx  
// Minimal hand-drawn botanical line-art accents (inline SVG)  
import React from "react";

export function BotanicalBranch({ className \= "", style }) {  
  return (  
    \<svg viewBox="0 0 120 160" className={className} style={style} fill="none" aria-hidden="true"\>  
      \<path d="M60 158 C60 120 60 90 60 50" stroke="\#7A9A8B" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" /\>  
      \<path d="M60 130 C48 126 40 118 36 106 C48 108 56 116 60 128" stroke="\#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" /\>  
      \<path d="M60 110 C72 106 80 98 84 86 C72 88 64 96 60 108" stroke="\#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" /\>  
      \<path d="M60 88 C48 84 40 76 36 64 C48 66 56 74 60 86" stroke="\#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" /\>  
      \<path d="M60 66 C72 62 80 54 84 42 C72 44 64 52 60 64" stroke="\#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" /\>  
      \<circle cx="60" cy="40" r="5" fill="\#DFB2B5" opacity="0.45" /\>  
      \<circle cx="52" cy="48" r="3.5" fill="\#DFB2B5" opacity="0.35" /\>  
      \<circle cx="68" cy="48" r="3.5" fill="\#DFB2B5" opacity="0.35" /\>  
    \</svg\>  
  );  
}

export function LeafSprig({ className \= "", style }) {  
  return (  
    \<svg viewBox="0 0 80 80" className={className} style={style} fill="none" aria-hidden="true"\>  
      \<path d="M40 76 C40 56 40 36 40 16" stroke="\#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" /\>  
      \<path d="M40 56 C32 54 26 48 22 40 C30 42 36 48 40 54" stroke="\#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" /\>  
      \<path d="M40 40 C48 38 54 32 58 24 C50 26 44 32 40 38" stroke="\#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" /\>  
      \<path d="M40 26 C34 24 30 18 28 12 C34 14 38 20 40 24" stroke="\#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" /\>  
    \</svg\>  
  );  
}

export function PillIcon({ className \= "", style }) {  
  return (  
    \<svg viewBox="0 0 64 64" className={className} style={style} fill="none" aria-hidden="true"\>  
      \<rect x="6" y="22" width="52" height="20" rx="10" transform="rotate(-30 32 32)" fill="\#E8EDE7" stroke="\#5E7A68" strokeWidth="1.6" /\>  
      \<path d="M22 18 L42 38" stroke="\#5E7A68" strokeWidth="1.6" strokeLinecap="round" transform="rotate(-30 32 32)" /\>  
      \<rect x="6" y="22" width="26" height="20" rx="10" transform="rotate(-30 32 32)" fill="\#5E7A68" opacity="0.35" /\>  
    \</svg\>  
  );  
}  
\`\`\`

\#\# \`src/components/SectionHeader.jsx\`

\`\`\`jsx  
import React from "react";  
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, action, onAction }) {  
  return (  
    \<div className="flex items-center justify-between mb-3"\>  
      \<h2 className="font-heading text-lg text-ink"\>{title}\</h2\>  
      {action && (  
        \<button onClick={onAction}  
          className="tap-scale inline-flex items-center gap-0.5 text-sage-deep text-\[13px\] font-semibold"\>  
          {action} \<ChevronRight className="w-4 h-4" /\>  
        \</button\>  
      )}  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/components/ProtectedRoute.jsx\`

\`\`\`jsx  
import { useEffect } from 'react';  
import { Outlet } from 'react-router-dom';  
import { useAuth } from '@/lib/AuthContext';  
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback \= () \=\> (  
  \<div className="fixed inset-0 flex items-center justify-center"\>  
    \<div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"\>\</div\>  
  \</div\>  
);

export default function ProtectedRoute({ fallback \= \<DefaultFallback /\>, unauthenticatedElement }) {  
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } \= useAuth();  
  useEffect(() \=\> {  
    if (\!authChecked && \!isLoadingAuth) checkUserAuth();  
  }, \[authChecked, isLoadingAuth, checkUserAuth\]);  
  if (isLoadingAuth || \!authChecked) return fallback;  
  if (authError) {  
    if (authError.type \=== 'user\_not\_registered') return \<UserNotRegisteredError /\>;  
    return unauthenticatedElement;  
  }  
  if (\!isAuthenticated) return unauthenticatedElement;  
  return \<Outlet /\>;  
}  
\`\`  
