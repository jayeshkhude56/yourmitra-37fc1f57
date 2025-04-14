
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { useMood } from '@/contexts/MoodContext';
import { Heart, Calendar as CalendarIcon } from 'lucide-react';

const MoodTracking = () => {
  const { journalEntries, currentMood } = useMood();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");

  // Get mood counts for the chart
  const getMoodData = () => {
    const moodCounts = {
      happy: 0,
      sad: 0,
      angry: 0,
    };

    journalEntries.forEach(entry => {
      if (entry.mood === 'happy' || entry.mood === 'sad' || entry.mood === 'angry') {
        moodCounts[entry.mood as 'happy' | 'sad' | 'angry']++;
      }
    });

    return [
      { name: 'Happy', count: moodCounts.happy, fill: '#FFB347' },
      { name: 'Sad', count: moodCounts.sad, fill: '#A1A5B7' },
      { name: 'Angry', count: moodCounts.angry, fill: '#FF6B6B' }
    ];
  };

  // Get journal entries for the selected date
  const getEntriesForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === selectedDate.getDate() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  // Dates with entries for the calendar
  const getDaysWithEntries = () => {
    const datesWithEntries = new Set();
    
    journalEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dateString = date.toISOString().split('T')[0];
      datesWithEntries.add(dateString);
    });
    
    return datesWithEntries;
  };

  const daysWithEntries = getDaysWithEntries();
  
  // Function to determine the CSS class for calendar days
  const getDayClass = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (daysWithEntries.has(dateString)) {
      // We now only track three moods, so let's color based on these
      const entriesForDay = journalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toISOString().split('T')[0] === dateString;
      });
      
      // Find the predominant mood for the day
      const moodCounts = { happy: 0, sad: 0, angry: 0 };
      
      entriesForDay.forEach(entry => {
        if (entry.mood === 'happy') {
          moodCounts.happy++;
        } else if (entry.mood === 'sad') {
          moodCounts.sad++;
        } else if (entry.mood === 'angry') {
          moodCounts.angry++;
        }
      });
      
      if (moodCounts.happy > moodCounts.sad && moodCounts.happy > moodCounts.angry) {
        return 'bg-orange-100 text-orange-700';
      } else if (moodCounts.sad > moodCounts.happy && moodCounts.sad > moodCounts.angry) {
        return 'bg-gray-100 text-gray-700';
      } else if (moodCounts.angry > moodCounts.happy && moodCounts.angry > moodCounts.sad) {
        return 'bg-red-100 text-red-700';
      } else {
        return 'bg-blue-50 text-blue-700';
      }
    }
    return '';
  };

  const selectedDateEntries = getEntriesForSelectedDate();
  const moodData = getMoodData();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="stats">Stats View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Your Mood Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    withEntry: (date) => {
                      const dateString = date.toISOString().split('T')[0];
                      return daysWithEntries.has(dateString);
                    }
                  }}
                  modifiersClassNames={{
                    withEntry: getDayClass,
                  }}
                />
              </div>
              
              {selectedDateEntries.length > 0 ? (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-lg">Journal Entries for {selectedDate?.toLocaleDateString()}</h3>
                  {selectedDateEntries.map((entry) => (
                    <Card key={entry.id} className="p-4 border-l-4 border-l-blue-400">
                      <p className="text-gray-700">{entry.text}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Heart className={`h-4 w-4 mr-1 ${
                            entry.mood === 'happy' ? 'text-orange-500' :
                            entry.mood === 'sad' ? 'text-gray-500' :
                            entry.mood === 'angry' ? 'text-red-500' : 'text-blue-500'
                          }`} />
                          <span className="capitalize">{entry.mood}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <span>{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="mt-6 text-center py-6 px-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No entries for {selectedDate.toLocaleDateString()}</p>
                  <Button variant="outline" className="mt-4 rounded-full">
                    Add Journal Entry
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Mood Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-md bg-orange-50">
                  <div className="text-xl font-semibold text-orange-600">{moodData[0].count}</div>
                  <div className="text-sm text-gray-600">Happy Days</div>
                </div>
                
                <div className="p-4 rounded-md bg-gray-50">
                  <div className="text-xl font-semibold text-gray-600">{moodData[1].count}</div>
                  <div className="text-sm text-gray-600">Sad Days</div>
                </div>
                
                <div className="p-4 rounded-md bg-red-50">
                  <div className="text-xl font-semibold text-red-600">{moodData[2].count}</div>
                  <div className="text-sm text-gray-600">Angry Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodTracking;
