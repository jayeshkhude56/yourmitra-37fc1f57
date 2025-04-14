
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sun, Moon, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useMood } from '@/contexts/MoodContext';

const EmotionalRituals = () => {
  const { currentMood } = useMood();
  const [activeRitual, setActiveRitual] = useState<string | null>(null);
  const [ritualProgress, setRitualProgress] = useState(0);
  const [ritualTimer, setRitualTimer] = useState<NodeJS.Timeout | null>(null);
  
  const startRitual = (ritual: string, duration: number) => {
    // Clear any existing ritual
    if (ritualTimer) {
      clearInterval(ritualTimer);
    }
    
    setActiveRitual(ritual);
    setRitualProgress(0);
    
    const intervalTime = 100; // Update every 100ms for smooth progress
    const steps = duration * 1000 / intervalTime;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setRitualProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setActiveRitual(null);
          setRitualProgress(0);
        }, 500);
      }
    }, intervalTime);
    
    setRitualTimer(timer);
  };
  
  const getRitualInstructions = () => {
    switch (activeRitual) {
      case 'morning':
        return "Take deep breaths. Acknowledge how you're feeling today without judgment.";
      case 'cry':
        return "It's okay to let your emotions out. This is a safe space to feel.";
      case 'night':
        return "Release the day's weight. What emotions are you carrying that you can let go of?";
      default:
        return "";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Emotional Rituals</CardTitle>
      </CardHeader>
      
      <CardContent>
        {activeRitual ? (
          <div className="space-y-4 text-center p-4">
            <h3 className="font-medium text-lg">
              {activeRitual === 'morning' && "Morning Grounding"}
              {activeRitual === 'cry' && "30-Second Cry Break"}
              {activeRitual === 'night' && "Night-time Emotional Unload"}
            </h3>
            
            <p className="text-gray-600">{getRitualInstructions()}</p>
            
            <Progress value={ritualProgress} className="h-2" />
            
            <p className="text-sm text-gray-500">
              {Math.round((100 - ritualProgress) / 100 * (
                activeRitual === 'cry' ? 30 : 60
              ))} seconds remaining
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => startRitual('morning', 60)}
            >
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              <div className="text-left">
                <p className="font-medium">Morning Grounding</p>
                <p className="text-xs text-gray-500">Start your day mindfully (1 min)</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => startRitual('cry', 30)}
            >
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">30-Second Cry Break</p>
                <p className="text-xs text-gray-500">A quick emotional release</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => startRitual('night', 60)}
            >
              <Moon className="h-5 w-5 mr-2 text-indigo-500" />
              <div className="text-left">
                <p className="font-medium">Night-time Emotional Unload</p>
                <p className="text-xs text-gray-500">Release the day's weight (1 min)</p>
              </div>
            </Button>
          </div>
        )}
      </CardContent>
      
      {activeRitual && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              if (ritualTimer) clearInterval(ritualTimer);
              setActiveRitual(null);
            }}
          >
            End Ritual Early
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmotionalRituals;
