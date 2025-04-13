
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Clock, MessageSquare, Settings, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside 
      className={`bg-mitra-pink transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      } min-h-screen flex flex-col`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Mitra</h2>
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
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-pink-200">
              <Home size={20} />
              <span>Home</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-pink-200">
              <Clock size={20} />
              <span>Session History</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-pink-200">
              <MessageSquare size={20} />
              <span>Feedback</span>
            </Button>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-pink-200">
          <Settings size={20} />
          <span>Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
