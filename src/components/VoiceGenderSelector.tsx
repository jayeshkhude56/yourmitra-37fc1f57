
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Mars, Venus } from 'lucide-react';  
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
    <div className="flex items-center justify-center space-x-2">
      <div className={selectedGender === 'male' ? 'text-blue-500' : 'text-gray-400'}>
        <Mars size={20} />
      </div>
      
      <Switch 
        checked={selectedGender === 'female'}
        onCheckedChange={handleToggle}
        className={`${
          selectedGender === 'female' 
            ? 'bg-pink-400 data-[state=checked]:bg-pink-400' 
            : 'bg-blue-500 data-[state=unchecked]:bg-blue-500'
        }`}
      />
      
      <div className={selectedGender === 'female' ? 'text-pink-400' : 'text-gray-400'}>
        <Venus size={20} />
      </div>
    </div>
  );
};

export default VoiceGenderSelector;
