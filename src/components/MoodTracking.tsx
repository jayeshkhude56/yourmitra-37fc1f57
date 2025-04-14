import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';
import { useMood, MoodType } from '@/contexts/MoodContext';

const MoodTracking = () => {
  const { moodHistory, journalEntries } = useMood();
  
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
  
  const getMoodInsight = () => {
    if (moodHistory.length < 3) return null;
    
    const moodCounts: Record<string, number> = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let dominantMood: MoodType = 'neutral';
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        highestCount = count;
        dominantMood = mood as MoodType;
      }
    });
    
    switch (dominantMood) {
      case 'happy':
        return "You've been experiencing joy lately. What's bringing you happiness?";
      case 'calm':
        return "You've found some peace recently. What practices help you feel centered?";
      case 'sad':
        return "I notice you've been feeling down. Remember it's okay to not be okay.";
      case 'anxious':
        return "You've been feeling some anxiety. Take gentle care of yourself today.";
      case 'angry':
        return "I see you've felt frustrated recently. Your feelings are valid.";
      default:
        return "I notice your emotions have been varied. That's completely normal.";
    }
  };
  
  const combinedMoodEntries = [...moodHistory];
  
  journalEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (!moodHistory.some(m => 
      Math.abs(new Date(m.date).getTime() - entryDate.getTime()) < 60000
    )) {
      combinedMoodEntries.push({
        date: entryDate,
        mood: entry.mood
      });
    }
  });
  
  combinedMoodEntries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const recentMoods = combinedMoodEntries.slice(0, 7);
  
  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
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
        
        {getMoodInsight() && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 italic">
              {getMoodInsight()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracking;
