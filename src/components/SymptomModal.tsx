import React, { useState } from 'react';
import { X, Activity, Brain, Bone, ThermometerSun, Droplets, Moon, Coffee } from 'lucide-react';
import { SymptomLog } from '../types';

interface SymptomModalProps {
  onClose: () => void;
  onSave: (log: Partial<SymptomLog>) => void;
}

export const SymptomModal: React.FC<SymptomModalProps> = ({ onClose, onSave }) => {
  const [hotFlashes, setHotFlashes] = useState(0);
  const [jointPain, setJointPain] = useState(0);
  const [bonePain, setBonePain] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [brainFog, setBrainFog] = useState(0);
  const [nausea, setNausea] = useState(0);
  const [dryness, setDryness] = useState(0);

  const handleSave = () => {
    onSave({
      hot_flashes_intensity: hotFlashes,
      joint_pain_level: jointPain,
      bone_pain_level: bonePain,
      fatigue_level: 6 - energy, // 5=energie mare (oboseala mica)
      brain_fog: brainFog,
      nausea_level: nausea,
      mucosal_dryness: dryness
    });
    onClose();
  };

  const SliderRow = ({ icon: Icon, label, value, setValue, labels }: any) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-[#5E7A68] dark:text-sage-400" />
        <span className="font-semibold text-sm text-[#3A332E] dark:text-white">{label}</span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full accent-[#5E7A68] dark:accent-sage-400 h-2 bg-[#F5F2EB] dark:bg-darkbg-body rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[11px] text-[#8C8477] dark:text-gray-400">{labels[0]}</span>
        <span className="text-[11px] text-[#8C8477] dark:text-gray-400">{labels[1]}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="w-full sm:w-[400px] bg-white dark:bg-darkbg-card rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-darkbg-body text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E8E3D9] dark:bg-sage-900/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#5E7A68] dark:text-sage-400" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-[#3A332E] dark:text-white">Jurnal Simptome</h2>
            <p className="text-xs text-[#8C8477] dark:text-gray-400">Evaluează reacțiile tratamentului</p>
          </div>
        </div>

        <div className="space-y-2">
          <SliderRow 
            icon={ThermometerSun} label="Bufeuri & Transpirații" value={hotFlashes} setValue={setHotFlashes} 
            labels={['Deloc', 'Severe']} 
          />
          <SliderRow 
            icon={Bone} label="Dureri Articulare" value={jointPain} setValue={setJointPain} 
            labels={['Zero', 'Insuportabile']} 
          />
          <SliderRow 
            icon={Bone} label="Dureri Osoase" value={bonePain} setValue={setBonePain} 
            labels={['Zero', 'Severe']} 
          />
          <SliderRow 
            icon={Coffee} label="Nivel de Energie" value={energy} setValue={setEnergy} 
            labels={['Epuizată', 'Plină de viață']} 
          />
          <SliderRow 
            icon={Brain} label="Ceață Mentală / Concentrare" value={brainFog} setValue={setBrainFog} 
            labels={['Claritate', 'Confuzie mare']} 
          />
          <SliderRow 
            icon={Activity} label="Greață" value={nausea} setValue={setNausea} 
            labels={['Deloc', 'Severă']} 
          />
          <SliderRow 
            icon={Droplets} label="Uscăciune Mucoasă/Vaginală" value={dryness} setValue={setDryness} 
            labels={['Normal', 'Sever']} 
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full mt-4 h-12 bg-[#5E7A68] text-white font-bold rounded-xl text-[15px] tap-scale shadow-sm flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Salvează Raportul
        </button>
      </div>
    </div>
  );
};
