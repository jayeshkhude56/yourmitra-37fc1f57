
import React from 'react';
import MoodSelector from './MoodSelector';
import ListeningJournal from './ListeningJournal';
import EmotionalRituals from './EmotionalRituals';
import AmbientSoundPlayer from './AmbientSoundPlayer';
import { useMood } from '@/contexts/MoodContext';

const EmotionalContent = () => {
  const { currentMood } = useMood();
  
  const getMoodBackground = () => {
    switch (currentMood) {
      case 'happy': return 'bg-gradient-to-tr from-orange-50 to-orange-100';
      case 'sad': return 'bg-gradient-to-tr from-gray-50 to-gray-100';
      case 'angry': return 'bg-gradient-to-tr from-red-50 to-red-100';
      default: return 'bg-gradient-to-tr from-purple-50 to-purple-100';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl shadow-sm transition-colors duration-500 ${getMoodBackground()}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoodSelector />
      </div>
      <AmbientSoundPlayer />
    </div>
  );
};

export default EmotionalContent;
