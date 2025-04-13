
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "After just a week of daily practice, I've noticed a significant improvement in my sleep quality and overall mood.",
    name: "Sarah J.",
    title: "Marketing Executive",
    rating: 5
  },
  {
    quote: "These guided meditations have been a game-changer for managing my anxiety. I feel more centered throughout my day.",
    name: "Michael T.",
    title: "Software Engineer",
    rating: 5
  },
  {
    quote: "I was skeptical at first, but now meditation is an essential part of my daily routine. The short sessions make it easy to build a habit.",
    name: "Elena R.",
    title: "Healthcare Professional",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">What our members say</h2>
          <p className="text-lg text-gray-700">
            Join thousands who have transformed their daily lives through meditation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex flex-col">
                <span className="font-medium">{testimonial.name}</span>
                <span className="text-sm text-gray-600">{testimonial.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
