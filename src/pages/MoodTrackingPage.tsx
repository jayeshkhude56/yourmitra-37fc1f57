
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { MoodProvider } from '@/contexts/MoodContext';
import MoodTracking from '@/components/MoodTracking';

const MoodTrackingPage = () => {
  return (
    <MoodProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="py-4 px-6 flex justify-between items-center">
          <Link to="/landing">
            <Button variant="ghost" className="rounded-full">
              <Home className="h-5 w-5 mr-2" /> Home
            </Button>
          </Link>
          
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Mood Tracking
          </h1>
          
          <div className="w-20"></div> {/* Spacer for alignment */}
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
            Track your emotional journey and discover patterns in how you feel.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <MoodTracking />
            
            <div className="mt-8 text-center">
              <Link to="/">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Talk to Mitra
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </MoodProvider>
  );
};

export default MoodTrackingPage;
