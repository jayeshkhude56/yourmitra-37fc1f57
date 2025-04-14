
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';
import { useMood, MoodType } from '@/contexts/MoodContext';

const MoodTracking = () => {
  const { moodHistory } = useMood();
  
  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
      case 'calm':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'sad':
      case 'anxious':
      case 'angry':
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
        return 'bg-orange-100 text-orange-700';
      case 'calm':
        return 'bg-blue-100 text-blue-700';
      case 'sad':
        return 'bg-gray-100 text-gray-700';
      case 'anxious':
        return 'bg-yellow-100 text-yellow-700';
      case 'angry':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-purple-100 text-purple-700';
    }
  };
  
  const getRelativeTimeString = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  const recentMoods = moodHistory.slice(0, 7); // Only show last 7 moods
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mood Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMoods.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            Your mood history will appear here as you share how you're feeling with Mitra.
          </p>
        ) : (
          <div className="space-y-3">
            {recentMoods.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getMoodIcon(entry.mood)}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                    {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{getRelativeTimeString(new Date(entry.date))}</span>
              </div>
            ))}
          </div>
        )}
        
        {recentMoods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              These patterns help Mitra understand how to better support your emotional journey.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracking;
