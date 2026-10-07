\# 06 — Lib & pagini restante

\#\# \`src/lib/onco.js\`

\`\`\`javascript  
// Shared helpers for OncoSentinel — Romanian dates, moods, greetings

export const MOODS \= \[  
  { level: 5, label: "Foarte bine", emoji: "😊", feedback: "Mă bucur că te simți bine. Continuă să ai grijă de tine cu aceeași blândețe." },  
  { level: 4, label: "Bine", emoji: "🙂", feedback: "E bine să te simți bine. Micile bucurii contează enorm în fiecare zi." },  
  { level: 3, label: "Neutru", emoji: "😐", feedback: "Zilele neutre sunt și ele normale. Nu trebuie să simți mereu ceva deosebit." },  
  { level: 2, label: "Rău", emoji: "😔", feedback: "Îmi pare rău că azi e mai greu. Fii blândă cu tine — și mâine e o nouă zi." },  
  { level: 1, label: "Foarte rău", emoji: "😢", feedback: "E ok să nu fie ok. Te auzim și te sprijinim. Nu ești singură în asta." },  
\];

export const getMood \= (level) \=\> MOODS.find((m) \=\> m.level \=== level) || MOODS\[2\];

const RO\_MONTHS \= \["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"\];  
const RO\_MONTHS\_SHORT \= \["ian","feb","mar","apr","mai","iun","iul","aug","sep","oct","noi","dec"\];

export const formatDateRo \= (dateStr) \=\> {  
  if (\!dateStr) return "";  
  const d \= new Date(dateStr \+ (dateStr.length \<= 10 ? "T00:00:00" : ""));  
  if (isNaN(d.getTime())) return dateStr;  
  return \`\${d.getDate()} \${RO\_MONTHS\[d.getMonth()\]} \${d.getFullYear()}\`;  
};

export const formatDateShortRo \= (dateStr) \=\> {  
  if (\!dateStr) return "";  
  const d \= new Date(dateStr \+ (dateStr.length \<= 10 ? "T00:00:00" : ""));  
  if (isNaN(d.getTime())) return dateStr;  
  return \`\${d.getDate()} \${RO\_MONTHS\_SHORT\[d.getMonth()\]}\`;  
};

export const todayISO \= () \=\> {  
  const d \= new Date();  
  const tz \= d.getTimezoneOffset() \* 60000;  
  return new Date(d \- tz).toISOString().slice(0, 10);  
};

export const daysUntil \= (dateStr) \=\> {  
  if (\!dateStr) return null;  
  const target \= new Date(dateStr \+ "T00:00:00");  
  const now \= new Date();  
  const today \= new Date(now.getFullYear(), now.getMonth(), now.getDate());  
  return Math.round((target \- today) / 86400000);  
};

export const getGreeting \= () \=\> {  
  const h \= new Date().getHours();  
  if (h \< 12) return { hello: "Bună dimineața", sub: "Ești puternică. Pas cu pas. Ai grijă de tine." };  
  if (h \< 18) return { hello: "Bună ziua", sub: "Fiecare zi este un pas înainte. Respiră adânc." };  
  return { hello: "Bună seara", sub: "Ai făcut tot ce ai putut azi. E de ajuns." };  
};

export const nextDoseLabel \= (timeStr) \=\> {  
  if (\!timeStr) return "Mâine, 08:00";  
  const now \= new Date();  
  const \[hh, mm\] \= timeStr.split(":").map(Number);  
  const doseTime \= new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);  
  if (doseTime \> now) return \`Azi, \${timeStr}\`;  
  return \`Mâine, \${timeStr}\`;  
};

export const weekKey \= (dateStr) \=\> {  
  const d \= dateStr ? new Date(dateStr \+ "T00:00:00") : new Date();  
  const monday \= new Date(d);  
  monday.setDate(d.getDate() \- ((d.getDay() \+ 6) % 7));  
  return monday.toISOString().slice(0, 10);  
};  
\`\`\`

\#\# \`src/lib/AuthContext.jsx\`

\`\`\`jsx  
import React, { createContext, useState, useContext, useEffect } from 'react';  
import { base44 } from '@/api/base44Client';  
import { appParams } from '@/lib/app-params';

const AuthContext \= createContext();

export const AuthProvider \= ({ children }) \=\> {  
  const \[user, setUser\] \= useState(null);  
  const \[isAuthenticated, setIsAuthenticated\] \= useState(false);  
  const \[isLoadingAuth, setIsLoadingAuth\] \= useState(true);  
  const \[isLoadingPublicSettings, setIsLoadingPublicSettings\] \= useState(true);  
  const \[authError, setAuthError\] \= useState(null);  
  const \[authChecked, setAuthChecked\] \= useState(false);  
  const \[appPublicSettings, setAppPublicSettings\] \= useState(null);

  useEffect(() \=\> { checkAppState(); }, \[\]);

  const checkAppState \= async () \=\> {  
    try {  
      setIsLoadingPublicSettings(true);  
      setAuthError(null);  
      try {  
        const publicSettings \= await base44.app.getPublicSettings();  
        setAppPublicSettings(publicSettings);  
        if (appParams.token) { await checkUserAuth(); }  
        else { setIsLoadingAuth(false); setIsAuthenticated(false); setAuthChecked(true); }  
        setIsLoadingPublicSettings(false);  
      } catch (appError) {  
        if (appError.status \=== 403 && appError.data?.extra\_data?.reason) {  
          const reason \= appError.data.extra\_data.reason;  
          if (reason \=== 'auth\_required') setAuthError({ type: 'auth\_required', message: 'Authentication required' });  
          else if (reason \=== 'user\_not\_registered') setAuthError({ type: 'user\_not\_registered', message: 'User not registered' });  
          else setAuthError({ type: reason, message: appError.message });  
        } else {  
          setAuthError({ type: 'unknown', message: appError.message || 'Failed to load app' });  
        }  
        setIsLoadingPublicSettings(false);  
        setIsLoadingAuth(false);  
      }  
    } catch (error) {  
      setAuthError({ type: 'unknown', message: error.message });  
      setIsLoadingPublicSettings(false);  
      setIsLoadingAuth(false);  
    }  
  };

  const checkUserAuth \= async () \=\> {  
    try {  
      setIsLoadingAuth(true);  
      const currentUser \= await base44.auth.me();  
      setUser(currentUser);  
      setIsAuthenticated(true);  
      setIsLoadingAuth(false);  
      setAuthChecked(true);  
    } catch (error) {  
      setIsLoadingAuth(false);  
      setIsAuthenticated(false);  
      setAuthChecked(true);  
      if (error.status \=== 401 || error.status \=== 403\) {  
        setAuthError({ type: 'auth\_required', message: 'Authentication required' });  
      }  
    }  
  };

  const logout \= (shouldRedirect \= true) \=\> {  
    setUser(null);  
    setIsAuthenticated(false);  
    if (shouldRedirect) base44.auth.logout(window.location.href);  
    else base44.auth.logout();  
  };

  const navigateToLogin \= () \=\> { base44.auth.redirectToLogin(window.location.href); };

  return (  
    \<AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings, authChecked, logout, navigateToLogin, checkUserAuth, checkAppState }}\>  
      {children}  
    \</AuthContext.Provider\>  
  );  
};

export const useAuth \= () \=\> {  
  const context \= useContext(AuthContext);  
  if (\!context) throw new Error('useAuth must be used within an AuthProvider');  
  return context;  
};  
\`\`\`

\#\# \`src/pages/Jurnal.jsx\`

\`\`\`jsx  
import React, { useState, useEffect, useCallback } from "react";  
import { base44 } from "@/api/base44Client";  
import StatusBar from "@/components/StatusBar";  
import MoodPicker from "@/components/MoodPicker";  
import { Button } from "@/components/ui/button";  
import { Textarea } from "@/components/ui/textarea";  
import { getMood, formatDateRo, todayISO, weekKey } from "@/lib/onco";  
import { Leaf, Heart, BookOpen } from "lucide-react";  
import { LeafSprig } from "@/components/Botanical";

export default function Jurnal() {  
  const \[mood, setMood\] \= useState(null);  
  const \[note, setNote\] \= useState("");  
  const \[saving, setSaving\] \= useState(false);  
  const \[savedToday, setSavedToday\] \= useState(false);  
  const \[history, setHistory\] \= useState(\[\]);

  const load \= useCallback(async () \=\> {  
    try {  
      const wk \= weekKey(todayISO());  
      const recent \= await base44.entities.MoodEntry.filter({ week\_key: wk }, { sort: "-created\_date", limit: 1 });  
      if (recent.items?.\[0\]) { setMood(recent.items\[0\].mood); setSavedToday(true); }  
      const all \= await base44.entities.MoodEntry.filter({}, { sort: "-created\_date", limit: 50 });  
      setHistory(all.items || \[\]);  
    } catch (e) { console.error(e); }  
  }, \[\]);

  useEffect(() \=\> { load(); }, \[load\]);

  const save \= async () \=\> {  
    if (\!mood) return;  
    setSaving(true);  
    try {  
      await base44.entities.MoodEntry.create({ mood, note: note.trim(), date: todayISO(), week\_key: weekKey(todayISO()) });  
      setSavedToday(true);  
      setNote("");  
      const all \= await base44.entities.MoodEntry.filter({}, { sort: "-created\_date", limit: 50 });  
      setHistory(all.items || \[\]);  
    } catch (e) { console.error(e); }  
    finally { setSaving(false); }  
  };

  const grouped \= history.reduce((acc, e) \=\> { (acc\[e.date\] \= acc\[e.date\] || \[\]).push(e); return acc; }, {});  
  const dates \= Object.keys(grouped).sort().reverse();

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<header className="px-6 pt-4 pb-3 relative"\>  
        \<LeafSprig className="absolute top-2 right-4 w-14 h-14 text-sage-light opacity-50" /\>  
        \<h1 className="font-heading text-2xl text-ink"\>Jurnal\</h1\>  
        \<p className="text-\[13px\] text-ink-soft mt-1"\>Un spațiu blând pentru emoțiile tale.\</p\>  
      \</header\>  
      \<div className="px-5 space-y-5"\>  
        \<div className="blush-card rounded-\[28px\] p-5 relative overflow-hidden"\>  
          \<LeafSprig className="absolute \-bottom-3 \-right-3 w-20 h-20 opacity-40" /\>  
          \<div className="flex items-center gap-2 mb-1"\>  
            \<Heart className="w-4 h-4 text-blush-deep" /\>  
            \<p className="micro-label text-blush-deep"\>Cum te simți azi?\</p\>  
          \</div\>  
          \<p className="text-\[13px\] text-ink-soft mb-4"\>Alege dispoziția de azi. Nu există răspuns greșit.\</p\>  
          \<MoodPicker value={mood} onChange={setMood} compact /\>  
          \<Textarea value={note} onChange={(e) \=\> setNote(e.target.value)}  
            placeholder="Vrei să adaugi câteva cuvinte? (opțional)"  
            className="mt-4 rounded-2xl bg-white/60 border-blush-accent/30 min-h-\[80px\] text-\[13px\] resize-none" /\>  
          \<Button onClick={save} disabled={\!mood || saving || savedToday}  
            className="w-full mt-3 h-12 rounded-2xl bg-blush-deep hover:bg-blush-accent text-white font-semibold disabled:opacity-50"\>  
            {savedToday ? "Înregistrat azi ✓" : saving ? "Salvez..." : "Salvează în jurnal"}  
          \</Button\>  
        \</div\>  
        \<div\>  
          \<div className="flex items-center gap-2 mb-3"\>  
            \<BookOpen className="w-4 h-4 text-sage-deep" /\>  
            \<h2 className="font-heading text-lg text-ink"\>Istoric\</h2\>  
          \</div\>  
          \<div className="space-y-3"\>  
            {dates.length \=== 0 && (  
              \<div className="organic-card rounded-3xl p-6 text-center"\>  
                \<Leaf className="w-8 h-8 text-sage-light mx-auto mb-2" /\>  
                \<p className="text-\[13px\] text-ink-soft"\>Încă nu ai înregistrări. Prima ta notă va apărea aici.\</p\>  
              \</div\>  
            )}  
            {dates.map((date) \=\> (  
              \<div key={date} className="organic-card rounded-3xl p-4"\>  
                \<p className="micro-label mb-3"\>{formatDateRo(date)}\</p\>  
                \<div className="space-y-2.5"\>  
                  {grouped\[date\].map((e) \=\> {  
                    const m \= getMood(e.mood);  
                    return (  
                      \<div key={e.id} className="flex items-start gap-3"\>  
                        \<span className="flex-shrink-0 w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center text-lg"\>{m.emoji}\</span\>  
                        \<div className="min-w-0"\>  
                          \<p className="text-\[12px\] font-semibold text-ink"\>{m.label}\</p\>  
                          {e.note && \<p className="text-\[12px\] text-ink-soft mt-0.5 leading-relaxed"\>{e.note}\</p\>}  
                        \</div\>  
                      \</div\>  
                    );  
                  })}  
                \</div\>  
              \</div\>  
            ))}  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/Ghiduri.jsx\`

\`\`\`jsx  
import React, { useState, useEffect, useCallback } from "react";  
import { useNavigate } from "react-router-dom";  
import { base44 } from "@/api/base44Client";  
import StatusBar from "@/components/StatusBar";  
import { Image } from "@/components/ui/image";  
import { ShieldCheck, FileText, ChevronRight } from "lucide-react";  
import { formatDateRo } from "@/lib/onco";

export default function Ghiduri() {  
  const navigate \= useNavigate();  
  const \[guides, setGuides\] \= useState(\[\]);  
  const \[news, setNews\] \= useState(\[\]);  
  const \[loading, setLoading\] \= useState(true);

  const load \= useCallback(async () \=\> {  
    try {  
      const \[g, n\] \= await Promise.all(\[  
        base44.entities.Guide.filter({}, { sort: "order", limit: 50 }),  
        base44.entities.NewsUpdate.filter({}, { sort: "-date", limit: 20 }),  
      \]);  
      setGuides(g.items || \[\]);  
      setNews(n.items || \[\]);  
    } catch (e) { console.error(e); }  
    finally { setLoading(false); }  
  }, \[\]);

  useEffect(() \=\> { load(); }, \[load\]);

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<header className="px-6 pt-4 pb-3"\>  
        \<h1 className="font-heading text-2xl text-ink"\>Ghiduri\</h1\>  
        \<p className="text-\[13px\] text-ink-soft mt-1"\>Informații de încredere și noutăți clinice.\</p\>  
      \</header\>  
      \<div className="px-5 space-y-6"\>  
        \<section\>  
          \<div className="flex items-center gap-2 mb-3"\>  
            \<FileText className="w-4 h-4 text-sage-deep" /\>  
            \<h2 className="font-heading text-lg text-ink"\>Ghiduri medicale\</h2\>  
          \</div\>  
          \<div className="space-y-3"\>  
            {guides.length \=== 0 && \!loading && (  
              \<div className="organic-card rounded-3xl p-6 text-center"\>  
                \<p className="text-\[13px\] text-ink-soft"\>Curând vom adăuga ghiduri curate aici.\</p\>  
              \</div\>  
            )}  
            {guides.map((g) \=\> (  
              \<button key={g.id} onClick={() \=\> navigate(\`/ghiduri/\${g.id}\`)}  
                className="tap-scale organic-card rounded-3xl overflow-hidden text-left w-full flex flex-col"\>  
                {g.image\_url && (  
                  \<div className="relative h-36 w-full"\>  
                    \<Image src={g.image\_url} alt={g.title} className="w-full h-full" fittingType="fill" /\>  
                    \<div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" /\>  
                    \<span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur text-\[9px\] font-semibold uppercase tracking-wider text-sage-deep"\>  
                      {g.tag}  
                    \</span\>  
                  \</div\>  
                )}  
                \<div className="p-4 flex items-start justify-between gap-2"\>  
                  \<div className="min-w-0"\>  
                    {\!g.image\_url && \<p className="micro-label mb-1"\>{g.tag}\</p\>}  
                    \<h3 className="font-heading text-\[16px\] text-ink leading-snug"\>{g.title}\</h3\>  
                    \<p className="text-\[12px\] text-ink-soft mt-1.5 leading-relaxed line-clamp-2"\>{g.summary}\</p\>  
                  \</div\>  
                  \<ChevronRight className="w-4 h-4 text-ink-soft/50 flex-shrink-0 mt-1" /\>  
                \</div\>  
              \</button\>  
            ))}  
          \</div\>  
        \</section\>  
        \<section\>  
          \<div className="flex items-center gap-2 mb-3"\>  
            \<ShieldCheck className="w-4 h-4 text-sage-deep" /\>  
            \<h2 className="font-heading text-lg text-ink"\>Noutăți & protocoale\</h2\>  
          \</div\>  
          \<div className="space-y-3"\>  
            {news.length \=== 0 && \!loading && (  
              \<div className="organic-card rounded-3xl p-6 text-center"\>  
                \<p className="text-\[13px\] text-ink-soft"\>Nu sunt noutăți momentan.\</p\>  
              \</div\>  
            )}  
            {news.map((n) \=\> (  
              \<button key={n.id} onClick={() \=\> navigate(\`/noutati/\${n.id}\`)}  
                className="tap-scale organic-card rounded-3xl p-4 text-left w-full flex items-start gap-3.5"\>  
                \<span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-sage-soft flex items-center justify-center"\>  
                  \<ShieldCheck className="w-5 h-5 text-sage-deep" strokeWidth={1.8} /\>  
                \</span\>  
                \<div className="min-w-0 flex-1"\>  
                  \<div className="flex items-center gap-2"\>  
                    \<span className="micro-label text-sage-deep"\>Noutăți\</span\>  
                    \<span className="text-\[10px\] text-ink-soft/70"\>·\</span\>  
                    \<span className="text-\[10px\] text-ink-soft/70"\>{formatDateRo(n.date)}\</span\>  
                  \</div\>  
                  \<p className="text-\[13px\] font-semibold text-ink mt-1 leading-snug"\>{n.title}\</p\>  
                  {n.summary && \<p className="text-\[11.5px\] text-ink-soft mt-1 leading-relaxed line-clamp-2"\>{n.summary}\</p\>}  
                \</div\>  
                \<ChevronRight className="w-4 h-4 text-ink-soft/50 flex-shrink-0 mt-3" /\>  
              \</button\>  
            ))}  
          \</div\>  
        \</section\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/GuideDetail.jsx\`

\`\`\`jsx  
import React, { useState, useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";  
import { base44 } from "@/api/base44Client";  
import StatusBar from "@/components/StatusBar";  
import { Image } from "@/components/ui/image";  
import ReactMarkdown from "react-markdown";  
import { ArrowLeft } from "lucide-react";

export default function GuideDetail() {  
  const { id } \= useParams();  
  const navigate \= useNavigate();  
  const \[guide, setGuide\] \= useState(null);  
  const \[loading, setLoading\] \= useState(true);

  useEffect(() \=\> {  
    (async () \=\> {  
      try { const g \= await base44.entities.Guide.get(id); setGuide(g); }  
      catch (e) { console.error(e); }  
      finally { setLoading(false); }  
    })();  
  }, \[id\]);

  if (loading) return \<div className="app-shell min-h-screen flex items-center justify-center"\>\<div className="w-8 h-8 border-4 border-sage-soft border-t-sage rounded-full animate-spin" /\>\</div\>;  
  if (\!guide) return \<div className="app-shell min-h-screen flex items-center justify-center text-ink-soft"\>Articol indisponibil.\</div\>;

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<div className="px-5 pt-3 pb-2 flex items-center gap-2"\>  
        \<button onClick={() \=\> navigate("/ghiduri")} className="tap-scale w-10 h-10 rounded-full bg-white border border-warmborder flex items-center justify-center shadow-soft"\>  
          \<ArrowLeft className="w-5 h-5 text-ink" /\>  
        \</button\>  
        \<span className="text-\[12px\] text-ink-soft font-medium"\>Ghiduri\</span\>  
      \</div\>  
      {guide.image\_url && (  
        \<div className="relative h-52 w-full"\>  
          \<Image src={guide.image\_url} alt={guide.title} className="w-full h-full" fittingType="fill" /\>  
          \<div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" /\>  
        \</div\>  
      )}  
      \<div className="px-6 pt-5 pb-10"\>  
        \<p className="micro-label"\>{guide.tag}\</p\>  
        \<h1 className="font-heading text-\[24px\] text-ink mt-2 leading-tight"\>{guide.title}\</h1\>  
        {guide.summary && \<p className="text-\[14px\] text-ink-soft mt-3 leading-relaxed"\>{guide.summary}\</p\>}  
        {guide.content && (  
          \<div className="mt-5 prose-onco"\>  
            \<ReactMarkdown\>{guide.content}\</ReactMarkdown\>  
          \</div\>  
        )}  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/NewsDetail.jsx\`

\`\`\`jsx  
import React, { useState, useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";  
import { base44 } from "@/api/base44Client";  
import StatusBar from "@/components/StatusBar";  
import ReactMarkdown from "react-markdown";  
import { ArrowLeft, ShieldCheck } from "lucide-react";  
import { formatDateRo } from "@/lib/onco";

export default function NewsDetail() {  
  const { id } \= useParams();  
  const navigate \= useNavigate();  
  const \[news, setNews\] \= useState(null);  
  const \[loading, setLoading\] \= useState(true);

  useEffect(() \=\> {  
    (async () \=\> {  
      try { const n \= await base44.entities.NewsUpdate.get(id); setNews(n); }  
      catch (e) { console.error(e); }  
      finally { setLoading(false); }  
    })();  
  }, \[id\]);

  if (loading) return \<div className="app-shell min-h-screen flex items-center justify-center"\>\<div className="w-8 h-8 border-4 border-sage-soft border-t-sage rounded-full animate-spin" /\>\</div\>;  
  if (\!news) return \<div className="app-shell min-h-screen flex items-center justify-center text-ink-soft"\>Articol indisponibil.\</div\>;

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<div className="px-5 pt-3 pb-2 flex items-center gap-2"\>  
        \<button onClick={() \=\> navigate("/ghiduri")} className="tap-scale w-10 h-10 rounded-full bg-white border border-warmborder flex items-center justify-center shadow-soft"\>  
          \<ArrowLeft className="w-5 h-5 text-ink" /\>  
        \</button\>  
        \<span className="text-\[12px\] text-ink-soft font-medium"\>Noutăți\</span\>  
      \</div\>  
      \<div className="px-6 pt-4 pb-10"\>  
        \<div className="flex items-center gap-2 mb-3"\>  
          \<span className="w-10 h-10 rounded-2xl bg-sage-soft flex items-center justify-center"\>  
            \<ShieldCheck className="w-5 h-5 text-sage-deep" strokeWidth={1.8} /\>  
          \</span\>  
          \<span className="text-\[11px\] text-ink-soft"\>{formatDateRo(news.date)}\</span\>  
        \</div\>  
        \<h1 className="font-heading text-\[24px\] text-ink leading-tight"\>{news.title}\</h1\>  
        {news.summary && \<p className="text-\[14px\] text-ink-soft mt-3 leading-relaxed"\>{news.summary}\</p\>}  
        {news.content && (  
          \<div className="mt-5 prose-onco"\>  
            \<ReactMarkdown\>{news.content}\</ReactMarkdown\>  
          \</div\>  
        )}  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/Profil.jsx\`

\`\`\`jsx  
import React, { useState, useEffect, useCallback } from "react";  
import { useNavigate } from "react-router-dom";  
import { base44 } from "@/api/base44Client";  
import { useAuth } from "@/lib/AuthContext";  
import StatusBar from "@/components/StatusBar";  
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { Switch } from "@/components/ui/switch";  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";  
import { User as UserIcon, Pill, CalendarHeart, Bell, LogOut, Pencil, Plus, ChevronRight, MapPin } from "lucide-react";  
import { PillIcon } from "@/components/Botanical";  
import { formatDateRo, daysUntil } from "@/lib/onco";

export default function Profil() {  
  const { user, logout } \= useAuth();  
  const navigate \= useNavigate();  
  const \[med, setMed\] \= useState(null);  
  const \[appts, setAppts\] \= useState(\[\]);  
  const \[settings, setSettings\] \= useState({  
    dose\_reminder\_enabled: true,  
    appointment\_reminder\_enabled: true,  
    display\_name: "",  
  });  
  const \[editName, setEditName\] \= useState(false);  
  const \[nameVal, setNameVal\] \= useState("");  
  const \[addAppt, setAddAppt\] \= useState(false);  
  const \[apptForm, setApptForm\] \= useState({ date: "", specialty: "Oncologie", doctor: "", center: "" });

  const load \= useCallback(async () \=\> {  
    try {  
      const \[meds, apptsRes\] \= await Promise.all(\[  
        base44.entities.Medication.filter({ active: true }, { sort: "-created\_date", limit: 1 }),  
        base44.entities.Appointment.filter({}, { sort: "date", limit: 20 }),  
      \]);  
      setMed(meds.items?.\[0\] || null);  
      setAppts(apptsRes.items || \[\]);  
      const dn \= user?.display\_name || "";  
      setSettings({  
        dose\_reminder\_enabled: user?.dose\_reminder\_enabled ?? true,  
        appointment\_reminder\_enabled: user?.appointment\_reminder\_enabled ?? true,  
        display\_name: dn,  
      });  
      setNameVal(dn);  
    } catch (e) { console.error(e); }  
  }, \[user\]);

  useEffect(() \=\> { load(); }, \[load\]);

  const saveSetting \= async (key, val) \=\> {  
    setSettings((s) \=\> ({ ...s, \[key\]: val }));  
    try { await base44.auth.updateMe({ \[key\]: val }); } catch (e) { console.error(e); }  
  };

  const saveName \= async () \=\> {  
    try {  
      await base44.auth.updateMe({ display\_name: nameVal });  
      setSettings((s) \=\> ({ ...s, display\_name: nameVal }));  
      setEditName(false);  
    } catch (e) { console.error(e); }  
  };

  const saveAppt \= async () \=\> {  
    try {  
      const created \= await base44.entities.Appointment.create({ ...apptForm, status: "upcoming" });  
      setAppts((prev) \=\> \[...prev, created\].sort((a, b) \=\> a.date.localeCompare(b.date)));  
      setAddAppt(false);  
      setApptForm({ date: "", specialty: "Oncologie", doctor: "", center: "" });  
      if (settings.appointment\_reminder\_enabled) {  
        try { await base44.functions.invoke("sendAppointmentReminder", { appointment\_id: created.id }); }  
        catch (e) { console.error(e); }  
      }  
    } catch (e) { console.error(e); }  
  };

  const displayName \= settings.display\_name || (user?.email ? user.email.split("@")\[0\] : "Pacientă");  
  const upcoming \= appts.filter((a) \=\> a.status \=== "upcoming" && daysUntil(a.date) \>= 0);

  return (  
    \<div className="min-h-screen"\>  
      \<StatusBar /\>  
      \<header className="px-6 pt-4 pb-3"\>  
        \<h1 className="font-heading text-2xl text-ink"\>Profil\</h1\>  
      \</header\>  
      \<div className="px-5 space-y-5"\>  
        \<div className="organic-card rounded-\[28px\] p-5 flex items-center gap-4"\>  
          \<div className="w-16 h-16 rounded-full bg-sage-soft flex items-center justify-center flex-shrink-0"\>  
            \<UserIcon className="w-7 h-7 text-sage-deep" strokeWidth={1.6} /\>  
          \</div\>  
          \<div className="min-w-0 flex-1"\>  
            \<h2 className="font-heading text-xl text-ink truncate"\>{displayName}\</h2\>  
            \<p className="text-\[12px\] text-ink-soft truncate"\>{user?.email}\</p\>  
          \</div\>  
          \<button onClick={() \=\> setEditName(true)} className="tap-scale w-10 h-10 rounded-full bg-cream-deep flex items-center justify-center"\>  
            \<Pencil className="w-4 h-4 text-ink-soft" /\>  
          \</button\>  
        \</div\>  
        \<div className="sage-card rounded-\[28px\] p-5"\>  
          \<div className="flex items-center gap-2 mb-3"\>  
            \<Pill className="w-4 h-4 text-sage-deep" /\>  
            \<p className="micro-label"\>Tratament curent\</p\>  
          \</div\>  
          {med ? (  
            \<div className="flex items-center gap-3.5"\>  
              \<div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center"\>  
                \<PillIcon className="w-8 h-8" /\>  
              \</div\>  
              \<div\>  
                \<p className="font-heading text-lg text-sage-deep"\>{med.name}\</p\>  
                \<p className="text-\[12px\] text-ink-soft"\>{med.dose} • {med.frequency} • {med.time\_of\_day}\</p\>  
              \</div\>  
            \</div\>  
          ) : (  
            \<p className="text-\[13px\] text-ink-soft"\>Niciun tratament adăugat.\</p\>  
          )}  
          \<button onClick={() \=\> navigate("/tratament")} className="tap-scale mt-4 w-full text-\[13px\] font-semibold text-sage-deep flex items-center justify-center gap-1 py-2 rounded-2xl bg-white/50"\>  
            Gestionează tratamentul \<ChevronRight className="w-4 h-4" /\>  
          \</button\>  
        \</div\>  
        \<div className="organic-card rounded-\[28px\] p-5"\>  
          \<div className="flex items-center justify-between mb-3"\>  
            \<div className="flex items-center gap-2"\>  
              \<CalendarHeart className="w-4 h-4 text-sage-deep" /\>  
              \<p className="micro-label"\>Controale medicale\</p\>  
            \</div\>  
            \<button onClick={() \=\> setAddAppt(true)} className="tap-scale w-8 h-8 rounded-full bg-sage-soft flex items-center justify-center"\>  
              \<Plus className="w-4 h-4 text-sage-deep" /\>  
            \</button\>  
          \</div\>  
          \<div className="space-y-3"\>  
            {upcoming.length \=== 0 && (  
              \<p className="text-\[13px\] text-ink-soft/70 text-center py-3"\>Niciun control viitor. Adaugă unul cu butonul \+.\</p\>  
            )}  
            {upcoming.map((a) \=\> {  
              const d \= daysUntil(a.date);  
              return (  
                \<div key={a.id} className="flex items-start gap-3 p-3 rounded-2xl bg-cream-deep/40"\>  
                  \<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex flex-col items-center justify-center"\>  
                    \<span className="text-\[10px\] text-ink-soft font-medium uppercase"\>{new Date(a.date \+ "T00:00").toLocaleDateString("ro", { month: "short" })}\</span\>  
                    \<span className="font-heading text-lg text-sage-deep leading-none"\>{new Date(a.date \+ "T00:00").getDate()}\</span\>  
                  \</div\>  
                  \<div className="min-w-0 flex-1"\>  
                    \<p className="text-\[13px\] font-semibold text-ink"\>{a.specialty}\</p\>  
                    {a.doctor && \<p className="text-\[12px\] text-ink-soft mt-0.5"\>{a.doctor}\</p\>}  
                    {a.center && \<p className="text-\[11px\] text-ink-soft/80 flex items-center gap-1 mt-0.5"\>\<MapPin className="w-3 h-3" /\>{a.center}\</p\>}  
                  \</div\>  
                  {d \!== null && d \>= 0 && (  
                    \<span className="flex-shrink-0 px-2 py-1 rounded-full bg-sage-soft text-sage-deep text-\[10px\] font-semibold"\>  
                      peste {d} {d \=== 1 ? "zi" : "zile"}  
                    \</span\>  
                  )}  
                \</div\>  
              );  
            })}  
          \</div\>  
        \</div\>  
        \<div className="organic-card rounded-\[28px\] p-5"\>  
          \<div className="flex items-center gap-2 mb-4"\>  
            \<Bell className="w-4 h-4 text-sage-deep" /\>  
            \<p className="micro-label"\>Notificări\</p\>  
          \</div\>  
          \<div className="space-y-4"\>  
            \<div className="flex items-center justify-between"\>  
              \<div\>  
                \<p className="text-\[13px\] font-semibold text-ink"\>Reminder doză zilnică\</p\>  
                \<p className="text-\[11px\] text-ink-soft mt-0.5"\>Memento blând la ora administrării\</p\>  
              \</div\>  
              \<Switch checked={settings.dose\_reminder\_enabled} onCheckedChange={(v) \=\> saveSetting("dose\_reminder\_enabled", v)} /\>  
            \</div\>  
            \<div className="h-px bg-warmborder/60" /\>  
            \<div className="flex items-center justify-between"\>  
              \<div\>  
                \<p className="text-\[13px\] font-semibold text-ink"\>Reminder controale\</p\>  
                \<p className="text-\[11px\] text-ink-soft mt-0.5"\>Înainte de următoarea programare\</p\>  
              \</div\>  
              \<Switch checked={settings.appointment\_reminder\_enabled} onCheckedChange={(v) \=\> saveSetting("appointment\_reminder\_enabled", v)} /\>  
            \</div\>  
          \</div\>  
        \</div\>  
        \<button onClick={() \=\> logout()} className="tap-scale w-full organic-card rounded-2xl p-4 flex items-center justify-center gap-2 text-ink-soft font-semibold text-\[14px\]"\>  
          \<LogOut className="w-4 h-4" /\> Deconectare  
        \</button\>  
      \</div\>  
      \<Dialog open={editName} onOpenChange={setEditName}\>  
        \<DialogContent className="rounded-3xl max-w-\[360px\]"\>  
          \<DialogHeader\>\<DialogTitle className="font-heading text-lg"\>Numele tău\</DialogTitle\>\</DialogHeader\>  
          \<Input value={nameVal} onChange={(e) \=\> setNameVal(e.target.value)} className="h-11 rounded-xl" autoFocus /\>  
          \<DialogFooter\>  
            \<Button variant="ghost" onClick={() \=\> setEditName(false)}\>Anulează\</Button\>  
            \<Button onClick={saveName} className="bg-sage hover:bg-sage-deep text-white rounded-xl"\>Salvează\</Button\>  
          \</DialogFooter\>  
        \</DialogContent\>  
      \</Dialog\>  
      \<Dialog open={addAppt} onOpenChange={setAddAppt}\>  
        \<DialogContent className="rounded-3xl max-w-\[380px\]"\>  
          \<DialogHeader\>\<DialogTitle className="font-heading text-lg"\>Adaugă control\</DialogTitle\>\</DialogHeader\>  
          \<div className="space-y-3"\>  
            \<div\>  
              \<Label className="text-\[13px\] font-semibold"\>Data\</Label\>  
              \<Input type="date" value={apptForm.date} onChange={(e) \=\> setApptForm({ ...apptForm, date: e.target.value })} className="h-11 rounded-xl" /\>  
            \</div\>  
            \<div className="grid grid-cols-2 gap-3"\>  
              \<div\>  
                \<Label className="text-\[13px\] font-semibold"\>Specialitate\</Label\>  
                \<Input value={apptForm.specialty} onChange={(e) \=\> setApptForm({ ...apptForm, specialty: e.target.value })} className="h-11 rounded-xl" /\>  
              \</div\>  
              \<div\>  
                \<Label className="text-\[13px\] font-semibold"\>Medic\</Label\>  
                \<Input value={apptForm.doctor} onChange={(e) \=\> setApptForm({ ...apptForm, doctor: e.target.value })} className="h-11 rounded-xl" /\>  
              \</div\>  
            \</div\>  
            \<div\>  
              \<Label className="text-\[13px\] font-semibold"\>Centru / Spital\</Label\>  
              \<Input value={apptForm.center} onChange={(e) \=\> setApptForm({ ...apptForm, center: e.target.value })} className="h-11 rounded-xl" /\>  
            \</div\>  
          \</div\>  
          \<DialogFooter\>  
            \<Button variant="ghost" onClick={() \=\> setAddAppt(false)}\>Anulează\</Button\>  
            \<Button onClick={saveAppt} disabled={\!apptForm.date} className="bg-sage hover:bg-sage-deep text-white rounded-xl"\>Adaugă\</Button\>  
          \</DialogFooter\>  
        \</DialogContent\>  
      \</Dialog\>  
    \</div\>  
  );  
}  
\`\`\`

\#\# \`src/pages/Onboarding.jsx\`

\`\`\`jsx  
import React, { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import { useAuth } from "@/lib/AuthContext";  
import { base44 } from "@/api/base44Client";  
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { Leaf, Pill, CalendarHeart, ArrowRight, Check } from "lucide-react";  
import { BotanicalBranch } from "@/components/Botanical";

export default function Onboarding() {  
  const { user } \= useAuth();  
  const navigate \= useNavigate();  
  const \[step, setStep\] \= useState(0);  
  const \[saving, setSaving\] \= useState(false);  
  const \[form, setForm\] \= useState({  
    name: user?.display\_name || "",  
    medName: "Tamoxifen",  
    medDose: "20 mg",  
    medFreq: "1 comprimat/zi",  
    medTime: "08:00",  
    apptDate: "",  
    apptSpecialty: "Oncologie",  
    apptDoctor: "",  
  });

  const set \= (k, v) \=\> setForm((f) \=\> ({ ...f, \[k\]: v }));

  const steps \= \[  
    { title: "Bun venit în OncoSentinel", sub: "Să configurăm împreună spațiul tău de îngrijire." },  
    { title: "Cum te numești?", sub: "Vom folosi numele tău pentru a te saluta cu căldură." },  
    { title: "Tratamentul tău", sub: "Spune-ne despre medicamentul pe care îl iei zilnic." },  
    { title: "Următorul control", sub: "Adaugă următoarea programare pentru a nu o uita." },  
  \];

  const finish \= async () \=\> {  
    setSaving(true);  
    try {  
      await base44.auth.updateMe({ display\_name: form.name, onboarding\_complete: true });  
      await base44.entities.Medication.create({  
        name: form.medName, dose: form.medDose, frequency: form.medFreq, time\_of\_day: form.medTime, active: true,  
      });  
      if (form.apptDate) {  
        await base44.entities.Appointment.create({  
          date: form.apptDate, specialty: form.apptSpecialty, doctor: form.apptDoctor, status: "upcoming",  
        });  
      }  
      navigate("/");  
      window.location.reload();  
    } catch (e) { console.error(e); setSaving(false); }  
  };

  const next \= () \=\> setStep((s) \=\> Math.min(s \+ 1, steps.length \- 1));  
  const back \= () \=\> setStep((s) \=\> Math.max(s \- 1, 0));

  return (  
    \<div className="app-shell flex flex-col min-h-screen relative"\>  
      \<div className="absolute top-0 left-0 w-40 h-52 pointer-events-none opacity-60"\>  
        \<BotanicalBranch className="w-full h-full" style={{ transform: "scaleX(-1)" }} /\>  
      \</div\>  
      \<div className="flex-1 flex flex-col justify-center px-7 py-10 relative"\>  
        \<div className="flex items-center gap-2 mb-8"\>  
          {steps.map((\_, i) \=\> (  
            \<span key={i} className={\`h-1.5 rounded-full transition-all duration-400 \${i \<= step ? "bg-sage w-8" : "bg-warmborder w-4"}\`} /\>  
          ))}  
        \</div\>  
        \<div key={step} className="animate-fade-in"\>  
          {step \=== 0 && (  
            \<div className="text-center"\>  
              \<div className="inline-flex w-16 h-16 rounded-3xl bg-sage-soft items-center justify-center mb-5"\>  
                \<Leaf className="w-8 h-8 text-sage-deep" strokeWidth={1.6} /\>  
              \</div\>  
              \<h1 className="font-heading text-2xl text-ink leading-tight"\>{steps\[0\].title}\</h1\>  
              \<p className="text-\[14px\] text-ink-soft mt-3 leading-relaxed"\>{steps\[0\].sub}\</p\>  
              \<p className="text-\[13px\] text-ink-soft/80 mt-6 leading-relaxed"\>  
                Aici vei găsi sprijin blând pentru tratament, dispoziție și controale — totul într-un loc cald, doar pentru tine.  
              \</p\>  
            \</div\>  
          )}  
          {step \=== 1 && (  
            \<FieldBlock title={steps\[1\].title} sub={steps\[1\].sub}\>  
              \<Label className="text-\[13px\] font-semibold text-ink"\>Numele tău\</Label\>  
              \<Input value={form.name} onChange={(e) \=\> set("name", e.target.value)} placeholder="ex: Andreea"  
                className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" autoFocus /\>  
            \</FieldBlock\>  
          )}  
          {step \=== 2 && (  
            \<FieldBlock title={steps\[2\].title} sub={steps\[2\].sub} icon={Pill}\>  
              \<div className="space-y-3"\>  
                \<div\>  
                  \<Label className="text-\[13px\] font-semibold text-ink"\>Denumire medicament\</Label\>  
                  \<Input value={form.medName} onChange={(e) \=\> set("medName", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                \</div\>  
                \<div className="grid grid-cols-2 gap-3"\>  
                  \<div\>  
                    \<Label className="text-\[13px\] font-semibold text-ink"\>Doză\</Label\>  
                    \<Input value={form.medDose} onChange={(e) \=\> set("medDose", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                  \</div\>  
                  \<div\>  
                    \<Label className="text-\[13px\] font-semibold text-ink"\>Frecvență\</Label\>  
                    \<Input value={form.medFreq} onChange={(e) \=\> set("medFreq", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                  \</div\>  
                \</div\>  
                \<div\>  
                  \<Label className="text-\[13px\] font-semibold text-ink"\>Ora administrării\</Label\>  
                  \<Input type="time" value={form.medTime} onChange={(e) \=\> set("medTime", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                \</div\>  
              \</div\>  
            \</FieldBlock\>  
          )}  
          {step \=== 3 && (  
            \<FieldBlock title={steps\[3\].title} sub={steps\[3\].sub} icon={CalendarHeart}\>  
              \<div className="space-y-3"\>  
                \<div\>  
                  \<Label className="text-\[13px\] font-semibold text-ink"\>Data controlului\</Label\>  
                  \<Input type="date" value={form.apptDate} onChange={(e) \=\> set("apptDate", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                \</div\>  
                \<div className="grid grid-cols-2 gap-3"\>  
                  \<div\>  
                    \<Label className="text-\[13px\] font-semibold text-ink"\>Specialitate\</Label\>  
                    \<Input value={form.apptSpecialty} onChange={(e) \=\> set("apptSpecialty", e.target.value)} className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                  \</div\>  
                  \<div\>  
                    \<Label className="text-\[13px\] font-semibold text-ink"\>Medic\</Label\>  
                    \<Input value={form.apptDoctor} onChange={(e) \=\> set("apptDoctor", e.target.value)} placeholder="ex: Dr. Popescu" className="h-12 rounded-2xl bg-cream-deep/40 border-warmborder" /\>  
                  \</div\>  
                \</div\>  
                \<p className="text-\[11px\] text-ink-soft/70 mt-1"\>Poți adăuga și mai târziu din secțiunea Profil.\</p\>  
              \</div\>  
            \</FieldBlock\>  
          )}  
        \</div\>  
        \<div className="flex items-center gap-3 mt-8"\>  
          {step \> 0 && (  
            \<Button variant="ghost" onClick={back} className="h-12 px-5 rounded-2xl text-ink-soft"\>Înapoi\</Button\>  
          )}  
          {step \< steps.length \- 1 ? (  
            \<Button onClick={next} className="flex-1 h-12 rounded-2xl bg-sage hover:bg-sage-deep text-white font-semibold"\>  
              Continuă \<ArrowRight className="w-4 h-4 ml-2" /\>  
            \</Button\>  
          ) : (  
            \<Button onClick={finish} disabled={saving} className="flex-1 h-12 rounded-2xl bg-sage hover:bg-sage-deep text-white font-semibold"\>  
              {saving ? "Salvez..." : "Gata, intră în app"}  
              {\!saving && \<Check className="w-4 h-4 ml-2" /\>}  
            \</Button\>  
          )}  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

function FieldBlock({ title, sub, icon: Icon, children }) {  
  return (  
    \<div\>  
      {Icon && (  
        \<div className="inline-flex w-12 h-12 rounded-2xl bg-sage-soft items-center justify-center mb-4"\>  
          \<Icon className="w-6 h-6 text-sage-deep" strokeWidth={1.7} /\>  
        \</div\>  
      )}  
      \<h1 className="font-heading text-\[22px\] text-ink leading-tight"\>{title}\</h1\>  
      \<p className="text-\[13px\] text-ink-soft mt-2 mb-5 leading-relaxed"\>{sub}\</p\>  
      {children}  
    \</div\>  
  );  
}  
\`\`  
