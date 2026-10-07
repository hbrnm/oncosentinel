const fs = require('fs');
let text = fs.readFileSync('src/components/JournalTab.tsx', 'utf8');

// 1. Add Import
text = text.replace(
  "import { getMood } from './MoodPicker';",
  "import { getMood } from './MoodPicker';\nimport { SevereSymptomModal } from './SevereSymptomModal';"
);

// 2. Add State for the Modal
text = text.replace(
  "const [waterIntake, setWaterIntake] = useState<number>(2000);",
  "const [waterIntake, setWaterIntake] = useState<number>(2000);\n  const [severeSymptomsAlert, setSevereSymptomsAlert] = useState<Partial<SymptomLog> | null>(null);"
);

// 3. Add to handleSave
const saveLogicRegex = /onAddSymptomLog\(\{\s*logged_at:[\s\S]*?water_intake_ml: waterIntake\s*\}\);\s*setSavedToday\(true\);\s*setSaving\(false\);\s*setShowDetailedForm\(false\);/;

const newSaveLogic = `
      const newLogData = {
        logged_at: new Date().toISOString(),
        mood_state: getMood(mood).label,
        notes: note.trim() ? note.trim() : undefined,
        hot_flashes_count: hotFlashesCount,
        hot_flashes_intensity: hotFlashesIntensity,
        night_sweats: nightSweats,
        fatigue_level: fatigueLevel,
        sleep_quality: sleepQuality,
        joint_pain_level: jointPainLevel,
        joint_pain_areas: selectedJointAreas,
        mucosal_dryness: mucosalDryness,
        bone_pain_level: bonePainLevel,
        nausea_level: nauseaLevel,
        brain_fog: brainFog,
        headache: headache,
        water_intake_ml: waterIntake
      };
      onAddSymptomLog(newLogData);
      setSavedToday(true);
      setSaving(false);
      
      const hasSevere = 
        hotFlashesIntensity >= 4 || 
        jointPainLevel >= 4 || 
        bonePainLevel >= 4 || 
        nauseaLevel >= 4 || 
        fatigueLevel >= 4 || 
        brainFog >= 4;

      if (hasSevere) {
        setSevereSymptomsAlert(newLogData);
      } else {
        setShowDetailedForm(false);
      }`;

text = text.replace(saveLogicRegex, newSaveLogic);

// 4. Render the modal
text = text.replace(
  '  return (\n    <div',
  `  return (
    <React.Fragment>
      {severeSymptomsAlert && (
        <SevereSymptomModal 
          symptoms={severeSymptomsAlert}
          onClose={() => { setSevereSymptomsAlert(null); setShowDetailedForm(false); }}
        />
      )}
    <div`
);

text = text.replace(
  /<\/div>\n\s*\);\n};\s*$/,
  '</div>\n    </React.Fragment>\n  );\n};'
);

fs.writeFileSync('src/components/JournalTab.tsx', text);
