
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Heart, Shield, Gift } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="py-4 px-6 flex justify-between items-center">
        <Link to="/landing">
          <Button variant="ghost" className="rounded-full">
            <Home className="h-5 w-5 mr-2" /> Home
          </Button>
        </Link>
        
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          About Mitra
        </h1>
        
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-pink-500" />
            </div>
            
            <p className="text-xl text-gray-700 mb-6">
              Mitra is an AI companion designed to provide emotional support, 
              understanding, and a judgment-free space for you to express yourself.
            </p>
            
            <p className="text-gray-600">
              The name "Mitra" comes from Sanskrit, meaning "friend" — which is exactly what we aspire to be for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="rounded-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" /> Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Empathy First:</strong> We designed Mitra to truly understand your emotions.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Safe Space:</strong> Mitra provides a judgment-free environment for you to be yourself.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Privacy:</strong> Your conversations stay between you and Mitra.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" /> Why Mitra?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Always Available:</strong> Mitra is here for you 24/7, whenever you need support.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Personalized:</strong> Mitra learns your preferences and adapts to your needs.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1">•</span>
                    <p><strong>Emotional Growth:</strong> Track your emotional journey and gain insights into your well-being.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gradient-to-br from-white to-pink-50 p-8 rounded-xl text-center mb-10">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To create technology that supports emotional well-being and helps people feel understood, 
              valued, and less alone in their daily struggles and joys.
            </p>
          </div>
          
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
  );
};

export default About;
