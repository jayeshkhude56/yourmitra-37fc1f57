import { useState } from 'react';

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private currentAIModel: string = 'coach'; // Default AI model
  private voiceGender: 'male' | 'female' = 'male'; // Default voice gender
  
  constructor() {
    // Check if browser supports Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore: webkitSpeechRecognition is not recognized by TypeScript
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      console.log('Speech recognition initialized successfully');
    } else {
      console.warn('Speech recognition is not supported in this browser');
    }
    
    this.speechSynthesis = window.speechSynthesis;
    
    // Get the saved model from localStorage if available
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
      console.log(`Loaded AI model from localStorage: ${savedModel}`);
    } else {
      console.log(`Using default AI model: ${this.currentAIModel}`);
    }
    
    // Get the saved voice gender from localStorage if available
    const savedGender = localStorage.getItem('mitra-voice-gender');
    if (savedGender && (savedGender === 'male' || savedGender === 'female')) {
      this.voiceGender = savedGender;
      console.log(`Loaded voice gender from localStorage: ${savedGender}`);
    } else {
      console.log(`Using default voice gender: ${this.voiceGender}`);
    }
  }
  
  public startListening(onInterimResult: (text: string) => void, onFinalResult: (text: string) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }
    
    if (this.isListening) {
      this.stopListening();
    }
    
    this.isListening = true;
    console.log('Started listening for speech input');
    
    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      if (event.results[last].isFinal) {
        console.log(`Final speech result: "${text}"`);
        onFinalResult(text);
      } else {
        console.log(`Interim speech result: "${text}"`);
        onInterimResult(text);
      }
    };
    
    this.recognition.onend = () => {
      console.log('Speech recognition ended, restarting if still listening');
      if (this.isListening) {
        this.recognition?.start();
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    this.recognition.start();
  }
  
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      console.log('Stopped listening for speech input');
      this.recognition.stop();
    }
  }
  
  // Set the current AI model
  public setAIModel(model: string): void {
    this.currentAIModel = model;
    console.log(`AI model set to: ${model}`);
  }
  
  // Get the current AI model
  public getAIModel(): string {
    return this.currentAIModel;
  }
  
  // Set the voice gender
  public setVoiceGender(gender: 'male' | 'female'): void {
    this.voiceGender = gender;
    localStorage.setItem('mitra-voice-gender', gender);
    console.log(`Voice gender set to: ${gender}`);
  }
  
  // Get the current voice gender
  public getVoiceGender(): string {
    return this.voiceGender;
  }
  
  // Add natural pauses to speech for more human-like delivery
  private addSpeechPauses(text: string): string {
    // Add commas for slight pauses
    let processedText = text.replace(/(\.\s+)([A-Z])/g, "$1, $2");
    
    // Add SSML pauses for more natural speech rhythm
    processedText = processedText.replace(/\./g, ".<break time='0.7s'/>");
    processedText = processedText.replace(/,/g, ",<break time='0.3s'/>");
    processedText = processedText.replace(/\?/g, "?<break time='0.7s'/>");
    processedText = processedText.replace(/!/g, "!<break time='0.5s'/>");
    
    console.log('Added natural pauses to speech');
    return processedText;
  }
  
  public speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }
    
    console.log(`Speaking with ${this.currentAIModel} personality using ${this.voiceGender} voice: "${text}"`);
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Check current AI model from localStorage again in case it changed
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
      console.log(`Updated AI model from localStorage: ${savedModel}`);
    }
    
    // Check current voice gender from localStorage again in case it changed
    const savedGender = localStorage.getItem('mitra-voice-gender');
    if (savedGender && (savedGender === 'male' || savedGender === 'female')) {
      this.voiceGender = savedGender as 'male' | 'female';
      console.log(`Updated voice gender from localStorage: ${savedGender}`);
    }
    
    // Select a voice based on the AI model and gender
    const voices = this.speechSynthesis.getVoices();
    let preferredVoice = null;
    
    // Log available voices for debugging
    console.log(`Available voices: ${voices.length}`);
    voices.forEach((voice, index) => {
      console.log(`Voice ${index}: ${voice.name} (${voice.lang})`);
    });
    
    // First priority: find a voice matching both model and gender
    if (this.voiceGender === 'female') {
      console.log('Looking for female voice...');
      preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen')
      );
    } else {
      console.log('Looking for male voice...');
      preferredVoice = voices.find(voice => 
        voice.name.includes('Male') || 
        voice.name.includes('Daniel') || 
        voice.name.includes('Google UK English Male') ||
        voice.name.includes('David')
      );
    }
    
    // Apply personality-specific settings
    switch(this.currentAIModel) {
      case 'coach':
        utterance.rate = this.voiceGender === 'female' ? 0.97 : 0.95;
        utterance.pitch = this.voiceGender === 'female' ? 1.05 : 1.0;
        console.log(`Using coach voice profile with ${this.voiceGender} voice - authoritative but friendly`);
        break;
        
      case 'cryBuddy':
        utterance.rate = this.voiceGender === 'female' ? 0.83 : 0.85;
        utterance.pitch = this.voiceGender === 'female' ? 1.2 : 1.1;
        console.log(`Using cry-buddy voice profile with ${this.voiceGender} voice - soft and empathetic`);
        break;
        
      case 'mindReader':
        utterance.rate = this.voiceGender === 'female' ? 0.88 : 0.9;
        utterance.pitch = this.voiceGender === 'female' ? 1.0 : 0.95;
        console.log(`Using mind-reader voice profile with ${this.voiceGender} voice - neutral and analytical`);
        break;
        
      default:
        utterance.rate = 0.9;
        utterance.pitch = this.voiceGender === 'female' ? 1.05 : 1.0;
        console.log(`Using default voice profile with ${this.voiceGender} voice`);
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(`Selected ${this.voiceGender} voice: ${preferredVoice.name}`);
    } else {
      console.warn(`No matching ${this.voiceGender} voice found, using default browser voice`);
    }
    
    // Adjust parameters based on text content for more natural delivery
    if (text.includes('!') || text.toLowerCase().includes('urgent') || text.toLowerCase().includes('immediately')) {
      utterance.rate += 0.15; // Speak faster for urgent content
      console.log('Detected urgent content, increasing speech rate');
    }
    
    if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('relax') || text.toLowerCase().includes('breathe')) {
      utterance.rate -= 0.15; // Speak slower for calming content
      console.log('Detected calming content, decreasing speech rate');
    }
    
    if (onEnd) {
      utterance.onend = () => {
        console.log('Speech completed');
        onEnd();
      };
    }
    
    // Add natural pauses by inserting commas and pauses in the text
    const processedText = text
      .replace(/\. /g, ". <break time='500ms'/>")
      .replace(/\? /g, "? <break time='600ms'/>")
      .replace(/! /g, "! <break time='500ms'/>")
      .replace(/, /g, ", <break time='300ms'/>");
      
    utterance.text = processedText;
    
    this.speechSynthesis.speak(utterance);
  }
  
  // AI response generation based on the selected model
  public async getAIResponse(userText: string): Promise<string> {
    console.log('Getting AI response for model:', this.currentAIModel);
    console.log('User input:', userText);
    
    // Check current AI model from localStorage again in case it changed
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
      console.log('Updated model from localStorage:', savedModel);
    }
    
    let responses: string[] = [];
    
    switch(this.currentAIModel) {
      case 'coach':
        console.log('Generating coach-style response');
        responses = [
          "Let's take a strategic approach to managing this situation.",
          "I notice tension. Let's break this down into actionable steps.",
          "What specific strategy can help you move forward right now?",
          "Let's identify one concrete action you can take today.",
          "Remember, progress is made through consistent, small steps.",
          "I hear you. What would be a small, achievable goal to focus on first?",
          "Let's practice a breathing exercise together to create some mental space.",
          "What resources do you have available that could help with this challenge?",
          "Focus on what you can control, and let's make a plan for that."
        ];
        break;
        
      case 'cryBuddy':
        console.log('Generating cry-buddy style response');
        responses = [
          "I hear how deeply this is affecting you. Your feelings are completely valid.",
          "That sounds incredibly overwhelming. I'm here to listen without judgment.",
          "It's okay to feel everything you're feeling right now.",
          "This must be so difficult. Thank you for sharing your vulnerability.",
          "Some moments are just hard. And that's okay.",
          "I'm right here with you through all of these emotions.",
          "Sometimes we just need space to feel, and that's perfectly alright.",
          "Your feelings matter, and I'm here to hold space for all of them.",
          "It's brave of you to acknowledge these difficult emotions."
        ];
        break;
        
      case 'mindReader':
        console.log('Generating mind-reader style response');
        responses = [
          "I notice the underlying tension in your words. What's really going on?",
          "Your language suggests there's more beneath the surface. Want to explore that?",
          "I'm sensing some unspoken emotions. Would you like to unpack them?",
          "The way you described that reveals a lot about what you might be experiencing.",
          "There seems to be a disconnect between what you're saying and what you're feeling.",
          "I'm noticing a pattern in how you approach these situations. Are you aware of it?",
          "Your choice of words indicates some hesitation. Let's examine that together.",
          "The emotion behind your words seems stronger than what you're directly expressing.",
          "What remains unsaid may be the most important part of what you're sharing."
        ];
        break;
    }
    
    // Select a response based on keywords in user input for more relevance
    let bestResponse = null;
    const keywords = {
      anxiety: ["anxious", "nervous", "worry", "stress", "panic", "overwhelm"],
      sadness: ["sad", "depressed", "unhappy", "down", "blue", "miserable", "grief"],
      anger: ["angry", "frustrated", "mad", "irritated", "annoyed", "upset"],
      fear: ["afraid", "scared", "fearful", "terrified", "dread", "worry"],
      work: ["job", "career", "work", "boss", "colleague", "project", "deadline"],
      relationships: ["friend", "partner", "family", "husband", "wife", "parent", "child"]
    };
    
    // Check if any keywords are in the user text
    let matchedCategory = null;
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => userText.toLowerCase().includes(word))) {
        matchedCategory = category;
        break;
      }
    }
    
    // If we matched a category, try to find a response that matches
    if (matchedCategory) {
      console.log(`Matched keyword category: ${matchedCategory}`);
      
      // Add more specific responses based on the matched category
      switch(this.currentAIModel) {
        case 'coach':
          if (matchedCategory === 'anxiety') {
            responses.push("Let's try a quick breathing exercise to reduce that anxiety.");
            responses.push("When anxious thoughts arise, notice them without judgment.");
          } else if (matchedCategory === 'work') {
            responses.push("What's one small task you can complete to make progress on this work challenge?");
            responses.push("Work stress often comes from unclear boundaries. Where might you need stronger boundaries?");
          }
          break;
          
        case 'cryBuddy':
          if (matchedCategory === 'sadness') {
            responses.push("That sadness you're feeling is so valid. It's okay to sit with it for a while.");
            responses.push("I hear the deep sadness in your words. I'm here with you in this moment.");
          } else if (matchedCategory === 'relationships') {
            responses.push("Relationships can bring up such complex feelings. All of those emotions deserve space.");
            responses.push("The connections we have with others can be so meaningful, and also so painful sometimes.");
          }
          break;
          
        case 'mindReader':
          if (matchedCategory === 'anger') {
            responses.push("I notice there's anger in your words. What's underneath that emotion?");
            responses.push("That frustration might be pointing to something important that needs your attention.");
          } else if (matchedCategory === 'fear') {
            responses.push("Fear often speaks to what we value most. What are you afraid of losing?");
            responses.push("I'm hearing some fear in your voice. Let's explore what's behind that.");
          }
          break;
      }
    }
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('Generated AI response:', response);
    
    return response;
  }
}

export default new SpeechProcessor();
