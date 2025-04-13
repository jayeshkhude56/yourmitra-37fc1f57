
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Male, Female } from 'lucide-react';
import SpeechProcessor from '@/services/SpeechProcessor';

interface VoiceGenderSelectorProps {
  selectedGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
}

const VoiceGenderSelector = ({ selectedGender, onGenderChange }: VoiceGenderSelectorProps) => {
  const handleToggle = (checked: boolean) => {
    const newGender = checked ? 'female' : 'male';
    onGenderChange(newGender);
    
    // Apply voice gender change in SpeechProcessor
    SpeechProcessor.setVoiceGender(newGender);
    console.log(`Voice gender changed to: ${newGender}`);
  };

  return (
    <div className="flex items-center justify-center space-x-6 mb-4">
      <div className={`flex items-center space-x-2 ${selectedGender === 'male' ? 'text-mitra-sky-blue font-medium' : 'text-gray-400'}`}>
        <Male size={20} />
        <span>Male</span>
      </div>
      
      <Switch 
        checked={selectedGender === 'female'}
        onCheckedChange={handleToggle}
        className={`${
          selectedGender === 'female' 
            ? 'bg-pink-400 data-[state=checked]:bg-pink-400' 
            : 'bg-mitra-sky-blue data-[state=unchecked]:bg-mitra-sky-blue'
        }`}
      />
      
      <div className={`flex items-center space-x-2 ${selectedGender === 'female' ? 'text-pink-400 font-medium' : 'text-gray-400'}`}>
        <Female size={20} />
        <span>Female</span>
      </div>
    </div>
  );
};

export default VoiceGenderSelector;
