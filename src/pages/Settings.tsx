
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMood } from '@/contexts/MoodContext';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  
  const { ambientSound, setAmbientSound } = useMood();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="py-4 px-6 flex justify-between items-center">
        <Link to="/landing">
          <Button variant="ghost" className="rounded-full">
            <Home className="h-5 w-5 mr-2" /> Home
          </Button>
        </Link>
        
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h1>
        
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 rounded-xl">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 rounded-xl">
            <CardHeader>
              <CardTitle>Sound & Voice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  <Label htmlFor="voice-responses">Voice Responses</Label>
                </div>
                <Switch 
                  id="voice-responses" 
                  checked={voiceEnabled} 
                  onCheckedChange={setVoiceEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="ambient-sound">Ambient Sounds</Label>
                </div>
                <Switch 
                  id="ambient-sound" 
                  checked={ambientSound !== 'none'} 
                  onCheckedChange={(checked) => setAmbientSound(checked ? 'rain' : 'none')} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 rounded-xl">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="data-collection" className="mb-1">Anonymous Data Collection</Label>
                  <p className="text-sm text-gray-500">Help us improve Mitra by sharing anonymous usage data</p>
                </div>
                <Switch 
                  id="data-collection" 
                  checked={dataCollection} 
                  onCheckedChange={setDataCollection} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="notifications" className="mb-1">Notifications</Label>
                  <p className="text-sm text-gray-500">Receive check-in reminders and updates</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled} 
                />
              </div>
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

export default Settings;
