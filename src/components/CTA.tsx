
import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 bg-calmi-green">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            Start your meditation journey today
          </h2>
          <p className="text-lg mb-10 text-gray-700">
            Join our community and discover the transformative power of daily meditation practice.
          </p>
          <Button className="bg-calmi-accent hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg">
            Try 7 Days Free
          </Button>
          <p className="mt-4 text-sm text-gray-600">No credit card required. Cancel anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
