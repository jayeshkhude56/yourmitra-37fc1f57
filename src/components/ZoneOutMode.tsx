
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Cloud, Waves, Music, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VisualType = 'stars' | 'clouds' | 'waves' | 'nature';

const ZoneOutMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentVisual, setCurrentVisual] = useState<VisualType>('stars');
  
  // Change visuals randomly when active
  useEffect(() => {
    let visualInterval: NodeJS.Timeout;
    
    if (isActive) {
      visualInterval = setInterval(() => {
        const visuals: VisualType[] = ['stars', 'clouds', 'waves', 'nature'];
        const nextVisual = visuals[Math.floor(Math.random() * visuals.length)];
        setCurrentVisual(nextVisual);
      }, 20000); // Change every 20 seconds
    }
    
    return () => {
      if (visualInterval) clearInterval(visualInterval);
    };
  }, [isActive]);
  
  const toggleZoneOut = () => {
    setIsActive(!isActive);
  };
  
  const getVisualIcon = () => {
    switch (currentVisual) {
      case 'stars': return <Star className="h-6 w-6 text-purple-400" />;
      case 'clouds': return <Cloud className="h-6 w-6 text-blue-400" />;
      case 'waves': return <Waves className="h-6 w-6 text-cyan-400" />;
      case 'nature': return <Music className="h-6 w-6 text-green-400" />;
      default: return <Star className="h-6 w-6 text-purple-400" />;
    }
  };
  
  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <CardHeader className={`${isActive ? 'bg-gradient-to-r from-blue-100/50 to-purple-100/50 animate-pulse' : 'bg-gradient-to-r from-gray-50 to-blue-50'}`}>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Zone Out Mode</span>
          {isActive && getVisualIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className={`relative overflow-hidden ${isActive ? 'min-h-32' : ''}`}>
        {isActive ? (
          <div className="space-y-4">
            <p className="text-sm text-center italic">
              "No pressure, just some quiet vibes to float in. Take what you need, leave what you don't."
            </p>
            
            <div className="absolute inset-0 -z-10 opacity-20">
              {currentVisual === 'stars' && (
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white w-1 h-1 animate-pulse"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              
              {currentVisual === 'clouds' && (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white"></div>
              )}
              
              {currentVisual === 'waves' && (
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 to-blue-200"></div>
              )}
              
              {currentVisual === 'nature' && (
                <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-yellow-100"></div>
              )}
            </div>
            
            <div className="flex justify-center relative z-10">
              <Button 
                onClick={toggleZoneOut}
                variant="outline" 
                className="rounded-full flex gap-2 items-center bg-white/50 backdrop-blur-sm border-white/20"
              >
                <PauseCircle className="h-4 w-4" />
                <span>Exit Zone Out</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Zone Out Mode provides a quiet space with soft visuals and gentle sounds where you can just be — no expectations or pressure.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={toggleZoneOut}
                className="rounded-full flex gap-2 items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Enter Zone Out Mode</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZoneOutMode;
