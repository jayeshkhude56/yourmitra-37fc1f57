
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-calmi-blue py-20 md:py-28">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-medium mb-6">
            Find your calm, anytime and anywhere
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-700">
            Daily meditations and mindfulness exercises to help you relax, focus, and sleep better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-calmi-accent hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg">
              Start Your Journey
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50 flex items-center gap-2 px-8 py-6 h-auto text-lg">
              <PlayCircle size={24} />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
