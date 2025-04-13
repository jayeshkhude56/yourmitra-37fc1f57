
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    title: "Sleep",
    description: "Fall asleep faster and enjoy deeper rest",
    color: "bg-calmi-blue",
    sessions: 28
  },
  {
    title: "Stress & Anxiety",
    description: "Find relief from daily pressures and worry",
    color: "bg-calmi-pink",
    sessions: 35
  },
  {
    title: "Focus",
    description: "Improve concentration and mental clarity",
    color: "bg-calmi-green",
    sessions: 22
  },
  {
    title: "Beginners",
    description: "Start your meditation journey here",
    color: "bg-calmi-beige",
    sessions: 15
  },
  {
    title: "Self-Care",
    description: "Nurture yourself with loving kindness",
    color: "bg-calmi-neutral",
    sessions: 19
  },
  {
    title: "Performance",
    description: "Optimize your mental performance",
    color: "bg-calmi-blue",
    sessions: 24
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Explore our meditation library</h2>
          <p className="text-lg text-gray-700">
            Find the perfect meditation for any moment in your day.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className={`p-0`}>
                <div className={`${category.color} p-8 h-full`}>
                  <div className="flex justify-between items-start mb-16">
                    <h3 className="text-2xl font-medium">{category.title}</h3>
                    <span className="text-sm text-gray-600">{category.sessions} sessions</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-gray-700 max-w-[80%]">{category.description}</p>
                    <ArrowRight className="text-calmi-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
