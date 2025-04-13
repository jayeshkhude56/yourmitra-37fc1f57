
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
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

  useEffect(() => {
    if (isSessionActive) {
      setIsBreathing(true);
      setInterimText("");
      setUserText("");
      setResponseText("");
    } else {
      setIsBreathing(false);
      setUserSpeaking(false);
      setInterimText("");
      setUserText("");
      setResponseText("");
    }
  }, [isSessionActive]);
  
  const handleStartListening = () => {
    setUserSpeaking(true);
    setInterimText("");
    
    SpeechProcessor.startListening(
      (text) => {
        setInterimText(text);
      },
      async (text) => {
        setUserSpeaking(false);
        setUserText(text);
        setInterimText("");
        
        // Get AI response
        const response = await SpeechProcessor.getAIResponse(text);
        setResponseText(response);
        
        // Speak the response
        setIsMitraSpeaking(true);
        SpeechProcessor.speak(response, () => {
          setIsMitraSpeaking(false);
        });
      }
    );
  };
  
  const handleStopListening = () => {
    setUserSpeaking(false);
    SpeechProcessor.stopListening();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6">
      {!isSessionActive ? (
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-6">Welcome to Mitra</h1>
          <p className="text-lg mb-10 text-gray-700">
            Your personal AI companion to help you relieve stress and process emotions.
            Speak freely, and I'm here to listen.
          </p>
          <Button 
            onClick={startSession}
            className="bg-mitra-sky-blue hover:bg-blue-500 text-white px-8 py-6 h-auto text-lg rounded-full"
          >
            Begin
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div 
            className={`w-40 h-40 rounded-full flex items-center justify-center mb-10
              ${(userSpeaking || isMitraSpeaking) ? 'animate-pulse' : ''} 
              ${userSpeaking ? 'bg-mitra-sky-blue' : 'bg-mitra-light-blue'}`}
          >
            <div className="text-center">
              {userSpeaking ? (
                <Mic size={40} className="text-white" />
              ) : (
                <MicOff size={40} className="text-gray-400" />
              )}
            </div>
          </div>

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
                className="bg-mitra-sky-blue hover:bg-blue-500 text-white px-6 py-4 h-auto"
                disabled={isMitraSpeaking}
              >
                <Mic className="mr-2" /> Speak to Mitra
              </Button>
            ) : (
              <Button 
                onClick={handleStopListening}
                variant="outline"
                className="border-mitra-sky-blue text-mitra-sky-blue hover:bg-blue-50 px-6 py-4 h-auto"
              >
                <MicOff className="mr-2" /> Stop Speaking
              </Button>
            )}
            
            <Button 
              onClick={endSession}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 px-6 py-4 h-auto"
            >
              End Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
