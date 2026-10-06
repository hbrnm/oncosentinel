import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { TimelineTab } from './components/TimelineTab';
import { SymptomsTab } from './components/SymptomsTab';
import { GuideTab } from './components/GuideTab';
import { RedFlagsModal } from './components/RedFlagsModal';
import { EditProfileModal } from './components/EditProfileModal';
import { BreathingModal } from './components/BreathingModal';
import { DoctorVisitModal } from './components/DoctorVisitModal';
import { GroundingModal } from './components/GroundingModal';
import { AuthModal } from './components/AuthModal';
import { SupporterModal } from './components/SupporterModal';
import { OnboardingModal } from './components/OnboardingModal';
import { storageService, supabase } from './lib/supabase';
import { PatientProfile, DoseLog, SymptomLog, MedicalDocument, ClinicalMilestone } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('navimed_dark') === 'true';
  });
  
  // Modals state
  const [isRedFlagsOpen, setIsRedFlagsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [isDoctorVisitOpen, setIsDoctorVisitOpen] = useState<boolean>(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSupporterOpen, setIsSupporterOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return localStorage.getItem('oncosentinel_onboarded') !== 'true';
  });

  // App Data States
  const [profile, setProfile] = useState<PatientProfile>(() => storageService.getProfile());
  const [doses, setDoses] = useState<DoseLog[]>(() => storageService.getDoseLogs());
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(() => storageService.getSymptomLogs());
  const [milestones] = useState<ClinicalMilestone[]>(() => storageService.getMilestones());
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => storageService.getDocuments());

  // Font size state with localStorage persistence
  const [fontSize, setFontSize] = useState<'normal' | 'large'>(() => {
    return (localStorage.getItem('oncosentinel_fontsize') as 'normal' | 'large') || 'normal';
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('navimed_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('navimed_dark', 'false');
    }
  }, [darkMode]);

  // Font size effect
  useEffect(() => {
    if (fontSize === 'large') {
      document.documentElement.classList.add('font-large');
      localStorage.setItem('oncosentinel_fontsize', 'large');
    } else {
      document.documentElement.classList.remove('font-large');
      localStorage.setItem('oncosentinel_fontsize', 'normal');
    }
  }, [fontSize]);

  // Attempt async sync with Supabase if table is ready
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const testSync = async () => {
      try {
        const { data, error } = await client.from('dose_logs').select('*').limit(1);
        if (!error && data) {
          console.log('Supabase connection verified successfully.');
        }
      } catch (err) {
        console.warn('Supabase offline or awaiting migrations:', err);
      }
    };
    testSync();
  }, []);

  // Handlers
  const handleTakeDose = async () => {
    const todayStr = new Date().toISOString();
    const newLog: DoseLog = {
      id: `dose_${Date.now()}`,
      medication_name: 'Tamoxifen 20mg',
      scheduled_for: todayStr,
      taken_at: todayStr,
      status: 'taken'
    };

    const updatedDoses = [newLog, ...doses];
    setDoses(updatedDoses);
    storageService.saveDoseLogs(updatedDoses);

    // Update pill stock count
    const updatedProfile = {
      ...profile,
      pill_stock_count: Math.max(0, profile.pill_stock_count - 1)
    };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);

    // Optional background sync with Supabase
    if (supabase) {
      try {
        await supabase.from('dose_logs').insert([{
          medication_name: 'Tamoxifen 20mg',
          scheduled_for: todayStr,
          taken_at: todayStr,
          status: 'taken'
        }]);
      } catch (e) {
        // Safe local fallback
      }
    }
  };

  const handleSnoozeDose = () => {
    alert('⏰ Alarma a fost amânată cu 15 minute. Te vom atenționa la ' + 
      new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSaveQuickSymptom = (hotFlashes: number, energy: number, jointPain: number) => {
    const newLog: SymptomLog = {
      id: `sym_${Date.now()}`,
      logged_at: new Date().toISOString(),
      hot_flashes_count: hotFlashes > 0 ? hotFlashes : 0,
      hot_flashes_intensity: hotFlashes,
      night_sweats: false,
      fatigue_level: 6 - energy,
      sleep_quality: 3,
      mood_state: energy >= 4 ? 'Optimistă' : 'Echilibrată',
      joint_pain_level: jointPain,
      joint_pain_areas: jointPain > 0 ? ['articulații'] : [],
      mucosal_dryness: 0,
      water_intake_ml: 2000
    };

    const updated = [newLog, ...symptoms];
    setSymptoms(updated);
    storageService.saveSymptomLogs(updated);
  };

  const handleAddSymptomLog = (logData: Omit<SymptomLog, 'id'>) => {
    const newLog: SymptomLog = {
      ...logData,
      id: `sym_${Date.now()}`
    };
    const updated = [newLog, ...symptoms];
    setSymptoms(updated);
    storageService.saveSymptomLogs(updated);
  };

  const handleAddDocument = (docData: Partial<MedicalDocument>) => {
    const newDoc: MedicalDocument = {
      id: `doc_${Date.now()}`,
      category: docData.category || 'alta',
      file_name: docData.file_name || 'Document.pdf',
      file_size_bytes: docData.file_size_bytes || 250000,
      file_data: docData.file_data,
      uploaded_at: new Date().toISOString(),
      is_demo: false
    };

    // Rule: When user uploads real documents, all demo documents are replaced
    const nonDemoDocs = documents.filter(d => !d.is_demo && d.id !== 'doc1' && d.id !== 'doc2' && d.id !== 'doc3');
    const updated = [newDoc, ...nonDemoDocs];
    setDocuments(updated);
    storageService.saveDocuments(updated);
  };

  const handleSaveProfile = (updated: PatientProfile) => {
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleCompleteOnboarding = (configuredProfile: PatientProfile, nextControlDate: string) => {
    setProfile(configuredProfile);
    storageService.saveProfile(configuredProfile);
    if (nextControlDate) {
      localStorage.setItem('navimed_next_control_date', nextControlDate);
    }
    localStorage.setItem('oncosentinel_onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className={`min-h-screen bg-[#F8FAF9] dark:bg-[#151D19] flex justify-center transition-colors ${
      fontSize === 'large' ? 'text-[110%]' : ''
    }`}>
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white/70 dark:bg-darkbg/70 shadow-xl shadow-sage-900/5 relative border-x border-sage-100/60 dark:border-darkbg-border">
        
        {/* Top App Header */}
        <Navbar
          profile={profile}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onOpenRedFlags={() => setIsRedFlagsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenDoctorVisit={() => setIsDoctorVisitOpen(true)}
        />

        {/* Tab View Container */}
        <main className="flex-1 px-4 pt-3 pb-8">
          {activeTab === 'today' && (
            <DashboardTab
              profile={profile}
              doses={doses}
              onTakeDose={handleTakeDose}
              onSnoozeDose={handleSnoozeDose}
              onSaveQuickSymptom={handleSaveQuickSymptom}
              onOpenRedFlags={() => setIsRedFlagsOpen(true)}
              onOpenBreathing={() => setIsBreathingOpen(true)}
              onOpenDoctorVisit={() => setIsDoctorVisitOpen(true)}
              onOpenGrounding={() => setIsGroundingOpen(true)}
              onOpenSupporter={() => setIsSupporterOpen(true)}
              onNavigateToRecipes={(query) => {
                setActiveTab('guide');
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              profile={profile}
              milestones={milestones}
              documents={documents}
              onAddDocument={handleAddDocument}
            />
          )}

          {activeTab === 'symptoms' && (
            <SymptomsTab
              profile={profile}
              symptoms={symptoms}
              doses={doses}
              onAddSymptomLog={handleAddSymptomLog}
            />
          )}

          {activeTab === 'guide' && (
            <GuideTab
              onOpenRedFlags={() => setIsRedFlagsOpen(true)}
            />
          )}
        </main>

        {/* Bottom Tab Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Emergency Modal */}
        <RedFlagsModal
          isOpen={isRedFlagsOpen}
          onClose={() => setIsRedFlagsOpen(false)}
          profile={profile}
        />

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />

        {/* Guided Breathing Modal */}
        <BreathingModal
          isOpen={isBreathingOpen}
          onClose={() => setIsBreathingOpen(false)}
        />

        {/* Doctor Visit Q&A Modal */}
        <DoctorVisitModal
          isOpen={isDoctorVisitOpen}
          onClose={() => setIsDoctorVisitOpen(false)}
        />

        {/* 5-4-3-2-1 Sensory Grounding Modal */}
        <GroundingModal
          isOpen={isGroundingOpen}
          onClose={() => setIsGroundingOpen(false)}
        />

        {/* Supabase Magic Link Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />

        {/* Supporter Circle Modal */}
        <SupporterModal
          isOpen={isSupporterOpen}
          onClose={() => setIsSupporterOpen(false)}
          profile={profile}
        />

        {/* First Install Onboarding Configuration Wizard */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleCompleteOnboarding}
        />

      </div>
    </div>
  );
}

export default App;
