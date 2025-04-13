import { useState } from 'react';

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private currentAIModel: string = 'coach'; // Default AI model
  
  constructor() {
    // Check if browser supports Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore: webkitSpeechRecognition is not recognized by TypeScript
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
    
    this.speechSynthesis = window.speechSynthesis;
    
    // Get the saved model from localStorage if available
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
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
    
    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      if (event.results[last].isFinal) {
        onFinalResult(text);
      } else {
        onInterimResult(text);
      }
    };
    
    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition?.start();
      }
    };
    
    this.recognition.start();
  }
  
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }
  
  // Set the current AI model
  public setAIModel(model: string): void {
    this.currentAIModel = model;
  }
  
  // Get the current AI model
  public getAIModel(): string {
    return this.currentAIModel;
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
    
    return processedText;
  }
  
  public speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Check current AI model from localStorage again in case it changed
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
    }
    
    // Select a voice based on the AI model
    const voices = this.speechSynthesis.getVoices();
    let preferredVoice = null;
    
    switch(this.currentAIModel) {
      case 'coach':
        // Find a male authoritative but friendly voice
        preferredVoice = voices.find(voice => 
          voice.name.includes('Male') || voice.name.includes('Google UK English Male')
        );
        utterance.rate = 0.95; // Slightly slower for coaching clarity
        utterance.pitch = 1.0;
        break;
        
      case 'cryBuddy':
        // Find a softer, more empathetic voice
        preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || voice.name.includes('Samantha')
        );
        utterance.rate = 0.85; // Slower for empathy
        utterance.pitch = 1.1; // Slightly higher for warmth
        break;
        
      case 'mindReader':
        // Find a neutral, analytical voice
        preferredVoice = voices.find(voice => 
          voice.name.includes('Google US English') || voice.name.includes('Daniel')
        );
        utterance.rate = 0.9;
        utterance.pitch = 0.95; // Slightly deeper for thoughtfulness
        break;
        
      default:
        // Default voice
        preferredVoice = voices.find(voice => 
          voice.name.includes('Google US English') || voice.name.includes('Daniel')
        );
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Adjust parameters based on text content for more natural delivery
    if (text.includes('!') || text.toLowerCase().includes('urgent') || text.toLowerCase().includes('immediately')) {
      utterance.rate += 0.15; // Speak faster for urgent content
    }
    
    if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('relax') || text.toLowerCase().includes('breathe')) {
      utterance.rate -= 0.15; // Speak slower for calming content
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
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
  
  // Simple function to simulate AI response based on the selected model
  // In a real application, this would call an AI service API
  public async getAIResponse(userText: string): Promise<string> {
    console.log('Current AI Model:', this.currentAIModel);
    console.log('User Input:', userText);
    
    // Check current AI model from localStorage again in case it changed
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
    }
    
    let responses: string[] = [];
    
    switch(this.currentAIModel) {
      case 'coach':
        console.log('Coach model selected');
        responses = [
          "Let's take a strategic approach to managing this situation.",
          "I notice tension. Let's break this down into actionable steps.",
          "What specific strategy can help you move forward right now?",
          "Let's identify one concrete action you can take today.",
          "Remember, progress is made through consistent, small steps."
        ];
        break;
        
      case 'cryBuddy':
        console.log('Cry-Buddy model selected');
        responses = [
          "I hear how deeply this is affecting you. Your feelings are completely valid.",
          "That sounds incredibly overwhelming. I'm here to listen without judgment.",
          "It's okay to feel everything you're feeling right now.",
          "This must be so difficult. Thank you for sharing your vulnerability.",
          "Some moments are just hard. And that's okay."
        ];
        break;
        
      case 'mindReader':
        console.log('Mind-Reader model selected');
        responses = [
          "I notice the underlying tension in your words. What's really going on?",
          "Your language suggests there's more beneath the surface. Want to explore that?",
          "I'm sensing some unspoken emotions. Would you like to unpack them?",
          "The way you described that reveals a lot about what you might be experiencing.",
          "There seems to be a disconnect between what you're saying and what you're feeling."
        ];
        break;
    }
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('Generated Response:', response);
    
    return response;
  }
}

export default new SpeechProcessor();
