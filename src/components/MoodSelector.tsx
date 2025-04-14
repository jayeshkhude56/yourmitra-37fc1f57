
import React from 'react';
import { Smile, Frown, Flame, Wind, CloudRain, Flame as FireIcon, VolumeX, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { useMood, MoodType, AmbientSoundType } from '@/contexts/MoodContext';

const MoodSelector = () => {
  const { currentMood, setCurrentMood, ambientSound, setAmbientSound, toggleEmpathyMode } = useMood();

  const handleMoodChange = (mood: MoodType) => {
    setCurrentMood(mood);
  };

  const handleAmbientSoundChange = (sound: AmbientSoundType) => {
    setAmbientSound(sound);
  };

  return (
    <Card className="w-full rounded-xl">
      <CardContent className="pt-6">
        <Tabs defaultValue="mood">
          <TabsList className="grid grid-cols-3 mb-2 rounded-full">
            <TabsTrigger value="mood" className="rounded-full">Mood</TabsTrigger>
            <TabsTrigger value="empathy" className="rounded-full">Empathy</TabsTrigger>
            <TabsTrigger value="ambient" className="rounded-full">Sounds</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mood" className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={currentMood === 'happy' ? "default" : "outline"} 
                onClick={() => handleMoodChange('happy')}
                className={`flex flex-col items-center py-6 rounded-xl ${currentMood === 'happy' ? 'bg-orange-100 text-orange-700' : ''}`}
              >
                <Smile className="h-6 w-6 mb-1" />
                <span>Happy</span>
              </Button>
              <Button 
                variant={currentMood === 'sad' ? "default" : "outline"} 
                onClick={() => handleMoodChange('sad')}
                className={`flex flex-col items-center py-6 rounded-xl ${currentMood === 'sad' ? 'bg-gray-100 text-gray-700' : ''}`}
              >
                <Frown className="h-6 w-6 mb-1" />
                <span>Sad</span>
              </Button>
              <Button 
                variant={currentMood === 'angry' ? "default" : "outline"} 
                onClick={() => handleMoodChange('angry')}
                className={`flex flex-col items-center py-6 rounded-xl ${currentMood === 'angry' ? 'bg-red-100 text-red-700' : ''}`}
              >
                <Flame className="h-6 w-6 mb-1" />
                <span>Angry</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="empathy">
            <Button 
              onClick={toggleEmpathyMode}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 rounded-xl"
            >
              <Heart className="h-6 w-6" fill="#f87171" />
              <span>Toggle "Cry With Me" Mode</span>
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              When you need someone to just be there with you during tough moments.
            </p>
          </TabsContent>
          
          <TabsContent value="ambient" className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={ambientSound === 'rain' ? "default" : "outline"} 
                onClick={() => handleAmbientSoundChange('rain')}
                className={`flex flex-col items-center py-6 rounded-xl ${ambientSound === 'rain' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <CloudRain className="h-6 w-6 mb-1" />
                <span>Rain</span>
              </Button>
              <Button 
                variant={ambientSound === 'wind' ? "default" : "outline"} 
                onClick={() => handleAmbientSoundChange('wind')}
                className={`flex flex-col items-center py-6 rounded-xl ${ambientSound === 'wind' ? 'bg-gray-100 text-gray-700' : ''}`}
              >
                <Wind className="h-6 w-6 mb-1" />
                <span>Wind</span>
              </Button>
              <Button 
                variant={ambientSound === 'fire' ? "default" : "outline"} 
                onClick={() => handleAmbientSoundChange('fire')}
                className={`flex flex-col items-center py-6 rounded-xl ${ambientSound === 'fire' ? 'bg-orange-100 text-orange-700' : ''}`}
              >
                <FireIcon className="h-6 w-6 mb-1" />
                <span>Fireplace</span>
              </Button>
              <Button 
                variant={ambientSound === 'none' ? "default" : "outline"} 
                onClick={() => handleAmbientSoundChange('none')}
                className={`flex flex-col items-center py-6 rounded-xl ${ambientSound === 'none' ? 'bg-purple-100 text-purple-700' : ''}`}
              >
                <VolumeX className="h-6 w-6 mb-1" />
                <span>Silent</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoodSelector;
