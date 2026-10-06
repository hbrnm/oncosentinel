export const backupService = {
  exportCompleteBackup() {
    const backupData = {
      app: 'NaviMed',
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
      next_control_date: localStorage.getItem('navimed_next_control_date')
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
        try { JSON.parse(data.profile); localStorage.setItem('navimed_profile', data.profile); } catch (_) {}
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

      alert('✅ Backup-ul a fost restaurat cu succes! Aplicația se va reîncărca pentru a aplica datele.');
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Error importing backup:', e);
      alert('A apărut o eroare la citirea fișierului de backup.');
      return false;
    }
  },

  getRawBackupPayload() {
    return {
      app: 'NaviMed',
      version: '1.0',
      synced_at: new Date().toISOString(),
      profile: localStorage.getItem('navimed_profile'),
      doses: localStorage.getItem('navimed_doses'),
      symptoms: localStorage.getItem('navimed_symptoms'),
      documents: localStorage.getItem('navimed_docs'),
      milestones: localStorage.getItem('navimed_milestones'),
      doctor_questions: localStorage.getItem('navimed_doctor_questions'),
      supporter: localStorage.getItem('navimed_supporter'),
      shopping_list: localStorage.getItem('navimed_shopping_list'),
      exercise_minutes: localStorage.getItem('navimed_exercise_minutes'),
      next_control_date: localStorage.getItem('navimed_next_control_date')
    };
  },

  applyPayload(data: any): boolean {
    if (!data || data.app !== 'NaviMed') return false;
    if (data.profile) localStorage.setItem('navimed_profile', data.profile);
    if (data.doses) localStorage.setItem('navimed_doses', data.doses);
    if (data.symptoms) localStorage.setItem('navimed_symptoms', data.symptoms);
    if (data.documents) localStorage.setItem('navimed_docs', data.documents);
    if (data.milestones) localStorage.setItem('navimed_milestones', data.milestones);
    if (data.doctor_questions) localStorage.setItem('navimed_doctor_questions', data.doctor_questions);
    if (data.supporter) localStorage.setItem('navimed_supporter', data.supporter);
    if (data.shopping_list) localStorage.setItem('navimed_shopping_list', data.shopping_list);
    if (data.exercise_minutes) localStorage.setItem('navimed_exercise_minutes', data.exercise_minutes);
    if (data.next_control_date) localStorage.setItem('navimed_next_control_date', data.next_control_date);
    return true;
  }
};
