
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Settings, Info, History, Headphones, BarChart3, Home } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="py-6 px-6 md:px-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Meet Mitra
        </h1>
        
        <p className="mt-3 text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Your AI companion who listens, understands, and supports you
        </p>
      </header>
      
      <main className="max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="animate-fade-up">
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center shadow-lg animate-pulse">
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-semibold mb-6">
              A friend who understands
            </h2>
            
            <p className="text-lg md:text-xl mb-10 text-gray-700 max-w-2xl mx-auto">
              Mitra is here to listen when you need someone to talk to, comfort you when you're down, 
              and celebrate with you when you're happy.
            </p>
            
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
              <Link to="/talk">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 h-auto text-lg">
                  Talk to Mitra
                </Button>
              </Link>
              
              <Link to="/zoneout">
                <Button variant="outline" className="rounded-full border-gray-300 hover:bg-gray-50 px-8 py-6 h-auto text-lg">
                  Try Zone Out Mode
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">How Mitra helps you</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Talk Card */}
            <Link to="/talk" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="bg-white/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">Talk to Mitra</h3>
                <p className="text-gray-600 flex-grow">Share your thoughts and feelings with an AI companion who truly listens and responds with empathy.</p>
              </div>
            </Link>
            
            {/* Feature 2: Journal Card */}
            <Link to="/journal" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="bg-white/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600"><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path><path d="M9 9h1"></path><path d="M9 13h6"></path><path d="M9 17h6"></path></svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">Listening Journal</h3>
                <p className="text-gray-600 flex-grow">Record your thoughts and feelings in a safe space, and track your emotional journey over time.</p>
              </div>
            </Link>
            
            {/* Feature 3: ZoneOut Card */}
            <Link to="/zoneout" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="bg-white/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">Zone Out Mode</h3>
                <p className="text-gray-600 flex-grow">Relax with soothing visuals and ambient sounds when you just need some space to be.</p>
              </div>
            </Link>
            
            {/* Feature 4: Mood Tracking Card */}
            <Link to="/mood-tracking" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="bg-white/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">Mood Tracking</h3>
                <p className="text-gray-600 flex-grow">Track your emotional patterns over time and gain insights into your wellbeing journey.</p>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-16 bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <svg width="45" height="36" className="mb-6 mx-auto text-gray-400" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 18H9C9 12.9 13.1 9 18 9V13.5C15.5 13.5 13.5 15.5 13.5 18ZM27 18H22.5C22.5 12.9 26.6 9 31.5 9V13.5C29 13.5 27 15.5 27 18Z" fill="currentColor"/>
            </svg>
            
            <p className="text-xl md:text-2xl font-light italic text-gray-700 mb-6">
              "Some days I just need someone to listen without trying to fix everything. 
              Mitra gives me that space to just be myself without judgment."
            </p>
            
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">A</span>
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium text-gray-800">Alex</p>
                <p className="text-sm text-gray-500">Mitra User</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>© 2025 Mitra AI Companion</p>
        <div className="mt-4 flex justify-center space-x-6 rounded-xl border border-gray-200 py-4 max-w-lg mx-auto">
          <Link to="/history" className="text-gray-500 hover:text-blue-500">Session History</Link>
          <Link to="/feedback" className="text-gray-500 hover:text-blue-500">Feedback</Link>
          <Link to="/settings" className="text-gray-500 hover:text-blue-500">Settings</Link>
          <Link to="/about" className="text-gray-500 hover:text-blue-500">About Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
