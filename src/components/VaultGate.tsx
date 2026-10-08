import React, { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { vault } from '../lib/vault';
import { STORAGE_FULL_MESSAGE } from '../lib/supabase';

const LOCK_AFTER_MS = 5 * 60 * 1000;

// Cere PIN-ul la deschidere și după 5 minute în fundal; aplicația se montează din nou după deblocare
export const VaultGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locked, setLocked] = useState<boolean>(() => vault.isEnabled() && !vault.isUnlocked());
  const [session, setSession] = useState<number>(0);
  const hiddenAt = useRef<number | null>(null);

  useEffect(() => {
    vault.setPersistErrorHandler(() => alert(STORAGE_FULL_MESSAGE));
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
        vault.flush();
        return;
      }
      if (hiddenAt.current && vault.isUnlocked() && Date.now() - hiddenAt.current > LOCK_AFTER_MS) {
        vault.lock().then(() => setLocked(true));
      }
      hiddenAt.current = null;
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (locked) {
    return (
      <LockScreen
        onUnlocked={() => {
          setLocked(false);
          setSession((n) => n + 1);
        }}
      />
    );
  }
  return <React.Fragment key={session}>{children}</React.Fragment>;
};

const LockScreen: React.FC<{ onUnlocked: () => void }> = ({ onUnlocked }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [forgot, setForgot] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const ok = await vault.unlock(pin);
    setChecking(false);
    if (ok) onUnlocked();
    else {
      setError(true);
      setPin('');
    }
  };

  const eraseAndRestart = () => {
    if (!confirm('Sigur ștergi toate datele de pe acest telefon? Nu pot fi recuperate fără o copie de siguranță.')) return;
    vault.eraseAll();
    onUnlocked();
  };

  return (
    <main className="min-h-screen bg-cream dark:bg-darkbg flex items-center justify-center p-6">
      <div className="w-full max-w-xs text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-sage-soft text-sage-deep flex items-center justify-center mb-5">
          <Lock className="w-6 h-6" />
        </div>

        {!forgot ? (
          <form onSubmit={submit}>
            <h1 className="font-serif text-xl text-ink dark:text-white">Bine ai revenit. Introdu PIN-ul.</h1>
            <label className="block mt-5">
              <span className="sr-only">PIN</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(false); }}
                className="w-40 text-center tracking-[0.6em] text-2xl py-3 rounded-2xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white"
                autoFocus
              />
            </label>
            {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300 mt-3">PIN greșit. Mai încearcă.</p>}
            <button
              type="submit"
              disabled={pin.length !== 4 || checking}
              className="mt-5 w-full py-3 rounded-2xl bg-sage-deep text-white text-sm font-semibold disabled:opacity-50"
            >
              Deblochează
            </button>
            <button type="button" onClick={() => setForgot(true)} className="mt-4 text-xs font-semibold text-sage-deep dark:text-sage-300 underline">
              Am uitat PIN-ul
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm text-ink dark:text-gray-100 leading-relaxed">
              Fără PIN, datele criptate nu se pot deschide. Poți șterge datele de pe acest telefon și să restaurezi o copie de siguranță, dacă ai una.
            </p>
            <button type="button" onClick={eraseAndRestart} className="mt-5 w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold">
              Șterge datele și începe din nou
            </button>
            <button type="button" onClick={() => setForgot(false)} className="mt-4 text-xs font-semibold text-sage-deep dark:text-sage-300 underline">
              Înapoi
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
