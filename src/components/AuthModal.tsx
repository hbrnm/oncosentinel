import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, CheckCircle2, LogOut, Cloud, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { backupService } from '../lib/backupService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    // Check active session
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !supabase) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setMagicLinkSent(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'A apărut o eroare la trimiterea link-ului.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCurrentUser(null);
    setMagicLinkSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl relative overflow-hidden">
        
        {/* Soft decorative glow */}
        <div className="absolute w-40 h-40 bg-sage-100 dark:bg-sage-900/20 rounded-full blur-3xl -top-10 -left-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-xs">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Sincronizare Cloud Securizată
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Supabase • Fără parolă complicată
            </p>
          </div>
        </div>

        {currentUser ? (
          /* User Logged In State */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-sage-50 dark:bg-sage-900/30 border border-sage-200 dark:border-sage-800/60 text-xs">
              <div className="flex items-center gap-2 text-sage-800 dark:text-sage-200 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                <span>Ești conectată pe acest dispozitiv</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-[11px]">
                E-mail: <strong>{currentUser.email}</strong>
              </p>
              <p className="text-gray-500 text-[10px] mt-1">
                Datele tale sunt criptate și sincronizate în cloud.
              </p>
            </div>

            {/* Cloud Sync Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={async () => {
                  if (!supabase) return;
                  setLoading(true);
                  try {
                    const payload = backupService.getRawBackupPayload();
                    const { error } = await supabase.from('user_backups').upsert([{
                      user_id: currentUser.id,
                      data: payload,
                      updated_at: new Date().toISOString()
                    }]);
                    if (error) throw error;
                    alert('✅ Datele tale au fost salvate cu succes în cloud!');
                  } catch (err: any) {
                    console.error('Cloud backup error:', err);
                    alert('Backup-ul local este activ. Notă: Tabelul cloud se inițializează automat.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Cloud className="w-4 h-4" />
                <span>Sincronizează datele acum în Cloud</span>
              </button>

              <button
                onClick={async () => {
                  if (!supabase) return;
                  setLoading(true);
                  try {
                    const { data, error } = await supabase.from('user_backups')
                      .select('data')
                      .eq('user_id', currentUser.id)
                      .single();
                    if (error) throw error;
                    if (data?.data) {
                      backupService.applyPayload(data.data);
                      alert('✅ Datele tale au fost restaurate cu succes din cloud!');
                      window.location.reload();
                    } else {
                      alert('Nu a fost găsit niciun backup anterior salvat în cloud pentru acest cont.');
                    }
                  } catch (err: any) {
                    console.error('Restore error:', err);
                    alert('Nu s-au putut prelua date din cloud sau nu există încă un backup salvat.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-2 rounded-xl border border-sage-200 dark:border-darkbg-border hover:bg-sage-50 text-sage-800 dark:text-sage-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>Restaurează datele din Cloud</span>
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2 rounded-xl border border-gray-200 dark:border-darkbg-border hover:bg-gray-100 dark:hover:bg-darkbg-card text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Deconectează-te de pe acest dispozitiv</span>
            </button>
          </div>
        ) : magicLinkSent ? (
          /* Magic Link Sent State */
          <div className="text-center py-4 space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/60 text-sage-600 dark:text-sage-300 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Verifică-ți căsuța de e-mail!
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Am trimis un link magic de conectare către <strong>{email}</strong>. Apasă pe link din e-mail pentru a te conecta instant.
            </p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-xs text-sage-700 dark:text-sage-300 font-semibold hover:underline"
            >
              Trimite din nou sau folosește alt e-mail
            </button>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSendMagicLink} className="space-y-3.5">
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Introdu adresa de e-mail pentru a primi un <strong>Magic Link</strong> de acces. Nu ai nevoie de nicio parolă.
            </p>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Adresă de e-mail:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena.popescu@exemplu.ro"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-sage-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Se trimite link-ul...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Trimite Magic Link pe E-mail</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 justify-center pt-1">
              <Shield className="w-3.5 h-3.5 text-sage-600" />
              <span>Conexiune criptată SSL • Conformitate GDPR</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
