
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Flame, SaveAll, Mic, MicOff, Sparkles } from 'lucide-react';
import { useMood, MoodType, JournalEntry } from '@/contexts/MoodContext';
import SpeechProcessor from '@/services/SpeechProcessor';
import { useToast } from "@/hooks/use-toast";

const ListeningJournal = () => {
  const { addJournalEntry, currentMood, setCurrentMood } = useMood();
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [detectedMood, setDetectedMood] = useState<MoodType | null>(null);
  const { toast } = useToast();

  // Simple sentiment analysis to detect mood based on the text
  useEffect(() => {
    if (journalText.length > 10) {
      // Lists of words associated with different moods
      const moodKeywords = {
        happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'wonderful', 'fantastic', 'smile', 'laugh', 'love'],
        sad: ['sad', 'depressed', 'unhappy', 'miserable', 'cry', 'tears', 'lonely', 'grief', 'hurt', 'disappointed'],
        angry: ['angry', 'mad', 'frustrated', 'annoyed', 'hate', 'rage', 'furious', 'upset', 'irritated', 'hostile'],
        anxious: ['anxious', 'nervous', 'worry', 'stress', 'scared', 'fear', 'panic', 'overwhelmed', 'afraid', 'dread'],
        calm: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene', 'content', 'quiet', 'still', 'centered', 'mindful']
      };
      
      const text = journalText.toLowerCase();
      let detectedEmotion: MoodType | null = null;
      let highestCount = 0;
      
      // Count occurrences of emotion words
      Object.entries(moodKeywords).forEach(([mood, keywords]) => {
        const count = keywords.filter(word => text.includes(word)).length;
        if (count > highestCount) {
          highestCount = count;
          detectedEmotion = mood as MoodType;
        }
      });
      
      // Only update if we have a reasonably confident detection
      if (highestCount > 0) {
        setDetectedMood(detectedEmotion);
      }
    }
  }, [journalText]);

  const handleSaveEntry = () => {
    if (journalText.trim()) {
      // If mood was detected in the text, update the current mood
      if (detectedMood) {
        setCurrentMood(detectedMood);
        toast({
          title: "Mood Detected",
          description: `Mitra noticed you're feeling ${detectedMood}`,
          duration: 3000,
        });
      }
      
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substring(2, 15),
        date: new Date(),
        text: journalText,
        mood: detectedMood || currentMood
      };
      
      addJournalEntry(newEntry);
      setJournalText('');
      setDetectedMood(null);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded with care",
        duration: 3000,
      });
    }
  };

  const handleBurnEntry = () => {
    if (!journalText.trim()) return;
    
    setIsBurning(true);
    
    // Simulate burning animation
    setTimeout(() => {
      toast({
        title: "Thoughts Released",
        description: "Sometimes letting go is the best healing",
        duration: 3000,
      });
      setJournalText('');
      setIsBurning(false);
      setDetectedMood(null);
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
        
        toast({
          title: "Voice Captured",
          description: "Your spoken thoughts are now in your journal",
          duration: 2000,
        });
      }
    );
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    SpeechProcessor.stopListening();
  };

  return (
    <Card className={`rounded-xl overflow-hidden shadow-md ${isBurning ? 'animate-pulse border-red-300' : ''}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-xl">Listening Journal</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Textarea
          placeholder="Write your thoughts here, or speak them using the mic button..."
          className={`min-h-[200px] rounded-lg ${isBurning ? 'opacity-50' : ''}`}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          disabled={isBurning || isRecording}
        />
        
        {isBurning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className="h-20 w-20 text-red-500 animate-bounce" />
          </div>
        )}
        
        {detectedMood && !isBurning && (
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-sm">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button onClick={startVoiceRecording} variant="outline" className="rounded-lg shadow-sm">
              <Mic className="h-4 w-4 mr-2" />
              Record
            </Button>
          ) : (
            <Button onClick={stopVoiceRecording} variant="destructive" className="rounded-lg shadow-sm">
              <MicOff className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleBurnEntry}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg shadow-sm"
            disabled={!journalText.trim() || isBurning}
          >
            <Flame className="h-4 w-4 mr-2" />
            Burn It
          </Button>
          <Button 
            onClick={handleSaveEntry}
            disabled={!journalText.trim() || isBurning}
            className="rounded-lg shadow-sm"
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
