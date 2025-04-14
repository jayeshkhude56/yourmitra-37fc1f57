
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Flame, SaveAll, Mic } from 'lucide-react';
import { useMood, MoodType, JournalEntry } from '@/contexts/MoodContext';
import SpeechProcessor from '@/services/SpeechProcessor';

const ListeningJournal = () => {
  const { addJournalEntry, currentMood } = useMood();
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleSaveEntry = () => {
    if (journalText.trim()) {
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substring(2, 15),
        date: new Date(),
        text: journalText,
        mood: currentMood
      };
      
      addJournalEntry(newEntry);
      setJournalText('');
    }
  };

  const handleBurnEntry = () => {
    if (!journalText.trim()) return;
    
    setIsBurning(true);
    
    // Simulate burning animation
    setTimeout(() => {
      setJournalText('');
      setIsBurning(false);
    }, 2000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    
    SpeechProcessor.startListening(
      // Interim results
      (text) => {
        setJournalText(prev => prev + " " + text);
      },
      // Final result
      (text) => {
        setIsRecording(false);
        setJournalText(prev => prev + " " + text);
      }
    );
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    SpeechProcessor.stopListening();
  };

  return (
    <Card className={isBurning ? 'animate-pulse border-red-300' : ''}>
      <CardHeader>
        <CardTitle className="text-xl">Listening Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write your thoughts here, or speak them using the mic button..."
          className={`min-h-[150px] ${isBurning ? 'opacity-50' : ''}`}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          disabled={isBurning || isRecording}
        />
        {isBurning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className="h-20 w-20 text-red-500 animate-bounce" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button onClick={startVoiceRecording} variant="outline">
              <Mic className="h-4 w-4 mr-2" />
              Record
            </Button>
          ) : (
            <Button onClick={stopVoiceRecording} variant="destructive">
              <Mic className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleBurnEntry}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            disabled={!journalText.trim() || isBurning}
          >
            <Flame className="h-4 w-4 mr-2" />
            Burn It
          </Button>
          <Button 
            onClick={handleSaveEntry}
            disabled={!journalText.trim() || isBurning}
          >
            <SaveAll className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListeningJournal;
