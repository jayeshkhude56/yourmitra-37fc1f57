
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Clock, MessageSquare, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

const Sidebar = ({
  isOpen,
  toggleSidebar
}: SidebarProps) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

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

  const handleTabClick = (tabName: string) => {
    if (activeTab === tabName) {
      setActiveTab(null);
    } else {
      setActiveTab(tabName);
    }
  };

  // The content for each menu item
  const homeContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Welcome to Mitra</h3>
      <p className="text-gray-600 mb-4">Your voice-activated AI companion ready to help.</p>
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
            {conversations.map(conv => (
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
  
  const journalContent = (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Listening Journal</h3>
      <p className="text-gray-600 mb-4">A safe space to express your thoughts and feelings.</p>
      <Button className="bg-mitra-sky-blue hover:bg-blue-600" onClick={() => navigate('/journal')}>
        Open Journal
      </Button>
    </div>
  );

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
      
      <aside className={`bg-mitra-light-blue transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'} min-h-screen flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Mitra</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-blue-200">
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
                variant={activeTab === "journal" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 hover:bg-blue-200 ${activeTab === "journal" ? "bg-blue-300" : ""}`} 
                onClick={() => handleTabClick("journal")}
              >
                <Book size={20} />
                <span className="ml-2">Journal</span>
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

        {activeTab && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-lg p-3 shadow">
              {activeTab === "home" && homeContent}
              {activeTab === "history" && historyContent}
              {activeTab === "journal" && journalContent}
              {activeTab === "feedback" && feedbackContent}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
