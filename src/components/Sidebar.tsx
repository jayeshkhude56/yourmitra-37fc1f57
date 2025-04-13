import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Clock, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceGenderSelector from './VoiceGenderSelector';
import SpeechProcessor from '@/services/SpeechProcessor';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedGender?: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
}

interface Conversation {
  id: string;
  timestamp: Date;
  topic: string;
  snippets: string[];
}

// Model configuration type
type AIModelType = 'coach' | 'cryBuddy' | 'mindReader';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  selectedGender, 
  onGenderChange 
}: SidebarProps) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModelType>(() => {
    // Try to get the saved model from localStorage, default to 'coach'
    const savedModel = localStorage.getItem('mitra-selected-model');
    return (savedModel as AIModelType) || 'coach';
  });
  
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>(() => {
    // Try to get the saved voice gender from localStorage, default to 'male'
    const savedGender = localStorage.getItem('mitra-voice-gender');
    return (savedGender as 'male' | 'female') || 'male';
  });
  
  const handleVoiceGenderChange = (gender: 'male' | 'female') => {
    if (onGenderChange) {
      onGenderChange(gender);
    }
  };
  
  // Load conversation history from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('mitra-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Convert stored string timestamps back to Date objects
        const conversations = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
        setConversations(conversations);
      } catch (error) {
        console.error('Error parsing saved conversations', error);
      }
    }
  }, []);
  
  // Save the selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mitra-selected-model', selectedModel);
  }, [selectedModel]);
  
  // The content for each menu item
  const homeContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Welcome to Mitra</h3>
      <p className="text-gray-600 mb-4">Your voice-activated AI assistant ready to help.</p>
      <p className="text-gray-600">Simply speak to interact with Mitra or browse the options in the sidebar.</p>
    </div>
  );
  
  const historyContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Session History</h3>
      {conversations.length > 0 ? (
        <>
          <p className="text-gray-600 mb-2">Your recent conversations:</p>
          <ul className="space-y-2 text-gray-600">
            {conversations.map((conv) => (
              <li key={conv.id} className="p-2 bg-gray-50 rounded">
                {new Date(conv.timestamp).toLocaleString()} - {conv.topic}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-gray-600">No conversation history yet. Start speaking with Mitra to create some!</p>
      )}
    </div>
  );
  
  const feedbackContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Share Your Feedback</h3>
      <p className="text-gray-600 mb-4">We'd love to hear your thoughts on Mitra.</p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Your experience</label>
        <textarea className="w-full p-2 border rounded" rows={3} placeholder="Tell us how we can improve..."></textarea>
      </div>
      <Button className="bg-mitra-sky-blue hover:bg-blue-600">
        Submit Feedback
      </Button>
    </div>
  );
  
  const settingsContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">AI Model Selection</h3>
      <p className="text-gray-600 mb-4">Choose the AI personality that best suits your needs:</p>
      
      <div className="space-y-4">
        <div className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedModel === 'coach' ? 'border-mitra-sky-blue bg-blue-50' : 'border-gray-200 hover:border-mitra-light-blue'}`}
          onClick={() => setSelectedModel('coach')}>
          <h4 className="font-medium">The Coach</h4>
          <p className="text-sm text-gray-600">Gives you concrete, actionable stress-busting tools like breathing exercises and mindfulness practices.</p>
          <p className="text-xs text-gray-500 mt-1">Use when you're ready for practical advice to calm down.</p>
        </div>
        
        <div className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedModel === 'cryBuddy' ? 'border-mitra-sky-blue bg-blue-50' : 'border-gray-200 hover:border-mitra-light-blue'}`}
          onClick={() => setSelectedModel('cryBuddy')}>
          <h4 className="font-medium">The Cry-Buddy</h4>
          <p className="text-sm text-gray-600">Listens and empathizes—just lets you vent and "cries" with you.</p>
          <p className="text-xs text-gray-500 mt-1">Use when you need to get it all out and feel heard.</p>
        </div>
        
        <div className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedModel === 'mindReader' ? 'border-mitra-sky-blue bg-blue-50' : 'border-gray-200 hover:border-mitra-light-blue'}`}
          onClick={() => setSelectedModel('mindReader')}>
          <h4 className="font-medium">The Mind-Reader</h4>
          <p className="text-sm text-gray-600">Picks up on how you're feeling (tone, words) and mirrors it back so you really see your stress.</p>
          <p className="text-xs text-gray-500 mt-1">Use when you want clarity on what's going on inside your head.</p>
        </div>
      </div>
    </div>
  );
  
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  
  const handleTabClick = (tabName: string) => {
    if (activeTab === tabName) {
      setActiveTab(null);
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <>
      {/* Collapsed sidebar button */}
      {!isOpen && (
        <div className="fixed left-0 top-4 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="bg-mitra-light-blue hover:bg-blue-200 ml-2"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
      
      <aside 
        className={`bg-mitra-light-blue transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        } min-h-screen flex flex-col`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Mitra</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="hover:bg-blue-200"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <Button 
                variant={activeTab === "home" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-blue-200 ${activeTab === "home" ? "bg-blue-300" : ""}`}
                onClick={() => handleTabClick("home")}
              >
                <Home size={20} />
                <span className="ml-2">Home</span>
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === "history" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-blue-200 ${activeTab === "history" ? "bg-blue-300" : ""}`}
                onClick={() => handleTabClick("history")}
              >
                <Clock size={20} />
                <span className="ml-2">Session History</span>
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === "feedback" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-blue-200 ${activeTab === "feedback" ? "bg-blue-300" : ""}`}
                onClick={() => handleTabClick("feedback")}
              >
                <MessageSquare size={20} />
                <span className="ml-2">Feedback</span>
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto p-4 space-y-3">
          {/* Voice Gender Selector - positioned before settings */}
          <div className="flex justify-center">
            <VoiceGenderSelector 
              selectedGender={selectedGender || 'male'} 
              onGenderChange={handleVoiceGenderChange}
            />
          </div>
        
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className={`w-full justify-start gap-3 hover:bg-blue-200 ${activeTab === "settings" ? "bg-blue-300" : ""}`}
            onClick={() => handleTabClick("settings")}
          >
            <Settings size={20} />
            <span className="ml-2">Settings</span>
          </Button>
        </div>

        {activeTab && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-lg p-3 shadow">
              {activeTab === "home" && homeContent}
              {activeTab === "history" && historyContent}
              {activeTab === "feedback" && feedbackContent}
              {activeTab === "settings" && settingsContent}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
