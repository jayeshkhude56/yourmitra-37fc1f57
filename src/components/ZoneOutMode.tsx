
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, Clock, Waves } from 'lucide-react';

// Define available ambient sounds
const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c9a4e9797a.mp3?filename=light-rain-ambient-114354.mp3' },
  { id: 'forest', name: 'Forest Ambience', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0b2f3e5a0.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3' },
  { id: 'waves', name: 'Ocean Waves', url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_47d33fc430.mp3?filename=waves-crushing-on-rock-coast-loop-125071.mp3' },
  { id: 'fireplace', name: 'Crackling Fire', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f49b9bf.mp3?filename=fireplace-crackling-loop-113523.mp3' },
  { id: 'white_noise', name: 'White Noise', url: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_1dde664a05.mp3?filename=white-noise-10min-113442.mp3' }
];

// Type for timer settings
type TimerSettings = {
  active: boolean;
  duration: number;
  remaining: number;
};

const ZoneOutMode = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [autoPlayActive, setAutoPlayActive] = useState(false);
  const [timer, setTimer] = useState<TimerSettings>({
    active: false,
    duration: 15 * 60, // 15 minutes in seconds
    remaining: 15 * 60
  });
  const [animation, setAnimation] = useState<'waves' | 'stars' | 'particles'>('waves');
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Handle volume changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        const playPromise = audioElement.play();
        
        // Handle play() promise to avoid DOMException
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Autoplay started
          }).catch(error => {
            console.error("Play prevented by browser:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);
  
  // Handle sound selection
  useEffect(() => {
    if (audioElement && activeSound) {
      const selectedSound = AMBIENT_SOUNDS.find(sound => sound.id === activeSound);
      if (selectedSound) {
        audioElement.src = selectedSound.url;
        if (isPlaying) {
          audioElement.play()
            .catch(error => {
              console.error("Play prevented by browser on source change:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [activeSound, audioElement, isPlaying]);
  
  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timer.active && timer.remaining > 0 && isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          remaining: prev.remaining - 1
        }));
      }, 1000);
    } else if (timer.active && timer.remaining === 0) {
      setIsPlaying(false);
      setTimer(prev => ({
        ...prev,
        active: false,
        remaining: prev.duration
      }));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isPlaying]);
  
  // Auto-play next sound when current one ends
  useEffect(() => {
    if (audioElement && autoPlayActive) {
      const handleEnded = () => {
        const currentIndex = AMBIENT_SOUNDS.findIndex(sound => sound.id === activeSound);
        const nextIndex = (currentIndex + 1) % AMBIENT_SOUNDS.length;
        const nextSound = AMBIENT_SOUNDS[nextIndex];
        setActiveSound(nextSound.id);
      };
      
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioElement, activeSound, autoPlayActive]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (activeSound || isPlaying) {
      setIsPlaying(!isPlaying);
    } else {
      // If no sound is selected, select the first one
      setActiveSound(AMBIENT_SOUNDS[0].id);
      setIsPlaying(true);
    }
  };
  
  // Select a sound
  const selectSound = (soundId: string) => {
    setActiveSound(soundId);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };
  
  // Toggle timer
  const toggleTimer = () => {
    setTimer(prev => ({
      ...prev,
      active: !prev.active,
      remaining: prev.active ? prev.duration : prev.duration
    }));
  };
  
  // Set timer duration
  const setTimerDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setTimer({
      active: timer.active,
      duration: seconds,
      remaining: seconds
    });
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle auto-play
  const toggleAutoPlay = () => {
    setAutoPlayActive(!autoPlayActive);
  };
  
  // Change animation
  const cycleAnimation = () => {
    const animations: ('waves' | 'stars' | 'particles')[] = ['waves', 'stars', 'particles'];
    const currentIndex = animations.indexOf(animation);
    const nextIndex = (currentIndex + 1) % animations.length;
    setAnimation(animations[nextIndex]);
  };

  return (
    <div className="relative min-h-[500px]">
      {/* Animation Background */}
      {animation === 'waves' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-blue-300/30"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`wave-${i}`}
              className="absolute bottom-0 w-full h-40 bg-blue-100/30"
              style={{
                animation: `wave ${5 + i * 0.5}s infinite linear`,
                opacity: 0.5 - i * 0.1,
                left: `${i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                borderRadius: '50% 50% 0 0',
                transform: 'scale(1.5)',
              }}
            ></div>
          ))}
        </div>
      )}
      
      {animation === 'stars' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-b from-indigo-900/70 to-purple-900/70">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.5 + 0.25,
                animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate`,
              }}
            ></div>
          ))}
        </div>
      )}
      
      {animation === 'particles' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-b from-green-100/50 to-teal-200/30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 3}px`,
                height: `${Math.random() * 8 + 3}px`,
                opacity: Math.random() * 0.3 + 0.1,
                animation: `float ${Math.random() * 10 + 10}s infinite linear`,
                transform: `translateY(${Math.random() * 100}px)`,
              }}
            ></div>
          ))}
        </div>
      )}

      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Zone Out with Mitra</span>
            <Button variant="ghost" size="sm" onClick={cycleAnimation}>
              <Waves className="h-4 w-4 mr-2" />
              Change Scene
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <button 
              onClick={togglePlay}
              className={`transition-transform duration-300 ${isPlaying ? 'scale-90' : 'scale-100'}`}
            >
              {isPlaying ? (
                <PauseCircle size={80} className="text-purple-500 hover:text-purple-600 transition-colors" />
              ) : (
                <PlayCircle size={80} className="text-purple-500 hover:text-purple-600 transition-colors" />
              )}
            </button>
            
            {timer.active && (
              <div className="mt-4 text-2xl font-light">
                {formatTime(timer.remaining)}
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Select Sound</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMBIENT_SOUNDS.map((sound) => (
                <Button
                  key={sound.id}
                  variant={activeSound === sound.id ? "default" : "outline"}
                  className={`rounded-lg ${activeSound === sound.id ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                  onClick={() => selectSound(sound.id)}
                >
                  {sound.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Volume</h3>
              <span className="text-sm text-gray-500">{volume}%</span>
            </div>
            <div className="px-1">
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(vals) => setVolume(vals[0])}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant={timer.active ? "default" : "outline"} 
              className={`flex-1 rounded-lg ${timer.active ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
              onClick={toggleTimer}
            >
              <Clock className="h-4 w-4 mr-2" />
              {timer.active ? "Cancel Timer" : "Set Timer"}
            </Button>
            
            <Button 
              variant={autoPlayActive ? "default" : "outline"} 
              className={`flex-1 rounded-lg ${autoPlayActive ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={toggleAutoPlay}
            >
              {autoPlayActive ? "Auto-Play On" : "Auto-Play Off"}
            </Button>
          </div>
          
          {timer.active === false && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button 
                variant="outline" 
                className="rounded-lg"
                onClick={() => setTimerDuration(5)}
              >
                5 min
              </Button>
              <Button 
                variant="outline" 
                className="rounded-lg"
                onClick={() => setTimerDuration(15)}
              >
                15 min
              </Button>
              <Button 
                variant="outline" 
                className="rounded-lg"
                onClick={() => setTimerDuration(30)}
              >
                30 min
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 italic">Take a moment to breathe and be present. No hurry, no worry.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ZoneOutMode;
