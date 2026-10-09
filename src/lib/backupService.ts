import { vault } from './vault';
import { markBackupDone } from './backupReminder';

export const backupService = {
  exportCompleteBackup() {
    const backupData = {
      app: 'OncoSentinel',
      version: '1.0',
      exported_at: new Date().toISOString(),
      profile: localStorage.getItem('navimed_profile'),
      doses: localStorage.getItem('navimed_doses'),
      symptoms: localStorage.getItem('navimed_symptoms'),
      documents: localStorage.getItem('navimed_docs'),
      milestones: localStorage.getItem('navimed_milestones'),
      doctor_questions: localStorage.getItem('navimed_doctor_questions'),
      supporter: localStorage.getItem('navimed_supporter'),
      shopping_list: localStorage.getItem('navimed_shopping_list'),
      exercise_minutes: localStorage.getItem('navimed_exercise_minutes'),
      next_control_date: localStorage.getItem('navimed_next_control_date'),
      doctor_questions_custom: localStorage.getItem('navimed_doctor_questions_custom'),
      appointments: localStorage.getItem('navimed_appointments_list'),
      doctor_name: localStorage.getItem('navimed_doctor_name'),
      victories_seen: localStorage.getItem('oncosentinel_victories_seen')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oncosentinel_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    markBackupDone();
  },

  async importBackupFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.app !== 'OncoSentinel' && data.app !== 'NaviMed') {
        alert('Fișierul selectat nu este un backup recunoscut OncoSentinel.');
        return false;
      }

      // Check structure validity
      if (data.profile) {
        try {
          const profile = JSON.parse(data.profile);
          localStorage.setItem('navimed_profile', data.profile);
          // Un profil restaurat (cu conținut) e deja configurat: fără fereastra de configurare peste el
          if (profile && typeof profile === 'object' && !Array.isArray(profile) && Object.keys(profile).length > 0) {
            localStorage.setItem('oncosentinel_onboarded', 'true');
          }
        } catch (_) {}
      }
      if (data.doses) {
        try { JSON.parse(data.doses); localStorage.setItem('navimed_doses', data.doses); } catch (_) {}
      }
      if (data.symptoms) {
        try { JSON.parse(data.symptoms); localStorage.setItem('navimed_symptoms', data.symptoms); } catch (_) {}
      }
      if (data.documents) {
        try { JSON.parse(data.documents); localStorage.setItem('navimed_docs', data.documents); } catch (_) {}
      }
      if (data.milestones) {
        try { JSON.parse(data.milestones); localStorage.setItem('navimed_milestones', data.milestones); } catch (_) {}
      }
      if (data.doctor_questions) {
        try { JSON.parse(data.doctor_questions); localStorage.setItem('navimed_doctor_questions', data.doctor_questions); } catch (_) {}
      }
      if (data.supporter) {
        try { JSON.parse(data.supporter); localStorage.setItem('navimed_supporter', data.supporter); } catch (_) {}
      }
      if (data.shopping_list) {
        try { JSON.parse(data.shopping_list); localStorage.setItem('navimed_shopping_list', data.shopping_list); } catch (_) {}
      }
      if (data.exercise_minutes) {
        localStorage.setItem('navimed_exercise_minutes', data.exercise_minutes);
      }
      if (data.next_control_date) {
        localStorage.setItem('navimed_next_control_date', data.next_control_date);
      }
      if (data.doctor_questions_custom) {
        try { JSON.parse(data.doctor_questions_custom); localStorage.setItem('navimed_doctor_questions_custom', data.doctor_questions_custom); } catch (_) {}
      }
      if (data.appointments) {
        try { JSON.parse(data.appointments); localStorage.setItem('navimed_appointments_list', data.appointments); } catch (_) {}
      }
      if (data.doctor_name) {
        localStorage.setItem('navimed_doctor_name', data.doctor_name);
      }
      if (data.victories_seen) {
        try { JSON.parse(data.victories_seen); localStorage.setItem('oncosentinel_victories_seen', data.victories_seen); } catch (_) {}
      }

      // Datele restaurate au deja o copie: cea din care au venit
      const exportedAt = new Date(data.exported_at);
      if (!Number.isNaN(exportedAt.getTime())) markBackupDone(exportedAt);

      // Cu PIN activ, datele se criptează asincron: așteptăm scrierea înainte de reîncărcare
      await vault.flush();
      alert('✅ Backup-ul a fost restaurat cu succes! Aplicația se va reîncărca pentru a aplica datele.');
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Error importing backup:', e);
      alert('A apărut o eroare la citirea fișierului de backup.');
      return false;
    }
  }
};
