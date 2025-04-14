
import React, { useEffect, useRef } from 'react';
import { useMood, AmbientSoundType } from '@/contexts/MoodContext';

const AmbientSoundPlayer = () => {
  const { ambientSound } = useMood();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound URLs - would be replaced with actual audio files in a real implementation
  const soundUrls: Record<Exclude<AmbientSoundType, 'none'>, string> = {
    rain: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-looping-1249.mp3',
    wind: 'https://assets.mixkit.co/sfx/preview/mixkit-blizzard-cold-winds-1153.mp3',
    fire: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
  };
  
  useEffect(() => {
    // Clean up previous audio element if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (ambientSound !== 'none') {
      // Create new audio element with the selected sound
      const audio = new Audio(soundUrls[ambientSound]);
      audio.loop = true;
      audio.volume = 0.3; // Set to a comfortable background level
      
      // Fade in the audio
      audio.volume = 0;
      audio.play().catch(e => console.error("Error playing ambient sound:", e));
      
      // Gradually increase volume for smooth transition
      let volume = 0;
      const fadeInterval = setInterval(() => {
        if (volume < 0.3) {
          volume += 0.01;
          audio.volume = volume;
        } else {
          clearInterval(fadeInterval);
        }
      }, 50);
      
      audioRef.current = audio;
      
      // Clean up when component unmounts
      return () => {
        clearInterval(fadeInterval);
        audio.pause();
      };
    }
  }, [ambientSound]);
  
  // This is an invisible component that manages audio playback
  return null;
};

export default AmbientSoundPlayer;
