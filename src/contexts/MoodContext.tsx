
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define mood types
export type MoodType = 'neutral' | 'happy' | 'sad' | 'angry';

// Define ambient sound types
export type AmbientSoundType = 'none' | 'rain' | 'wind' | 'fire';

interface MoodContextType {
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
  ambientSound: AmbientSoundType;
  setAmbientSound: (sound: AmbientSoundType) => void;
  isEmpathyMode: boolean;
  toggleEmpathyMode: () => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  moodHistory: MoodHistoryEntry[];
  recordMoodHistory: (mood: MoodType) => void;
  emotionalMemories: string[];
  addEmotionalMemory: (memory: string) => void;
}

export interface JournalEntry {
  id: string;
  date: Date;
  text: string;
  mood: MoodType;
}

export interface MoodHistoryEntry {
  date: Date;
  mood: MoodType;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [isEmpathyMode, setIsEmpathyMode] = useState<boolean>(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
  const [emotionalMemories, setEmotionalMemories] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Load saved mood data from localStorage on component mount
  useEffect(() => {
    try {
      const savedJournal = localStorage.getItem('mitra-journal');
      if (savedJournal) {
        const parsed = JSON.parse(savedJournal);
        setJournalEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      }
      
      const savedMoodHistory = localStorage.getItem('mitra-mood-history');
      if (savedMoodHistory) {
        const parsed = JSON.parse(savedMoodHistory);
        setMoodHistory(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      }
      
      const savedMemories = localStorage.getItem('mitra-emotional-memories');
      if (savedMemories) {
        setEmotionalMemories(JSON.parse(savedMemories));
      }
    } catch (error) {
      console.error('Error loading mood data from localStorage:', error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mitra-journal', JSON.stringify(journalEntries));
      localStorage.setItem('mitra-mood-history', JSON.stringify(moodHistory));
      localStorage.setItem('mitra-emotional-memories', JSON.stringify(emotionalMemories));
    } catch (error) {
      console.error('Error saving mood data to localStorage:', error);
    }
  }, [journalEntries, moodHistory, emotionalMemories]);
  
  const toggleEmpathyMode = () => {
    setIsEmpathyMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        toast({
          title: "Empathy Mode Activated",
          description: "Mitra is here to listen and support you",
          duration: 3000,
        });
        
        // If entering empathy mode, also set mood to sad if not already
        if (currentMood !== 'sad') setCurrentMood('sad');
      } else {
        toast({
          title: "Empathy Mode Deactivated",
          description: "Thank you for sharing your feelings with me",
          duration: 3000,
        });
      }
      
      return newMode;
    });
  };
  
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
    
    // Also record this mood in the mood history
    recordMoodHistory(entry.mood);
    
    toast({
      title: "Journal Entry Saved",
      description: "Your thoughts have been recorded",
      duration: 3000,
    });
  };
  
  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    
    toast({
      title: "Journal Entry Removed",
      description: "Your entry has been deleted",
      duration: 3000,
    });
  };
  
  const recordMoodHistory = (mood: MoodType) => {
    const newEntry = {
      date: new Date(),
      mood,
    };
    
    setMoodHistory(prev => [newEntry, ...prev]);
  };
  
  const addEmotionalMemory = (memory: string) => {
    setEmotionalMemories(prev => [...prev, memory]);
  };
  
  return (
    <MoodContext.Provider 
      value={{
        currentMood, 
        setCurrentMood,
        ambientSound,
        setAmbientSound,
        isEmpathyMode,
        toggleEmpathyMode,
        journalEntries,
        addJournalEntry,
        deleteJournalEntry,
        moodHistory,
        recordMoodHistory,
        emotionalMemories,
        addEmotionalMemory
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
