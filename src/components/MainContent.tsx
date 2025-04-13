
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SpeechProcessor from '@/services/SpeechProcessor';

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

  useEffect(() => {
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
    setUserSpeaking(true);
    setInterimText("");
    setVoiceError(null);
    
    SpeechProcessor.startListening(
      (text) => {
        setInterimText(text);
        if (text.trim().length === 0) {
          setTimeout(() => {
            if (text.trim().length === 0) {
              setVoiceError("Sorry, I didn't get that. Could you please try again?");
              setUserSpeaking(false);
            }
          }, 2000);
        }
      },
      async (text) => {
        if (text.trim().length > 0) {
          setUserSpeaking(false);
          setUserText(text);
          setInterimText("");
          setVoiceError(null);
          
          // Get AI response
          const response = await SpeechProcessor.getAIResponse(text);
          setResponseText(response);
          
          // Speak the response
          setIsMitraSpeaking(true);
          SpeechProcessor.speak(response, () => {
            setIsMitraSpeaking(false);
          });
        } else {
          setVoiceError("Sorry, I didn't get that. Could you please try again?");
          setUserSpeaking(false);
        }
      }
    );
  };
  
  const handleStopListening = () => {
    setUserSpeaking(false);
    SpeechProcessor.stopListening();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6">
      <div className="flex flex-col items-center w-full">
        <div 
          onClick={userSpeaking ? handleStopListening : handleStartListening}
          className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 cursor-pointer
            ${(userSpeaking || isMitraSpeaking) ? 'animate-pulse' : 'breathing-circle'} 
            ${userSpeaking ? 'bg-mitra-light-blue' : 'bg-mitra-light-blue bg-opacity-70'}`}
        >
          {/* Empty breathing circle */}
        </div>

        {/* Voice line visualization */}
        {!voiceError ? (
          <div className="h-8 mb-4 flex items-center">
            {(userSpeaking || isMitraSpeaking || interimText) ? (
              <div className="flex items-center justify-center space-x-1 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i}
                    className="bg-mitra-deep-pink w-1 rounded-full"
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
              <p className={`text-lg ${isMitraSpeaking ? 'text-mitra-deep-pink' : ''}`}>{responseText}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!userSpeaking ? (
            <Button 
              onClick={handleStartListening}
              className="bg-mitra-light-blue hover:bg-blue-500 text-white px-6 py-4 h-auto rounded-full"
              disabled={isMitraSpeaking}
            >
              Speak to Mitra
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              variant="outline"
              className="border-mitra-light-blue text-mitra-light-blue hover:bg-blue-50 px-6 py-4 h-auto rounded-full"
            >
              Stop Speaking
            </Button>
          )}
          
          <Button 
            onClick={endSession}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 px-6 py-4 h-auto rounded-full"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
