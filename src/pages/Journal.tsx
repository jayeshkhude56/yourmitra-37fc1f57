
import React from 'react';
import Header from '@/components/Header';
import ListeningJournal from '@/components/ListeningJournal';
import { MoodProvider } from '@/contexts/MoodContext';

const Journal = () => {
  return (
    <MoodProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Mitra Listening Journal</h1>
          <p className="text-center text-gray-600 mb-8">
            A safe space to express your thoughts and feelings. Mitra listens without judgment.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <ListeningJournal />
          </div>
        </div>
      </div>
    </MoodProvider>
  );
};

export default Journal;
