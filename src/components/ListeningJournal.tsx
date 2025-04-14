
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Flame, SaveAll, Mic, MicOff, Sparkles } from 'lucide-react';
import { useMood, JournalEntry } from '@/contexts/MoodContext';
import SpeechProcessor from '@/services/SpeechProcessor';
import { useToast } from "@/hooks/use-toast";

const ListeningJournal = () => {
  const { addJournalEntry, currentMood, setCurrentMood } = useMood();
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [detectedMood, setDetectedMood] = useState<'happy' | 'sad' | 'angry' | null>(null);
  const { toast } = useToast();
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load journal history from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('mitra-journal-entries');
    if (storedEntries) {
      try {
        setJournalHistory(JSON.parse(storedEntries));
      } catch (e) {
        console.error('Error parsing journal entries:', e);
      }
    }
  }, []);

  // Simple sentiment analysis to detect mood based on the text
  useEffect(() => {
    if (journalText.length > 10) {
      // Lists of words associated with different moods
      const moodKeywords = {
        happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'wonderful', 'fantastic', 'smile', 'laugh', 'love'],
        sad: ['sad', 'depressed', 'unhappy', 'miserable', 'cry', 'tears', 'lonely', 'grief', 'hurt', 'disappointed'],
        angry: ['angry', 'mad', 'frustrated', 'annoyed', 'hate', 'rage', 'furious', 'upset', 'irritated', 'hostile'],
      };
      
      const text = journalText.toLowerCase();
      let detectedEmotion: 'happy' | 'sad' | 'angry' | null = null;
      let highestCount = 0;
      
      // Count occurrences of emotion words
      Object.entries(moodKeywords).forEach(([mood, keywords]) => {
        const count = keywords.filter(word => text.includes(word)).length;
        if (count > highestCount) {
          highestCount = count;
          detectedEmotion = mood as 'happy' | 'sad' | 'angry';
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
      
      // Add to context
      addJournalEntry(newEntry);
      
      // Add to local state
      const updatedHistory = [newEntry, ...journalHistory];
      setJournalHistory(updatedHistory);
      
      // Save to localStorage
      localStorage.setItem('mitra-journal-entries', JSON.stringify(updatedHistory));
      
      // Reset form
      setJournalText('');
      setDetectedMood(null);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded with care",
        duration: 3000,
      });

      // Show history after saving
      setShowHistory(true);
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = journalHistory.filter(entry => entry.id !== id);
    setJournalHistory(updatedEntries);
    localStorage.setItem('mitra-journal-entries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry Deleted",
      description: "Journal entry has been removed",
      duration: 2000,
    });
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

  // Get mood-based styling
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'border-orange-300 bg-orange-50';
      case 'sad': return 'border-gray-300 bg-gray-50';
      case 'angry': return 'border-red-300 bg-red-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <span className="text-orange-500">😊</span>;
      case 'sad':
        return <span className="text-gray-500">😔</span>;
      case 'angry':
        return <span className="text-red-500">😠</span>;
      default:
        return <span className="text-blue-500">😐</span>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className={`rounded-xl overflow-hidden shadow-md ${isBurning ? 'animate-pulse border-red-300' : ''}`}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Listening Journal</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm"
            >
              {showHistory ? "Write New Entry" : "View Journal History"}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {!showHistory ? (
          <>
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
              
              {detectedMood && (
                <div className="mt-2 text-sm p-2 rounded-lg bg-blue-50">
                  <p>Detected mood: <span className="font-medium capitalize">{detectedMood}</span> {getMoodIcon(detectedMood)}</p>
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
                  className="rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700"
                >
                  <SaveAll className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Your Journal Entries</h3>
            
            {journalHistory.length > 0 ? (
              <div className="space-y-4">
                {journalHistory.map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`p-4 rounded-lg border ${getMoodColor(entry.mood)} relative`}
                  >
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <span>{getMoodIcon(entry.mood)}</span>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </div>
                    <p className="mb-3">{entry.text}</p>
                    <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No journal entries yet</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ListeningJournal;
