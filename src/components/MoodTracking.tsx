
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MoodTracking = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, mood: string}>>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load mood history from localStorage on component mount
    const storedMoodHistory = localStorage.getItem('moodHistory');
    if (storedMoodHistory) {
      setMoodHistory(JSON.parse(storedMoodHistory));
    }
  }, []);
  
  useEffect(() => {
    // Save mood history to localStorage whenever it changes
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);
  
  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
  };
  
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };
  
  const handleSaveMood = useCallback(() => {
    if (mood) {
      const dateString = date.toISOString().split('T')[0];
      
      // Check if there's an existing entry for the selected date
      const existingEntryIndex = moodHistory.findIndex(entry => entry.date === dateString);
      
      if (existingEntryIndex !== -1) {
        // Update the existing entry
        const updatedMoodHistory = [...moodHistory];
        updatedMoodHistory[existingEntryIndex] = {
          date: dateString,
          mood: mood
        };
        setMoodHistory(updatedMoodHistory);
      } else {
        // Add a new entry
        setMoodHistory([...moodHistory, {
          date: dateString,
          mood: mood
        }]);
      }
      
      // Reset the mood selection
      setMood(null);
      
      toast({
        title: "Mood Saved", 
        description: `Your mood for ${dateString} has been saved.`
      });
    } else {
      toast({
        title: "No Mood Selected",
        description: "Please select a mood before saving."
      });
    }
  }, [date, mood, moodHistory, toast]);
  
  const getDayClass = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const mood = moodHistory.find(entry => entry.date === dateString)?.mood;
    
    if (!mood) return "";
    
    switch (mood) {
      case "happy":
        return "bg-blue-50 text-blue-700";
      case "sad":
        return "bg-gray-100 text-gray-700";
      case "angry":
        return "bg-red-100 text-red-700";
      case "anxious":
        return "bg-orange-100 text-orange-700";
      default:
        return "";
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Track Your Mood</h2>
      
      <div className="mb-4">
        <Calendar 
          onChange={handleDateChange}
          value={date}
          tileClassName={({date}) => getDayClass(date)}
        />
      </div>
      
      <div className="flex space-x-4 mb-4">
        <Button 
          onClick={() => handleMoodSelect("happy")}
          className={mood === "happy" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"}
        >
          Happy
        </Button>
        
        <Button 
          onClick={() => handleMoodSelect("sad")}
          className={mood === "sad" ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-700"}
        >
          Sad
        </Button>
        
        <Button 
          onClick={() => handleMoodSelect("angry")}
          className={mood === "angry" ? "bg-red-500 text-white" : "bg-red-100 text-red-700"}
        >
          Angry
        </Button>
        
        <Button 
          onClick={() => handleMoodSelect("anxious")}
          className={mood === "anxious" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700"}
        >
          Anxious
        </Button>
      </div>
      
      <Button 
        onClick={handleSaveMood}
        className="bg-green-500 text-white"
      >
        Save Mood
      </Button>
    </div>
  );
};

export default MoodTracking;
