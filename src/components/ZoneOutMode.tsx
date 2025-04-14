
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Stars, Waves, CloudSun, Trees, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMood } from '@/contexts/MoodContext';

const ZoneOutMode = () => {
  const { currentMood } = useMood();
  const [isActive, setIsActive] = useState(false);
  const [currentVisual, setCurrentVisual] = useState<'stars' | 'waves' | 'clouds' | 'nature'>('stars');
  const [isMuted, setIsMuted] = useState(false);
  
  const toggleZoneOut = () => {
    setIsActive(!isActive);
  };
  
  const changeVisual = (visual: 'stars' | 'waves' | 'clouds' | 'nature') => {
    setCurrentVisual(visual);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const getVisualComponent = () => {
    switch (currentVisual) {
      case 'stars':
        return (
          <div className="bg-indigo-900 rounded-lg h-32 flex items-center justify-center overflow-hidden">
            <div className="stars-animation">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="star" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}></div>
              ))}
            </div>
            <p className="text-white text-center text-sm px-4">No pressure, just some quiet vibes to float in...</p>
          </div>
        );
      case 'waves':
        return (
          <div className="bg-blue-800 rounded-lg h-32 flex items-center justify-center overflow-hidden">
            <div className="waves-animation">
              <div className="wave"></div>
              <div className="wave" style={{ animationDelay: '1s' }}></div>
              <div className="wave" style={{ animationDelay: '2s' }}></div>
            </div>
            <p className="text-white text-center text-sm px-4">Take what you need, leave what you don't...</p>
          </div>
        );
      case 'clouds':
        return (
          <div className="bg-blue-300 rounded-lg h-32 flex items-center justify-center overflow-hidden">
            <div className="clouds-animation">
              <div className="cloud"></div>
              <div className="cloud" style={{ animationDelay: '5s', top: '60%' }}></div>
              <div className="cloud" style={{ animationDelay: '10s', top: '40%' }}></div>
            </div>
            <p className="text-gray-700 text-center text-sm px-4">I'm right here with you...</p>
          </div>
        );
      case 'nature':
        return (
          <div className="bg-green-800 rounded-lg h-32 flex items-center justify-center overflow-hidden">
            <div className="nature-animation">
              <div className="tree"></div>
              <div className="tree" style={{ left: '60%', height: '70%' }}></div>
              <div className="tree" style={{ left: '30%', height: '85%' }}></div>
            </div>
            <p className="text-white text-center text-sm px-4">Just breathe and be...</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="text-xl flex items-center">
          <span className="mr-2">💤</span> Zone Out Mode
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {isActive ? (
          <div className="space-y-4">
            {getVisualComponent()}
            
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeVisual('stars')}
                className={`flex flex-col items-center py-3 ${currentVisual === 'stars' ? 'bg-indigo-50 border-indigo-200' : ''}`}
              >
                <Stars size={18} />
                <span className="text-xs mt-1">Stars</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeVisual('waves')}
                className={`flex flex-col items-center py-3 ${currentVisual === 'waves' ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <Waves size={18} />
                <span className="text-xs mt-1">Waves</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeVisual('clouds')}
                className={`flex flex-col items-center py-3 ${currentVisual === 'clouds' ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <CloudSun size={18} />
                <span className="text-xs mt-1">Clouds</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeVisual('nature')}
                className={`flex flex-col items-center py-3 ${currentVisual === 'nature' ? 'bg-green-50 border-green-200' : ''}`}
              >
                <Trees size={18} />
                <span className="text-xs mt-1">Nature</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <p>A gentle space to zone out without pressure.</p>
            <p className="text-sm mt-2">Soft visuals and ambient sounds to help you rest.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant={isActive ? "destructive" : "default"}
          onClick={toggleZoneOut}
          className="rounded-lg"
        >
          {isActive ? "Exit Zone Out" : "Enter Zone Out"}
        </Button>
        
        {isActive && (
          <Button 
            variant="outline"
            onClick={toggleMute}
            className="rounded-lg"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ZoneOutMode;
