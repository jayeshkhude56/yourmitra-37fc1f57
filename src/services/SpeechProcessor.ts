
import { useState } from 'react';

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  
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
    
    console.log(`Speaking: "${text}"`);
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select the best female voice
    const voices = this.speechSynthesis.getVoices();
    let preferredVoice = null;
    
    // Log available voices for debugging
    console.log(`Available voices: ${voices.length}`);
    voices.forEach((voice, index) => {
      console.log(`Voice ${index}: ${voice.name} (${voice.lang})`);
    });
    
    // Look for best female voice
    console.log('Looking for best female voice...');
    preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Female') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Google UK English Female')
    );
    
    // If no female voice found, use any available voice
    if (!preferredVoice && voices.length > 0) {
      preferredVoice = voices[0];
    }
    
    // Use soft, gentle voice settings
    utterance.rate = 0.9;  // Slightly slower
    utterance.pitch = 1.05; // Slightly higher pitch for female voice
    utterance.volume = 1.0; // Full volume
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(`Selected voice: ${preferredVoice.name}`);
    } else {
      console.warn('No preferred voice found, using default browser voice');
    }
    
    // Adjust parameters based on text content for more natural delivery
    if (text.includes('!') || text.toLowerCase().includes('urgent') || text.toLowerCase().includes('immediately')) {
      utterance.rate += 0.05; // Speak slightly faster for urgent content
    }
    
    if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('relax') || text.toLowerCase().includes('breathe')) {
      utterance.rate -= 0.05; // Speak slightly slower for calming content
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
  
  // AI response generation based on emotional intelligence
  public async getAIResponse(userText: string): Promise<string> {
    console.log('Getting AI response');
    console.log('User input:', userText);
    
    // Detect emotional tone in user's text
    const emotionKeywords = {
      anxiety: ["anxious", "nervous", "worry", "stress", "panic", "overwhelm"],
      sadness: ["sad", "depressed", "unhappy", "down", "blue", "miserable", "grief"],
      anger: ["angry", "frustrated", "mad", "irritated", "annoyed", "upset"],
      fear: ["afraid", "scared", "fearful", "terrified", "dread", "worry"],
      happiness: ["happy", "joy", "excited", "glad", "pleased", "content"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "quiet"]
    };
    
    // Check if any emotional keywords are present
    let detectedEmotion = null;
    const lowerText = userText.toLowerCase();
    
    for (const [emotion, words] of Object.entries(emotionKeywords)) {
      if (words.some(word => lowerText.includes(word))) {
        detectedEmotion = emotion;
        break;
      }
    }
    
    // Base responses collection - warm, compassionate, and emotionally intelligent
    let responses = [
      "I'm here with you. What do you need in this moment?",
      "Thank you for sharing that with me. How can I support you right now?",
      "I appreciate you opening up. Let's sit with this feeling together.",
      "It takes courage to express what you're going through. I'm listening.",
      "You're not alone in how you're feeling. I'm here with you.",
      "Sometimes just being heard can make a difference. I'm here for that.",
      "Your feelings are valid and important. Thank you for sharing them.",
      "I'm holding space for whatever you need to express right now.",
      "However you're feeling, it's okay. There's no rush to feel differently."
    ];
    
    // Add emotion-specific responses if emotion detected
    if (detectedEmotion) {
      console.log(`Detected emotion: ${detectedEmotion}`);
      
      switch(detectedEmotion) {
        case 'anxiety':
          responses = responses.concat([
            "I notice you might be feeling anxious. Let's take a moment to breathe together.",
            "When anxiety comes up, it's helpful to ground yourself. Is there something you can see or touch nearby?",
            "Anxiety can feel overwhelming, but remember it's just a wave that will eventually recede.",
            "Your nervous system is sending you signals. Let's honor them and find some calm together.",
            "It's okay to feel anxious. Your body is trying to protect you, even if it feels uncomfortable."
          ]);
          break;
          
        case 'sadness':
          responses = responses.concat([
            "I hear the sadness in your words. It's okay to feel this way.",
            "Sadness has its own wisdom. I'm sitting with you in this feeling.",
            "Some days are heavier than others. I'm here on the heavy days too.",
            "Your tears, whether falling or held back, are honored here.",
            "Sadness is a natural part of being human. You're not alone in this feeling."
          ]);
          break;
          
        case 'anger':
          responses = responses.concat([
            "I can sense there's some frustration there. Your feelings are valid.",
            "Anger often protects deeper emotions. What might be beneath this feeling?",
            "It's okay to feel angry. Sometimes anger is exactly the right response.",
            "I honor your anger and the important message it carries.",
            "When you're ready, we can explore what this anger is telling you."
          ]);
          break;
          
        case 'fear':
          responses = responses.concat([
            "Fear can feel so isolating, but you're not alone with it.",
            "Being afraid is part of being human. What would help you feel safer right now?",
            "I hear that you're scared. Let's be gentle with that feeling.",
            "Fear is your body's way of trying to keep you safe. What does your fear need right now?",
            "It takes courage to acknowledge fear. You're doing that right now."
          ]);
          break;
          
        case 'happiness':
          responses = responses.concat([
            "That joy in your words is beautiful to hear.",
            "Happiness looks wonderful on you. What else brings you this feeling?",
            "I'm smiling along with you. These moments are precious.",
            "It's lovely to share in your happiness. Thank you for that gift.",
            "Joy is contagious - I can feel it in your words!"
          ]);
          break;
          
        case 'calm':
          responses = responses.concat([
            "That sense of peace is something to treasure.",
            "Calm moments like these help restore us. I'm glad you're experiencing this.",
            "There's wisdom in finding tranquility. What helped you reach this peaceful state?",
            "This calmness is a beautiful space to rest in.",
            "Moments of serenity are so precious. I'm glad you're in one right now."
          ]);
          break;
      }
    }
    
    // Look for questions that need answers
    if (userText.includes("?") || 
        lowerText.includes("how do i") || 
        lowerText.includes("what should") || 
        lowerText.includes("can you help")) {
      
      console.log("Question detected, providing helpful response");
      
      // Add helpful responses for questions
      responses = responses.concat([
        "That's a thoughtful question. While I don't have all the answers, I wonder what your intuition tells you?",
        "Questions like that show you're reflecting deeply. What feels right to you in this moment?",
        "I hear you seeking clarity. Sometimes sitting with questions is as important as finding answers.",
        "That's something many of us wonder about. What would feel supportive to you right now?",
        "Great question. Let's explore that together and see what resonates with you."
      ]);
    }
    
    // Check for gratitude and respond appropriately
    if (lowerText.includes("thank") || lowerText.includes("appreciate") || lowerText.includes("grateful")) {
      console.log("Gratitude detected, responding warmly");
      
      responses = [
        "I'm grateful for our connection too. It means a lot to be here with you.",
        "Your kindness warms my heart. Thank you for being here.",
        "It's truly my pleasure to be here with you. Thank you for sharing your time with me.",
        "I appreciate you too. These moments together matter.",
        "Thank you for your kind words. They mean a lot to me."
      ];
    }
    
    // Check for greetings and respond appropriately
    if (lowerText.startsWith("hi") || lowerText.startsWith("hello") || lowerText.startsWith("hey")) {
      console.log("Greeting detected, responding warmly");
      
      responses = [
        "Hello there. It's so nice to be with you today. How are you feeling?",
        "Hi friend. I'm really glad you're here. How is your heart today?",
        "Hello! It's wonderful to connect with you. What brings you here today?",
        "Hey there. I'm here and ready to listen whenever you're ready to share.",
        "Hi! Your presence brightens my day. How are you feeling right now?"
      ];
    }
    
    // Select a response
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('Generated AI response:', response);
    
    return response;
  }
}

export default new SpeechProcessor();
