
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import ListeningJournal from '@/components/ListeningJournal';
import { MoodProvider } from '@/contexts/MoodContext';

const Journal = () => {
  return (
    <MoodProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="py-4 px-6 flex justify-between items-center shadow-sm bg-white/80 backdrop-blur-md">
          <Link to="/">
            <Button variant="ghost" className="rounded-full">
              <Home className="h-5 w-5 mr-2" /> Home
            </Button>
          </Link>
          
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Mitra Listening Journal
          </h1>
          
          <div className="w-20"></div> {/* Spacer for alignment */}
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 mb-8">
            A safe space to express your thoughts and feelings. Mitra listens without judgment.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <ListeningJournal />

            <div className="mt-8 text-center">
              <Link to="/talk">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Talk to Mitra
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-100 mt-8">
          <p>© 2025 Mitra AI Companion</p>
        </footer>
      </div>
    </MoodProvider>
  );
};

export default Journal;
