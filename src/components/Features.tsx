
import React from 'react';
import { Heart, Moon, Brain, Clock } from 'lucide-react';

const features = [
  {
    icon: <Heart className="w-10 h-10 text-pink-500" />,
    title: "Reduce Anxiety",
    description: "Our guided meditations help you manage stress and reduce anxiety in your daily life.",
    color: "bg-calmi-pink"
  },
  {
    icon: <Moon className="w-10 h-10 text-indigo-500" />,
    title: "Better Sleep",
    description: "Fall asleep faster and stay asleep longer with our specialized sleep meditations.",
    color: "bg-calmi-blue"
  },
  {
    icon: <Brain className="w-10 h-10 text-green-500" />,
    title: "Improve Focus",
    description: "Sharpen your attention and boost productivity with mindfulness practices.",
    color: "bg-calmi-green"
  },
  {
    icon: <Clock className="w-10 h-10 text-orange-500" />,
    title: "Daily Consistency",
    description: "Build a sustainable meditation habit with sessions as short as 2 minutes.",
    color: "bg-calmi-beige"
  }
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Transform your mind with meditation</h2>
          <p className="text-lg text-gray-700">
            Experience the proven benefits of regular meditation and mindfulness practice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.color} p-8 rounded-2xl animate-fade-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
