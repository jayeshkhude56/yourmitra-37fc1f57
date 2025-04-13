
import React from 'react';
import { Switch } from "@/components/ui/switch";
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
    <div className="flex items-center justify-center space-x-2 mb-4">
      <span className={selectedGender === 'male' ? 'text-blue-500 font-medium' : 'text-gray-400'}>
        Male
      </span>
      
      <Switch 
        checked={selectedGender === 'female'}
        onCheckedChange={handleToggle}
        className={`${
          selectedGender === 'female' 
            ? 'bg-pink-400 data-[state=checked]:bg-pink-400' 
            : 'bg-blue-500 data-[state=unchecked]:bg-blue-500'
        }`}
      />
      
      <span className={selectedGender === 'female' ? 'text-pink-400 font-medium' : 'text-gray-400'}>
        Female
      </span>
    </div>
  );
};

export default VoiceGenderSelector;
