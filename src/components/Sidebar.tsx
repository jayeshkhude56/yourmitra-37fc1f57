
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Clock, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Conversation {
  id: string;
  timestamp: Date;
  topic: string;
  snippets: string[];
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
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
      <Button className="bg-mitra-deep-pink hover:bg-pink-600">
        Submit Feedback
      </Button>
    </div>
  );
  
  const settingsContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Voice Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voice Speed</label>
          <input type="range" className="w-full" min="0.5" max="2" step="0.1" defaultValue="1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voice Pitch</label>
          <input type="range" className="w-full" min="0.5" max="2" step="0.1" defaultValue="1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select className="w-full p-2 border rounded">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
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
            className="bg-mitra-pink hover:bg-pink-200 ml-2"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
      
      <aside 
        className={`bg-mitra-pink transition-all duration-300 ${
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
              className="hover:bg-pink-200"
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
                className={`w-full justify-start gap-3 hover:bg-pink-200 ${activeTab === "home" ? "bg-pink-300" : ""}`}
                onClick={() => handleTabClick("home")}
              >
                <Home size={20} />
                <span>Home</span>
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === "history" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-pink-200 ${activeTab === "history" ? "bg-pink-300" : ""}`}
                onClick={() => handleTabClick("history")}
              >
                <Clock size={20} />
                <span>Session History</span>
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === "feedback" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-pink-200 ${activeTab === "feedback" ? "bg-pink-300" : ""}`}
                onClick={() => handleTabClick("feedback")}
              >
                <MessageSquare size={20} />
                <span>Feedback</span>
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto p-4">
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className={`w-full justify-start gap-3 hover:bg-pink-200 ${activeTab === "settings" ? "bg-pink-300" : ""}`}
            onClick={() => handleTabClick("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
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
