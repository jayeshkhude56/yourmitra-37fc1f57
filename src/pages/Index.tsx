
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startSession = () => {
    setIsSessionActive(true);
  };

  const endSession = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="min-h-screen flex bg-pink-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <MainContent 
            isSessionActive={isSessionActive}
            startSession={startSession}
            endSession={endSession}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
