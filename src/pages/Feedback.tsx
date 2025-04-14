
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.trim().length < 3) {
      toast({
        title: "Feedback too short",
        description: "Please provide more details to help us improve",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally submit the feedback to an API
    toast({
      title: "Feedback submitted",
      description: "Thank you for helping us improve Mitra!",
    });
    
    setFeedback('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="py-4 px-6 flex justify-between items-center">
        <Link to="/landing">
          <Button variant="ghost" className="rounded-full">
            <Home className="h-5 w-5 mr-2" /> Home
          </Button>
        </Link>
        
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Share Your Feedback
        </h1>
        
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> How can we improve?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Textarea 
                  placeholder="Share your thoughts, suggestions, or experiences with Mitra..."
                  className="min-h-40 rounded-xl mb-4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    disabled={feedback.trim().length < 3}
                  >
                    <Send className="h-4 w-4 mr-2" /> Submit Feedback
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
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

export default Feedback;
