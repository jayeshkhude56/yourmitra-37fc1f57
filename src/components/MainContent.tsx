import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SpeechProcessor from '@/services/SpeechProcessor';
import { useMood } from '@/contexts/MoodContext';
import { Heart } from 'lucide-react';

interface MainContentProps {
  isSessionActive: boolean;
  startSession: () => void;
  endSession: () => void;
}

const MainContent = ({ isSessionActive, startSession, endSession }: MainContentProps) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [userText, setUserText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isMitraSpeaking, setIsMitraSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const { currentMood, isEmpathyMode } = useMood();
  
  useEffect(() => {
    console.log("Session active state changed:", isSessionActive);
    if (isSessionActive) {
      setIsBreathing(true);
      setInterimText("");
      setUserText("");
      setResponseText("");
      setVoiceError(null);
    } else {
      setIsBreathing(false);
      setUserSpeaking(false);
      setInterimText("");
      setUserText("");
      setResponseText("");
      setVoiceError(null);
    }
  }, [isSessionActive]);
  
  const handleStartListening = () => {
    console.log("Starting to listen for user speech");
    setUserSpeaking(true);
    setInterimText("");
    setVoiceError(null);
    
    SpeechProcessor.startListening(
      (text) => {
        setInterimText(text);
        console.log("Received interim text:", text);
        
        if (text.trim().length === 0) {
          setTimeout(() => {
            if (text.trim().length === 0) {
              setVoiceError("Sorry, I didn't get that. Could you please try again?");
              setUserSpeaking(false);
              console.log("No speech detected after timeout");
            }
          }, 2000);
        }
      },
      async (text) => {
        console.log("Received final speech text:", text);
        if (text.trim().length > 0) {
          setUserSpeaking(false);
          setUserText(text);
          setInterimText("");
          setVoiceError(null);
          
          console.log("Getting AI response for text:", text);
          try {
            let response;
            
            // Generate empathetic responses in empathy mode
            if (isEmpathyMode) {
              const empathyResponses = [
                "I'm right here with you. It's okay to feel this way.",
                "Sometimes we just need space to feel our emotions. I'm here.",
                "It's okay to cry. I'm listening without judgment.",
                "You're not alone in this moment. I'm here with you.",
                "Take all the time you need. There's no rush to feel better."
              ];
              response = empathyResponses[Math.floor(Math.random() * empathyResponses.length)];
            } else {
              response = await SpeechProcessor.getAIResponse(text);
            }
            
            console.log("Received AI response:", response);
            
            setResponseText(response);
            
            console.log("Speaking AI response");
            setIsMitraSpeaking(true);
            SpeechProcessor.speak(response, () => {
              console.log("AI finished speaking");
              setIsMitraSpeaking(false);
            });
          } catch (error) {
            console.error("Error getting or speaking AI response:", error);
            setVoiceError("Sorry, I had trouble processing that. Could you please try again?");
          }
        } else {
          console.log("Empty speech detected");
          setVoiceError("Sorry, I didn't get that. Could you please try again?");
          setUserSpeaking(false);
        }
      }
    );
  };
  
  const handleStopListening = () => {
    console.log("Stopping listening for user speech");
    setUserSpeaking(false);
    SpeechProcessor.stopListening();
  };
  
  const handleEndSession = () => {
    console.log("Ending session");
    
    SpeechProcessor.stopListening();
    if (isMitraSpeaking) {
      window.speechSynthesis?.cancel();
      console.log("Cancelled ongoing speech");
    }
    setIsMitraSpeaking(false);
    setUserSpeaking(false);
    
    endSession();
    console.log("Session ended");
  };

  // Get background color based on current mood
  const getMoodBackground = () => {
    switch (currentMood) {
      case 'happy': return 'bg-orange-50';
      case 'sad': return 'bg-gray-50';
      case 'angry': return 'bg-red-50';
      default: return 'bg-purple-50';
    }
  };
  
  // Get the breathing circle color based on mood
  const getMoodCircleColor = () => {
    switch (currentMood) {
      case 'happy': return 'bg-orange-200';
      case 'sad': return 'bg-gray-200';
      case 'angry': return 'bg-red-200';
      default: return 'bg-purple-200';
    }
  };
  
  // Get the text color based on mood
  const getMoodTextColor = () => {
    switch (currentMood) {
      case 'happy': return 'text-orange-700';
      case 'sad': return 'text-gray-700';
      case 'angry': return 'text-red-700';
      default: return 'text-purple-700';
    }
  };
  
  // Show animated tears in empathy mode for sad mood
  const showTears = isEmpathyMode && (currentMood === 'sad');

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6 rounded-xl shadow-sm transition-colors duration-500 ${getMoodBackground()}`}>
      <div className="flex flex-col items-center w-full">
        <div 
          onClick={userSpeaking ? handleStopListening : handleStartListening}
          className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 cursor-pointer relative
            ${(userSpeaking || isMitraSpeaking) ? 'animate-pulse' : 'breathing-circle'} 
            ${getMoodCircleColor()}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated tears for empathy mode */}
            {showTears && (
              <div className="absolute top-14 left-14">
                <div className="tear-drop animate-fall-1"></div>
                <div className="tear-drop animate-fall-2 delay-300"></div>
              </div>
            )}
          </div>
        </div>

        {!voiceError ? (
          <div className="h-8 mb-4 flex items-center">
            {(userSpeaking || isMitraSpeaking || interimText) ? (
              <div className="flex items-center justify-center space-x-1 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`${getMoodTextColor()} w-1 rounded-full`}
                    style={{
                      height: `${Math.random() * 24 + (userSpeaking || isMitraSpeaking ? 8 : 4)}px`,
                      animationDelay: `${i * 0.05}s`,
                      animation: 'pulse 0.6s infinite'
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1 h-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i}
                    className="bg-gray-300 w-1 rounded-full"
                    style={{
                      height: `${4 + (i % 3) * 2}px`
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-8 mb-4 text-red-500 text-sm">{voiceError}</div>
        )}

        <div className="mb-8 min-h-32 text-center">
          {interimText && (
            <p className="text-lg text-gray-500">{interimText}</p>
          )}
          
          {userText && !interimText && (
            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1">You said:</h3>
              <p className="text-lg">{userText}</p>
            </div>
          )}
          
          {responseText && !interimText && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-400 mb-1">Mitra:</h3>
              <p className={`text-lg ${isMitraSpeaking ? getMoodTextColor() : ''}`}>{responseText}</p>
            </div>
          )}
          
          {/* Show a special message in empathy mode when silent */}
          {isEmpathyMode && !userSpeaking && !isMitraSpeaking && !interimText && !userText && (
            <div className="mt-4 italic text-gray-600">
              <p>I'm here with you in this moment. ❤️</p>
              <p className="text-sm mt-2">Sometimes just being together is enough.</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!userSpeaking ? (
            <Button 
              onClick={handleStartListening}
              className={`hover:bg-opacity-80 text-white px-6 py-4 h-auto rounded-xl shadow-sm ${getMoodBackground()} ${getMoodTextColor()}`}
              disabled={isMitraSpeaking}
            >
              Speak to Mitra
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              variant="outline"
              className={`border-blue-400 ${getMoodTextColor()} hover:bg-blue-50 px-6 py-4 h-auto rounded-xl shadow-sm`}
            >
              Stop Speaking
            </Button>
          )}
          
          <Button 
            onClick={handleEndSession}
            variant="outline"
            className="border-gray-400 text-gray-500 hover:bg-gray-50 px-6 py-4 h-auto rounded-xl shadow-sm"
          >
            End Session
          </Button>
        </div>
        
        {/* Add special Heart icon for empathy mode */}
        {isEmpathyMode && (
          <div className="mt-4">
            <Heart className="h-5 w-5 text-red-400" fill="rgba(248, 113, 113, 0.5)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
