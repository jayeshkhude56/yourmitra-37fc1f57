
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import EmotionalContent from '@/components/EmotionalContent';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col">
            <div className="flex items-center justify-center py-6">
              <MainContent 
                isSessionActive={isSessionActive}
                startSession={startSession}
                endSession={endSession}
              />
            </div>
            
            <div className="flex-1 pb-6 px-6">
              <EmotionalContent />
            </div>
          </main>
        </div>
      </div>
    </MoodProvider>
  );
};

export default Index;
