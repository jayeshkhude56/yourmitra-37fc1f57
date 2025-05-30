
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import SpeechProcessor from '@/services/SpeechProcessor';
import { Volume2, VolumeX, Mic, RefreshCw } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(false);
  const [processingResponse, setProcessingResponse] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Session active state changed:", isSessionActive);
    if (isSessionActive) {
      setIsBreathing(true);
      setInterimText("");
      setUserText("");
      setResponseText("");
      setVoiceError(null);
      setConnectionStatus('connected');
      setRetryCount(0);
      
      // Set TTS state based on mute setting
      SpeechProcessor.setUseTTS(!isMuted);
    } else {
      setIsBreathing(false);
      setUserSpeaking(false);
      setInterimText("");
      setUserText("");
      setResponseText("");
      setVoiceError(null);
      setConnectionStatus('connected');
      setRetryCount(0);
    }
  }, [isSessionActive, isMuted]);

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
          setProcessingResponse(true);
          setConnectionStatus('connected');
          
          console.log("Getting AI response for text:", text);
          try {
            const response = await SpeechProcessor.getAIResponse(text);
            console.log("Received AI response:", response);
            
            if (!response || response.trim().length === 0) {
              throw new Error("Received empty response from AI");
            }
            
            // Check if response contains connection error message
            if (response.includes("trouble connecting") || 
                response.includes("having trouble") ||
                response.includes("connection issues")) {
              setConnectionStatus('error');
              setRetryCount(prev => prev + 1);
            } else {
              setConnectionStatus('connected');
            }
            
            setResponseText(response);
            setProcessingResponse(false);
            
            console.log("Speaking AI response");
            setIsMitraSpeaking(true);
            await SpeechProcessor.speak(response, () => {
              console.log("AI finished speaking");
              setIsMitraSpeaking(false);
            });
          } catch (error) {
            console.error("Error getting or speaking AI response:", error);
            setVoiceError("Sorry, I had trouble processing that. Could you please try again?");
            setProcessingResponse(false);
            setIsMitraSpeaking(false);
            setConnectionStatus('error');
            setRetryCount(prev => prev + 1);
            
            // Try once more with local fallback
            try {
              let fallbackResponse;
              
              if (retryCount > 2) {
                fallbackResponse = "I'm having persistent trouble connecting to my systems. Let's try a different approach. How about you tell me more about how you're feeling today?";
              } else {
                fallbackResponse = "I seem to be having trouble connecting right now. Let's try again in a moment. How are you feeling today?";
              }
              
              setResponseText(fallbackResponse);
              
              if (!isMuted) {
                setIsMitraSpeaking(true);
                await SpeechProcessor.speakWithBrowserTTS(fallbackResponse, () => {
                  setIsMitraSpeaking(false);
                });
              }
            } catch (fallbackError) {
              console.error("Even fallback speech failed:", fallbackError);
            }
          }
        } else {
          console.log("Empty speech detected");
          setVoiceError("Sorry, I didn't get that. Could you please try again?");
          setUserSpeaking(false);
          setProcessingResponse(false);
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

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    SpeechProcessor.setUseTTS(!newMutedState);
    toast({
      title: newMutedState ? "Voice responses muted" : "Voice responses enabled",
      description: newMutedState 
        ? "Mitra will respond with text only." 
        : "Mitra will respond with voice and text.",
    });
  };
  
  // Function to manually retry getting a response if the automatic process failed
  const handleRetryResponse = async () => {
    if (!userText || processingResponse) return;
    
    setVoiceError(null);
    setProcessingResponse(true);
    setConnectionStatus('reconnecting');
    
    try {
      const response = await SpeechProcessor.getAIResponse(userText);
      console.log("Retry received AI response:", response);
      
      if (!response || response.trim().length === 0) {
        throw new Error("Received empty response from retry");
      }
      
      // Check if response contains connection error message
      if (response.includes("trouble connecting") || 
          response.includes("having trouble") || 
          response.includes("connection issues")) {
        setConnectionStatus('error');
        setRetryCount(prev => prev + 1);
      } else {
        setConnectionStatus('connected');
        setRetryCount(0);
      }
      
      setResponseText(response);
      setProcessingResponse(false);
      
      console.log("Speaking retry AI response");
      setIsMitraSpeaking(true);
      await SpeechProcessor.speak(response, () => {
        console.log("AI finished speaking retry response");
        setIsMitraSpeaking(false);
      });
    } catch (error) {
      console.error("Error in retry:", error);
      setVoiceError("I'm still having trouble connecting. Please check your internet connection and try again shortly.");
      setProcessingResponse(false);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
    }
  };

  // Get the style for the main circle based on current state
  const getCircleStyle = () => {
    if (processingResponse) {
      return 'bg-purple-200';
    } else if (connectionStatus === 'error') {
      return 'bg-amber-100';
    } else if (isMitraSpeaking) {
      return 'bg-blue-200 animate-pulse';
    } else if (userSpeaking) {
      return 'bg-green-200 animate-pulse';
    } else {
      return 'bg-blue-200 breathing-circle';
    }
  };

  // Function to show appropriate emotional indicators
  const renderEmotionalIndicator = () => {
    if (voiceError) {
      return (
        <div className="h-8 mb-4 text-red-500 text-sm flex items-center">
          <span>{voiceError}</span>
          {userText && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-xs text-blue-500 hover:text-blue-700 p-1 h-auto"
              onClick={handleRetryResponse}
              disabled={processingResponse}
            >
              <RefreshCw size={14} className="mr-1" /> Retry
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="h-8 mb-4 flex items-center">
        {(userSpeaking || isMitraSpeaking || interimText || processingResponse) ? (
          <div className="flex items-center justify-center space-x-1 h-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i}
                className={`${
                  connectionStatus === 'error' 
                    ? 'bg-amber-400' 
                    : connectionStatus === 'reconnecting' 
                    ? 'bg-purple-400' 
                    : 'bg-blue-600'
                } w-1 rounded-full`}
                style={{
                  height: `${Math.random() * 24 + (userSpeaking || isMitraSpeaking || processingResponse ? 8 : 4)}px`,
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
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6 rounded-xl shadow-sm transition-colors duration-500 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center w-full">
        <div className="relative">
          <div 
            onClick={userSpeaking ? handleStopListening : handleStartListening}
            className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 cursor-pointer relative ${getCircleStyle()}`}
          >
            {(isMitraSpeaking || processingResponse) && (
              <div className={`absolute inset-0 rounded-full ${
                connectionStatus === 'error' ? 'bg-amber-200' : 'bg-blue-300'
              } opacity-20 animate-ping`}></div>
            )}
            
            {processingResponse && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                  connectionStatus === 'error' ? 'border-amber-500' : 'border-blue-500'
                }`}></div>
              </div>
            )}
            
            {connectionStatus === 'error' && !processingResponse && (
              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                <RefreshCw size={32} className="text-amber-600" />
              </div>
            )}
          </div>
          
          {/* Mute/unmute button */}
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-white border-blue-200 hover:bg-blue-50"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>

        {renderEmotionalIndicator()}

        <div className="mb-8 min-h-32 text-center">
          {interimText && (
            <p className="text-lg text-gray-500">{interimText}</p>
          )}
          
          {processingResponse && !interimText && (
            <p className="text-md text-purple-500 italic">
              {connectionStatus === 'reconnecting' ? 'Reconnecting to Mitra...' : 'Mitra is thinking...'}
            </p>
          )}
          
          {userText && !interimText && !processingResponse && (
            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1">You said:</h3>
              <p className="text-lg">{userText}</p>
            </div>
          )}
          
          {responseText && !interimText && !processingResponse && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-400 mb-1">Mitra:</h3>
              <p className={`text-lg ${isMitraSpeaking ? 'text-blue-600' : ''} ${connectionStatus === 'error' ? 'text-amber-700' : ''}`}>
                {responseText}
              </p>
            </div>
          )}
          
          {/* Show welcome message when nothing else is showing */}
          {!userSpeaking && !isMitraSpeaking && !interimText && !userText && !responseText && !processingResponse && (
            <div className="mt-4 italic text-gray-600">
              <p>Hi there! I'm Mitra, your AI companion. How are you feeling today?</p>
              <p className="text-sm mt-2">Click on the circle to start speaking with me.</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!userSpeaking && !processingResponse ? (
            <Button 
              onClick={handleStartListening}
              className="hover:bg-opacity-80 text-white px-6 py-4 h-auto rounded-xl shadow-sm bg-blue-500"
              disabled={isMitraSpeaking || processingResponse}
            >
              <Mic size={18} className="mr-2" /> Speak to Mitra
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              variant="outline"
              className="border-blue-400 text-blue-600 hover:bg-blue-50 px-6 py-4 h-auto rounded-xl shadow-sm"
              disabled={processingResponse && !userSpeaking}
            >
              {processingResponse ? 'Processing...' : 'Stop Speaking'}
            </Button>
          )}
          
          {connectionStatus === 'error' && !processingResponse && userText && (
            <Button 
              onClick={handleRetryResponse}
              variant="outline" 
              className="border-amber-400 text-amber-700 hover:bg-amber-50 px-6 py-4 h-auto rounded-xl shadow-sm"
            >
              <RefreshCw size={18} className="mr-2" /> Reconnect
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
