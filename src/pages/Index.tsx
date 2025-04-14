
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import MainContent from '@/components/MainContent';
import SpeechProcessor from '@/services/SpeechProcessor';
import { MoodProvider } from '@/contexts/MoodContext';

// Generate a unique ID for tracking conversations
const generateId = () => Math.random().toString(36).substring(2, 15);

interface Conversation {
  id: string;
  timestamp: Date;
  topic: string;
  snippets: string[];
}

const Index = () => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const startSession = () => {
    const newConversation = {
      id: generateId(),
      timestamp: new Date(),
      topic: "New Conversation",
      snippets: []
    };
    
    setCurrentConversation(newConversation);
    setIsSessionActive(true);
    
    // Listen for speech events to record conversation
    const originalGetAIResponse = SpeechProcessor.getAIResponse;
    SpeechProcessor.getAIResponse = async (text: string) => {
      const response = await originalGetAIResponse(text);
      
      // Update current conversation with the new exchange
      setCurrentConversation(prev => {
        if (prev) {
          const updatedConversation = {
            ...prev,
            snippets: [...prev.snippets, `You: ${text}`, `Mitra: ${response}`]
          };
          
          // If this is the first exchange, try to generate a topic
          if (prev.snippets.length === 0) {
            updatedConversation.topic = text.length > 30 
              ? text.substring(0, 30) + "..." 
              : text;
          }
          
          // Save to localStorage
          const savedConversations = localStorage.getItem('mitra-conversations');
          let conversations = savedConversations 
            ? JSON.parse(savedConversations) 
            : [];
          
          // Find if this conversation already exists in storage
          const existingIndex = conversations.findIndex((c: any) => c.id === prev.id);
          
          if (existingIndex >= 0) {
            conversations[existingIndex] = updatedConversation;
          } else {
            conversations.unshift(updatedConversation);
          }
          
          // Limit to last 10 conversations
          conversations = conversations.slice(0, 10);
          
          localStorage.setItem('mitra-conversations', JSON.stringify(conversations));
          return updatedConversation;
        }
        return prev;
      });
      
      return response;
    };
  };

  const endSession = () => {
    // Cancel any speech synthesis that might be ongoing
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Cancel any ongoing speech recognition
    SpeechProcessor.stopListening();
    
    setIsSessionActive(false);
    setCurrentConversation(null);
  };
  
  // Start a session automatically when component mounts
  useEffect(() => {
    if (isSessionActive) {
      startSession();
    }
    
    // Clean up function to handle component unmount
    return () => {
      // Make sure any speech or recognition is stopped
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      SpeechProcessor.stopListening();
    };
  }, []);

  return (
    <MoodProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
        <header className="py-4 px-6 flex items-center shadow-sm bg-white/80 backdrop-blur-md">
          <Link to="/">
            <Button variant="ghost" className="rounded-full">
              <Home className="h-5 w-5 mr-2" /> Home
            </Button>
          </Link>
          
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mx-auto">
            Talk to Mitra
          </h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </header>
        
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-center py-6 px-4">
            <MainContent 
              isSessionActive={isSessionActive}
              startSession={startSession}
              endSession={endSession}
            />
          </div>
        </main>

        <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-100">
          <p>© 2025 Mitra AI Companion</p>
        </footer>
      </div>
    </MoodProvider>
  );
};

export default Index;
