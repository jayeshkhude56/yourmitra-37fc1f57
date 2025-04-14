
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import SpeechProcessor from '@/services/SpeechProcessor';
import { Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Session active state changed:", isSessionActive);
    if (isSessionActive) {
      setIsBreathing(true);
      setInterimText("");
      setUserText("");
      setResponseText("");
      setVoiceError(null);
      
      // Set OpenAI API key
      const apiKey = "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";
      SpeechProcessor.setApiKey(apiKey);
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
            const response = await SpeechProcessor.getAIResponse(text);
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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6 rounded-xl shadow-sm transition-colors duration-500 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center w-full">
        <div 
          onClick={userSpeaking ? handleStopListening : handleStartListening}
          className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 cursor-pointer relative
            ${(userSpeaking || isMitraSpeaking) ? 'animate-pulse' : 'breathing-circle'} 
            bg-blue-200`}
        >
          {/* Empty breathing circle, no M */}
        </div>

        {!voiceError ? (
          <div className="h-8 mb-4 flex items-center">
            {(userSpeaking || isMitraSpeaking || interimText) ? (
              <div className="flex items-center justify-center space-x-1 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i}
                    className="text-blue-600 w-1 rounded-full"
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
              <p className={`text-lg ${isMitraSpeaking ? 'text-blue-600' : ''}`}>{responseText}</p>
            </div>
          )}
          
          {/* Show welcome message when nothing else is showing */}
          {!userSpeaking && !isMitraSpeaking && !interimText && !userText && !responseText && (
            <div className="mt-4 italic text-gray-600">
              <p>Hi there! I'm Mitra, your AI companion. How are you feeling today?</p>
              <p className="text-sm mt-2">Click on the circle to start speaking with me.</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!userSpeaking ? (
            <Button 
              onClick={handleStartListening}
              className="hover:bg-opacity-80 text-white px-6 py-4 h-auto rounded-xl shadow-sm bg-blue-500"
              disabled={isMitraSpeaking}
            >
              Speak to Mitra
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              variant="outline"
              className="border-blue-400 text-blue-600 hover:bg-blue-50 px-6 py-4 h-auto rounded-xl shadow-sm"
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
      </div>
    </div>
  );
};

export default MainContent;
