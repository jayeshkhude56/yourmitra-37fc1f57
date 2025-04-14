
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Clock, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ConversationEntry {
  id: string;
  timestamp: Date;
  topic: string;
  snippets: string[];
}

const History = () => {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load conversation history from localStorage
    const savedConversations = localStorage.getItem('mitra-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Convert string dates back to Date objects
        const formatted = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
        setConversations(formatted);
      } catch (err) {
        console.error("Error loading conversation history:", err);
      }
    }
  }, []);
  
  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    localStorage.setItem('mitra-conversations', JSON.stringify(updatedConversations));
    
    toast({
      title: "Conversation deleted",
      description: "Your conversation has been removed from history",
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
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
          Session History
        </h1>
        
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">No conversations yet</h2>
              <p className="text-gray-500 mb-6">Your chat history with Mitra will appear here</p>
              <Link to="/">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Start a conversation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Card key={conversation.id} className="rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{conversation.topic}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{formatDate(conversation.timestamp)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => deleteConversation(conversation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-60 overflow-y-auto py-4">
                    <div className="space-y-3">
                      {conversation.snippets.slice(0, 4).map((snippet, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {snippet}
                        </p>
                      ))}
                      
                      {conversation.snippets.length > 4 && (
                        <p className="text-xs text-gray-400 italic">
                          + {conversation.snippets.length - 4} more messages
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
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

export default History;
