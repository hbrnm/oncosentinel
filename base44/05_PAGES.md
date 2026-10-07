\# 05 — Pagini

\#\# \`src/App.jsx\`

\`\`\`jsx  
import { Toaster } from "@/components/ui/toaster"  
import { QueryClientProvider } from '@tanstack/react-query'  
import { queryClientInstance } from '@/lib/query-client'  
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  
import PageNotFound from './lib/PageNotFound';  
import { AuthProvider, useAuth } from '@/lib/AuthContext';  
import UserNotRegisteredError from '@/components/UserNotRegisteredError';  
import ScrollToTop from './components/ScrollToTop';  
import ProtectedRoute from '@/components/ProtectedRoute';  
import AppLayout from '@/components/AppLayout';  
import Login from '@/pages/Login';  
import Register from '@/pages/Register';  
import ForgotPassword from '@/pages/ForgotPassword';  
import ResetPassword from '@/pages/ResetPassword';  
import Onboarding from '@/pages/Onboarding';  
import Astazi from '@/pages/Astazi';  
import Tratament from '@/pages/Tratament';  
import Jurnal from '@/pages/Jurnal';  
import Ghiduri from '@/pages/Ghiduri';  
import Profil from '@/pages/Profil';  
import GuideDetail from '@/pages/GuideDetail';  
import NewsDetail from '@/pages/NewsDetail';

const OnboardingGate \= ({ children }) \=\> {  
  const { user, isLoadingAuth } \= useAuth();  
  if (isLoadingAuth) return null;  
  if (user && \!user.onboarding\_complete) return \<Onboarding /\>;  
  return children;  
};

const AuthenticatedApp \= () \=\> {  
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } \= useAuth();  
  if (isLoadingPublicSettings || isLoadingAuth) {  
    return (  
      \<div className="fixed inset-0 flex items-center justify-center bg-cream"\>  
        \<div className="w-8 h-8 border-4 border-sage-soft border-t-sage rounded-full animate-spin"\>\</div\>  
      \</div\>  
    );  
  }  
  if (authError) {  
    if (authError.type \=== 'user\_not\_registered') return \<UserNotRegisteredError /\>;  
    else if (authError.type \=== 'auth\_required') { navigateToLogin(); return null; }  
  }  
  return (  
    \<Routes\>  
      \<Route path="/login" element={\<Login /\>} /\>  
      \<Route path="/register" element={\<Register /\>} /\>  
      \<Route path="/forgot-password" element={\<ForgotPassword /\>} /\>  
      \<Route path="/reset-password" element={\<ResetPassword /\>} /\>  
      \<Route element={\<ProtectedRoute unauthenticatedElement={\<Navigate to="/login" replace /\>} /\>}\>  
        \<Route element={\<OnboardingGate\>\<AppLayout /\>\</OnboardingGate\>}\>  
          \<Route path="/" element={\<Astazi /\>} /\>  
          \<Route path="/tratament" element={\<Tratament /\>} /\>  
          \<Route path="/jurnal" element={\<Jurnal /\>} /\>  
          \<Route path="/ghiduri" element={\<Ghiduri /\>} /\>  
          \<Route path="/ghiduri/:id" element={\<GuideDetail /\>} /\>  
          \<Route path="/noutati/:id" element={\<NewsDetail /\>} /\>  
          \<Route path="/profil" element={\<Profil /\>} /\>  
        \</Route\>  
      \</Route\>  
      \<Route path="\*" element={\<PageNotFound /\>} /\>  
    \</Routes\>  
  );  
};

function App() {  
  return (  
    \<AuthProvider\>  
      \<QueryClientProvider client={queryClientInstance}\>  
        \<Router\>  
          \<ScrollToTop /\>  
          \<AuthenticatedApp /\>  
        \</Router\>  
        \<Toaster /\>  
      \</QueryClientProvider\>  
    \</AuthProvider\>  
  )  
}

export default App  
\`\`\`

\#\# \`src/pages/Astazi.jsx\`

\`\`\`jsx  
import React, { useState, useEffect, useCallback } from "react";  
import { useNavigate } from "react-router-dom";  
import { useAuth } from "@/lib/AuthContext";  
import { base44 } from "@/api/base44Client";  
import { Bell, ChevronRight, ShieldCheck, Leaf, Heart } from "lucide-react";  
import StatusBar from "@/components/StatusBar";  
import MedicationHeroCard from "@/components/MedicationHeroCard";  
import QuickActions from "@/components/QuickActions";  
import MoodPicker from "@/components/MoodPicker";  
import { BotanicalBranch, LeafSprig } from "@/components/Botanical";  
import AppointmentBanner from "@/components/AppointmentBanner";  
import { getGreeting, todayISO, daysUntil, formatDateRo, weekKey, getMood } from "@/lib/onco";  
import { Image } from "@/components/ui/image";

export default function Astazi() {  
  const { user } \= useAuth();  
  const navigate \= useNavigate();  
  const \[medication, setMedication\] \= useState(null);  
  const \[doseLog, setDoseLog\] \= useState(null);  
  const \[appointment, setAppointment\] \= useState(null);  
  const \[guide, setGuide\] \= useState(null);  
  const \[news, setNews\] \= useState(null);  
  const \[moodValue, setMoodValue\] \= useState(null);  
  const \[moodSaved, setMoodSaved\] \= useState(false);  
  const \[bannerDismissed, setBannerDismissed\] \= useState(false);  
  const \[loading, setLoading\] \= useState(true);

  const displayName \= user?.display\_name || (user?.email ? user.email.split("@")\[0\] : "Andreea");  
  const greeting \= getGreeting();

  const loadData \= useCallback(async () \=\> {  
    try {  
      const \[meds, appts, guides, newsList\] \= await Promise.all(\[  
        base44.entities.Medication.filter({ active: true }, { sort: "-created\_date", limit: 1 }),  
        base44.entities.Appointment.filter({ status: "upcoming" }, { sort: "date", limit: 1 }),  
        base44.entities.Guide.filter({}, { sort: "-created\_date", limit: 1 }),  
        base44.entities.NewsUpdate.filter({}, { sort: "-date", limit: 1 }),  
      \]);  
      const med \= meds.items?.\[0\] || null;  
      setMedication(med);  
      setAppointment(appts.items?.\[0\] || null);  
      setGuide(guides.items?.\[0\] || null);  
      setNews(newsList.items?.\[0\] || null);  
      if (med) {  
        const logs \= await base44.entities.DoseLog.filter(  
          { medication\_id: med.id, date: todayISO() }, { limit: 1 }  
        );  
        setDoseLog(logs.items?.\[0\] || null);  
      }  
      const wk \= weekKey(todayISO());  
      const moods \= await base44.entities.MoodEntry.filter({ week\_key: wk }, { sort: "-created\_date", limit: 1 });  
      if (moods.items?.\[0\]) { setMoodValue(moods.items\[0\].mood); setMoodSaved(true); }  
    } catch (e) { console.error("loadData", e); }  
    finally { setLoading(false); }  
  }, \[\]);

  useEffect(() \=\> { loadData(); }, \[loadData\]);

  const handleMarkTaken \= async () \=\> {  
    if (\!medication) return;  
    try {  
      const log \= await base44.entities.DoseLog.create({  
        date: todayISO(), taken: true, medication\_id: medication.id, taken\_at: new Date().toISOString(),  
      });  
      setDoseLog(log);  
    } catch (e) { console.error(e); }  
  };

  const handleMoodSelect \= async (level) \=\> {  
    setMoodValue(level);  
    setMoodSaved(true);  
    try {  
      await base44.entities.MoodEntry.create({ mood: level, date: todayISO(), week\_key: weekKey(todayISO()) });  
    } catch (e) { console.error(e); }  
  };

  const apptDays \= appointment ? daysUntil(appointment.date) : null;

  return (  
    \<div className="min-h-screen relative"\>  
      \<div className="absolute top-0 right-0 w-44 h-56 pointer-events-none opacity-80"\>  
        \<BotanicalBranch className="w-full h-full" /\>  
      \</div\>  
      \<StatusBar /\>  
      \<header className="px-6 pt-3 pb-5 relative"\>  
        \<div className="flex items-start justify-between"\>  
          \<div className="max-w-\[78%\]"\>  
            \<p className="text-\[12px\] text-ink-soft font-medium"\>{greeting.hello},\</p\>  
            \<h1 className="font-heading text-\[26px\] leading-tight text-ink capitalize mt-0.5"\>{displayName}\</h1\>  
            \<p className="text-\[13px\] text-ink-soft mt-1.5 leading-relaxed"\>{greeting.sub}\</p\>  
          \</div\>  
          \<button className="tap-scale relative w-11 h-11 rounded-full bg-white/70 border border-warmborder flex items-center justify-center shadow-soft"\>  
            \<Bell className="w-5 h-5 text-sage-deep" strokeWidth={1.8} /\>  
            \<span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blush-accent" /\>  
          \</button\>  
        \</div\>  
      \</header\>  
      \<div className="px-5 space-y-6"\>  
        \<div className="animate-fade-in"\>  
          \<MedicationHeroCard medication={medication} taken={\!\!doseLog?.taken}  
            onMarkTaken={handleMarkTaken} onSeeDetails={() \=\> navigate("/tratament")} /\>  
        \</div\>  
        \<QuickActions /\>  
        {\!bannerDismissed && (  
          \<AppointmentBanner appointment={appointment} onDismiss={() \=\> setBannerDismissed(true)} /\>  
        )}  
        \<div className="grid grid-cols-2 gap-3"\>  
          \<button onClick={() \=\> navigate("/profil")}  
            className="tap-scale organic-card rounded-3xl p-4 text-left flex flex-col justify-between min-h-\[150px\]"\>  
            \<div\>  
              \<p className="micro-label"\>Următorul control\</p\>  
              {appointment ? (  
                \<p className="font-heading text-lg text-ink mt-2 leading-tight"\>{formatDateRo(appointment.date)}\</p\>  
              ) : (  
                \<p className="font-heading text-lg text-ink-soft mt-2"\>Neprogramat\</p\>  
              )}  
            \</div\>  
            \<div\>  
              {appointment && (  
                \<p className="text-\[11px\] text-ink-soft leading-snug"\>{appointment.specialty} · {appointment.doctor}\</p\>  
              )}  
              {apptDays \!== null && apptDays \>= 0 && (  
                \<span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-sage-soft text-sage-deep text-\[10px\] font-semibold"\>  
                  peste {apptDays} {apptDays \=== 1 ? "zi" : "zile"}  
                \</span\>  
              )}  
            \</div\>  
          \</button\>  
          \<div className="blush-card rounded-3xl p-4 flex flex-col justify-between min-h-\[150px\] relative overflow-hidden"\>  
            \<LeafSprig className="absolute \-bottom-2 \-right-2 w-16 h-16 opacity-50" /\>  
            \<Leaf className="absolute top-3 right-3 w-4 h-4 text-blush-deep opacity-60" /\>  
            \<p className="font-heading italic text-\[13px\] leading-relaxed text-blush-deep pr-6"\>  
              „Îngrijirea de sine nu este un lux, ci o parte din tratament.”  
            \</p\>  
          \</div\>  
        \</div\>  
        \<div className="organic-card rounded-3xl p-5"\>  
          \<div className="flex items-center justify-between mb-4"\>  
            \<div\>  
              \<p className="micro-label"\>Jurnal\</p\>  
              \<h2 className="font-heading text-\[17px\] text-ink mt-1"\>Cum te-ai simțit în ultima săptămână?\</h2\>  
            \</div\>  
            \<button onClick={() \=\> navigate("/jurnal")} className="tap-scale text-sage-deep" aria-label="Deschide jurnalul"\>  
              \<ChevronRight className="w-5 h-5" /\>  
            \</button\>  
          \</div\>  
          \<MoodPicker value={moodValue} onChange={handleMoodSelect} compact /\>  
          {moodSaved && (  
            \<p className="mt-3 text-\[11px\] text-sage-deep font-semibold flex items-center gap-1"\>  
              \<Heart className="w-3 h-3" /\> Mulțumim că te-ai deschis. Înregistrat azi.  
            \</p\>  
          )}  
        \</div\>  
        {guide && (  
          \<button onClick={() \=\> navigate(\`/ghiduri/\${guide.id}\`)}  
            className="tap-scale organic-card rounded-3xl overflow-hidden text-left w-full flex flex-col"\>  
            {guide.image\_url && (  
              \<div className="relative h-36 w-full"\>  
                \<Image src={guide.image\_url} alt={guide.title} className="w-full h-full" fittingType="fill" /\>  
                \<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /\>  
              \</div\>  
            )}  
            \<div className="p-4"\>  
              \<p className="micro-label"\>{guide.tag}\</p\>  
              \<h3 className="font-heading text-\[16px\] text-ink mt-1.5 leading-snug"\>{guide.title}\</h3\>  
              \<p className="text-\[12px\] text-ink-soft mt-1.5 leading-relaxed line-clamp-2"\>{guide.summary}\</p\>  
            \</div\>  
          \</button\>  
        )}  
        {news && (  
          \<button onClick={() \=\> navigate(\`/noutati/\${news.id}\`)}  
            className="tap-scale organic-card rounded-3xl p-4 text-left w-full flex items-start gap-3.5"\>  
            \<span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-sage-soft flex items-center justify-center"\>  
              \<ShieldCheck className="w-5 h-5 text-sage-deep" strokeWidth={1.8} /\>  
            \</span\>  
            \<div className="min-w-0 flex-1"\>  
              \<div className="flex items-center gap-2"\>  
                \<span className="micro-label text-sage-deep"\>Noutăți\</span\>  
                \<span className="text-\[10px\] text-ink-soft/70"\>·\</span\>  
                \<span className="text-\[10px\] text-ink-soft/70"\>{formatDateRo(news.date)}\</span\>  
              \</div\>  
              \<p className="text-\[13px\] font-semibold text-ink mt-1 leading-snug"\>{news.title}\</p\>  
              {news.summary && \<p className="text-\[11.5px\] text-ink-soft mt-1 leading-relaxed line-clamp-2"\>{news.summary}\</p\>}  
            \</div\>  
            \<ChevronRight className="w-4 h-4 text-ink-soft/50 flex-shrink-0 mt-3" /\>  
          \</button\>  
        )}  
        \<div className="sage-card rounded-3xl p-5 relative overflow-hidden flex items-center gap-4"\>  
          \<LeafSprig className="absolute \-left-3 \-bottom-3 w-20 h-20 opacity-30" /\>  
          \<span className="flex-shrink-0 w-12 h-12 rounded-full bg-white/60 flex items-center justify-center"\>  
            \<Heart className="w-5 h-5 text-sage-deep" strokeWidth={1.8} /\>  
          \</span\>  
          \<p className="font-heading italic text-\[14px\] leading-relaxed text-sage-deep pr-2"\>  
            „Nu ești doar un pacient. Ești o persoană cu o viață întreagă în față.”  
          \</p\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/Tratament.jsx\`

\`\`\`jsx  
import React, { useState, useEffect, useCallback } from "react";  
import { base44 } from "@/api/base44Client";  
import { useAuth } from "@/lib/AuthContext";  
import StatusBar from "@/components/StatusBar";  
import { PillIcon } from "@/components/Botanical";  
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";  
import { Check, Pencil, CalendarDays, Clock } from "lucide-react";  
import { todayISO, formatDateRo } from "@/lib/onco";

export default function Tratament() {  
  const { user } \= useAuth();  
  const \[med, setMed\] \= useState(null);  
  const \[logs, setLogs\] \= useState(\[\]);  
  const \[editing, setEditing\] \= useState(false);  
  const \[form, setForm\] \= useState({ name: "", dose: "", frequency: "", time\_of\_day: "" });  
  const \[loading, setLoading\] \= useState(true);

  const load \= useCallback(async () \=\> {  
    try {  
      const meds \= await base44.entities.Medication.filter({ active: true }, { sort: "-created\_date", limit: 1 });  
      const m \= meds.items?.\[0\] || null;  
      setMed(m);  
      if (m) {  
        setForm({ name: m.name, dose: m.dose, frequency: m.frequency, time\_of\_day: m.time\_of\_day });  
        const l \= await base44.entities.DoseLog.filter({ medication\_id: m.id }, { sort: "-date", limit: 60 });  
        setLogs(l.items || \[\]);  
      }  
    } catch (e) { console.error(e); }  
    finally { setLoading(false); }  
  }, \[\]);

  useEffect(() \=\> { load(); }, \[load\]);

  const takenDates \= new Set(logs.filter((l) \=\> l.taken).map((l) \=\> l.date));  
  const today \= todayISO();  
  const todayTaken \= takenDates.has(today);

  const markToday \= async () \=\> {  
    if (\!med || todayTaken) return;  
    try {  
      const log \= await base44.entities.DoseLog.create({  
        date: today, taken: true, medication\_id: med.id, taken\_at: new Date().toISOString(),  
      });  
      setLogs((prev) \=\> \[log, ...prev\]);  
    } catch (e) { console.error(e); }  
  };

  const saveEdit \= async () \=\> {  
    try {  
      const updated \= await base44.entities.Medication.update(med.id, form);  
      setMed(updated);  
      setEditing(false);  
    } catch (e) { console.error(e); }  
  };

  const days \= \[\];  
  const now \= new Date();  
  for (let i \= 27; i \>= 0; i--) {  
    const d \= new Date(now);  
    d.setDate(now.getDate() \- i);  
    const iso \= d.toISOString().slice(0, 10);  
    days.push({ iso, taken: takenDates.has(iso), isToday: iso \=== today, day: d.getDate(), dow: d.getDay() });  
  }  
  const adherence \= Math.round((takenDates.size / Math.max(days.length, 1)) \* 100);

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<header className="px-6 pt-4 pb-3"\>  
        \<h1 className="font-heading text-2xl text-ink"\>Tratament\</h1\>  
        \<p className="text-\[13px\] text-ink-soft mt-1"\>Planul tău zilnic și istoricul dozelor.\</p\>  
      \</header\>  
      \<div className="px-5 space-y-5"\>  
        \<div className="sage-card rounded-\[28px\] p-5"\>  
          \<div className="flex items-start justify-between"\>  
            \<div className="flex items-center gap-3.5"\>  
              \<div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-soft"\>  
                \<PillIcon className="w-9 h-9" /\>  
              \</div\>  
              \<div\>  
                \<h2 className="font-heading text-xl text-sage-deep"\>{med?.name || "—"}\</h2\>  
                \<p className="text-\[13px\] text-ink-soft mt-0.5"\>{med?.dose} • {med?.frequency}\</p\>  
                \<p className="text-\[12px\] text-ink-soft mt-0.5 flex items-center gap-1"\>  
                  \<Clock className="w-3.5 h-3.5" /\> {med?.time\_of\_day}  
                \</p\>  
              \</div\>  
            \</div\>  
            \<button onClick={() \=\> setEditing(true)} className="tap-scale w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shadow-soft"\>  
              \<Pencil className="w-4 h-4 text-sage-deep" /\>  
            \</button\>  
          \</div\>  
          \<div className="mt-4 pt-4 border-t border-sage/15"\>  
            {\!todayTaken ? (  
              \<Button onClick={markToday} className="w-full h-12 rounded-2xl bg-sage hover:bg-sage-deep text-white font-semibold"\>  
                \<Check className="w-4 h-4 mr-2" /\> Marchează doza de azi  
              \</Button\>  
            ) : (  
              \<div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/60 text-sage-deep font-semibold text-\[14px\]"\>  
                \<Check className="w-5 h-5" strokeWidth={2.5} /\> Ai luat doza de azi. Felicitări\!  
              \</div\>  
            )}  
          \</div\>  
        \</div\>  
        \<div className="organic-card rounded-3xl p-5"\>  
          \<div className="flex items-center justify-between mb-1"\>  
            \<p className="micro-label"\>Aderență · ultimele 4 săptămâni\</p\>  
            \<span className="font-heading text-2xl text-sage-deep"\>{adherence}%\</span\>  
          \</div\>  
          \<div className="h-2 rounded-full bg-cream-deep mt-2 overflow-hidden"\>  
            \<div className="h-full rounded-full bg-sage transition-all duration-700" style={{ width: \`\${adherence}%\` }} /\>  
          \</div\>  
          \<p className="text-\[11px\] text-ink-soft mt-2"\>{takenDates.size} doze luate din {days.length} zile.\</p\>  
        \</div\>  
        \<div className="organic-card rounded-3xl p-5"\>  
          \<div className="flex items-center gap-2 mb-4"\>  
            \<CalendarDays className="w-4 h-4 text-sage-deep" /\>  
            \<p className="micro-label"\>Calendar doze\</p\>  
          \</div\>  
          \<div className="grid grid-cols-7 gap-1.5"\>  
            {days.map((d) \=\> (  
              \<div key={d.iso} className="flex flex-col items-center gap-1"\>  
                \<span className="text-\[9px\] text-ink-soft/60 font-medium"\>{\["D", "L", "M", "M", "J", "V", "S"\]\[d.dow\]}\</span\>  
                \<div className={\`w-8 h-8 rounded-xl flex items-center justify-center text-\[11px\] font-semibold transition-all \${  
                  d.isToday ? "ring-2 ring-sage ring-offset-1 ring-offset-card" : ""  
                } \${  
                  d.taken ? "bg-sage text-white" : d.iso \< today ? "bg-cream-deep/60 text-ink-soft/40" : "bg-cream-deep/30 text-ink-soft"  
                }\`}\>  
                  {d.taken ? \<Check className="w-3.5 h-3.5" strokeWidth={3} /\> : d.day}  
                \</div\>  
              \</div\>  
            ))}  
          \</div\>  
        \</div\>  
        \<div className="organic-card rounded-3xl p-5"\>  
          \<p className="micro-label mb-3"\>Istoric recent\</p\>  
          \<div className="space-y-2"\>  
            {logs.filter((l) \=\> l.taken).slice(0, 8).map((l) \=\> (  
              \<div key={l.id} className="flex items-center justify-between py-2 border-b border-warmborder/50 last:border-0"\>  
                \<span className="text-\[13px\] text-ink"\>{formatDateRo(l.date)}\</span\>  
                \<span className="inline-flex items-center gap-1 text-\[12px\] text-sage-deep font-semibold"\>  
                  \<Check className="w-3.5 h-3.5" strokeWidth={2.5} /\> Luat  
                \</span\>  
              \</div\>  
            ))}  
            {logs.filter((l) \=\> l.taken).length \=== 0 && (  
              \<p className="text-\[13px\] text-ink-soft/70 text-center py-4"\>Nicio doză marcată încă.\</p\>  
            )}  
          \</div\>  
        \</div\>  
      \</div\>  
      \<Dialog open={editing} onOpenChange={setEditing}\>  
        \<DialogContent className="rounded-3xl max-w-\[400px\]"\>  
          \<DialogHeader\>\<DialogTitle className="font-heading text-lg text-ink"\>Editează tratamentul\</DialogTitle\>\</DialogHeader\>  
          \<div className="space-y-3"\>  
            \<div\>  
              \<Label className="text-\[13px\] font-semibold"\>Denumire\</Label\>  
              \<Input value={form.name} onChange={(e) \=\> setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" /\>  
            \</div\>  
            \<div className="grid grid-cols-2 gap-3"\>  
              \<div\>  
                \<Label className="text-\[13px\] font-semibold"\>Doză\</Label\>  
                \<Input value={form.dose} onChange={(e) \=\> setForm({ ...form, dose: e.target.value })} className="h-11 rounded-xl" /\>  
              \</div\>  
              \<div\>  
                \<Label className="text-\[13px\] font-semibold"\>Frecvență\</Label\>  
                \<Input value={form.frequency} onChange={(e) \=\> setForm({ ...form, frequency: e.target.value })} className="h-11 rounded-xl" /\>  
              \</div\>  
            \</div\>  
            \<div\>  
              \<Label className="text-\[13px\] font-semibold"\>Ora\</Label\>  
              \<Input type="time" value={form.time\_of\_day} onChange={(e) \=\> setForm({ ...form, time\_of\_day: e.target.value })} className="h-11 rounded-xl" /\>  
            \</div\>  
          \</div\>  
          \<DialogFooter\>  
            \<Button variant="ghost" onClick={() \=\> setEditing(false)}\>Anulează\</Button\>  
            \<Button onClick={saveEdit} className="bg-sage hover:bg-sage-deep text-white rounded-xl"\>Salvează\</Button\>  
          \</DialogFooter\>  
        \</DialogContent\>  
      \</Dialog\>  
    \</div\>  
  );  
}  
\`\`  
