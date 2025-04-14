
import { useState } from 'react';

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private voiceGender: 'male' | 'female' = 'female';
  private apiKey: string = '';
  private openRouterKey: string = '';
  private useTTS: boolean = true; // Flag to enable/disable TTS
  
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
  
  public setVoiceGender(gender: 'male' | 'female'): void {
    this.voiceGender = gender;
    console.log(`Voice gender set to: ${gender}`);
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    console.log('OpenAI API key has been set');
  }
  
  public setOpenRouterKey(key: string): void {
    this.openRouterKey = key;
    console.log('OpenRouter API key has been set');
  }
  
  public setUseTTS(useTTS: boolean): void {
    this.useTTS = useTTS;
    console.log(`Text-to-speech ${useTTS ? 'enabled' : 'disabled'}`);
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
    // Add pauses after punctuation for more natural speech rhythm
    let processedText = text;
    
    // Add pauses after periods
    processedText = processedText.replace(/\.\s+/g, ". <break time='800ms'/> ");
    
    // Add pauses after commas
    processedText = processedText.replace(/,\s+/g, ", <break time='400ms'/> ");
    
    // Add pauses after question marks
    processedText = processedText.replace(/\?\s+/g, "? <break time='700ms'/> ");
    
    // Add pauses after exclamation marks
    processedText = processedText.replace(/!\s+/g, "! <break time='600ms'/> ");
    
    // Add slight pauses for ellipses
    processedText = processedText.replace(/\.\.\./g, "... <break time='500ms'/> ");
    
    // Add filler sounds randomly
    if (Math.random() > 0.7) {
      const fillerSounds = ["Hmm", "Um", "Well"];
      const randomFiller = fillerSounds[Math.floor(Math.random() * fillerSounds.length)];
      processedText = `${randomFiller} <break time='300ms'/> ${processedText}`;
    }
    
    console.log('Added natural pauses to speech');
    return processedText;
  }
  
  public async speak(text: string, onEnd?: () => void): Promise<void> {
    console.log(`Speaking: "${text}"`);
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    if (this.useTTS && this.apiKey) {
      try {
        // Use OpenAI TTS API
        await this.speakWithOpenAITTS(text, onEnd);
      } catch (error) {
        console.error('Error using OpenAI TTS:', error);
        // Fallback to browser TTS if OpenAI fails
        this.speakWithBrowserTTS(text, onEnd);
      }
    } else {
      // Use browser's built-in TTS
      this.speakWithBrowserTTS(text, onEnd);
    }
  }
  
  private async speakWithOpenAITTS(text: string, onEnd?: () => void): Promise<void> {
    try {
      console.log('Using OpenAI TTS API');
      
      // Process text for more natural pauses
      const processedText = this.addSpeechPauses(text);
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          voice: 'shimmer',
          input: processedText,
          speed: 0.85, // Slower, more comforting pace
          response_format: 'mp3',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI TTS API error:', response.status, response.statusText, errorData);
        throw new Error(`OpenAI TTS API error: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        console.log('TTS Audio playback completed');
        URL.revokeObjectURL(audioUrl);
        if (onEnd) onEnd();
      };
      
      audio.onerror = (err) => {
        console.error('TTS Audio playback error:', err);
        URL.revokeObjectURL(audioUrl);
        if (onEnd) onEnd();
      };
      
      await audio.play();
      console.log('TTS Audio playback started');
      
    } catch (error) {
      console.error('Error with OpenAI TTS:', error);
      // Fallback to browser TTS
      this.speakWithBrowserTTS(text, onEnd);
    }
  }
  
  private speakWithBrowserTTS(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.error('Speech synthesis is not supported in this browser');
      if (onEnd) onEnd();
      return;
    }
    
    // Apply natural pauses and fillers to make speech more human-like
    const processedText = this.addSpeechPauses(text);
    const utterance = new SpeechSynthesisUtterance(processedText);
    
    // Select the best voice based on gender preference
    const voices = this.speechSynthesis.getVoices();
    let preferredVoice = null;
    
    // Log available voices for debugging
    console.log(`Available voices: ${voices.length}`);
    voices.forEach((voice, index) => {
      console.log(`Voice ${index}: ${voice.name} (${voice.lang})`);
    });
    
    // Look for best female voice by default
    console.log(`Looking for best ${this.voiceGender} voice...`);
    if (this.voiceGender === 'female') {
      preferredVoice = voices.find(voice => 
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Female') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Google UK English Female')
      );
    } else {
      preferredVoice = voices.find(voice => 
        voice.name.includes('Daniel') ||
        voice.name.includes('David') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Google UK English Male')
      );
    }
    
    // If no preferred voice found, use any available voice
    if (!preferredVoice && voices.length > 0) {
      preferredVoice = voices[0];
    }
    
    // Use soft, gentle voice settings
    utterance.rate = 0.85;  // Slightly slower for more empathetic tone
    utterance.pitch = this.voiceGender === 'female' ? 1.05 : 0.95; // Adjust pitch based on gender
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
      utterance.rate -= 0.08; // Speak even slower for calming content
    }
    
    if (onEnd) {
      utterance.onend = () => {
        console.log('Speech completed');
        onEnd();
      };
    }
    
    this.speechSynthesis.speak(utterance);
  }
  
  // AI response generation using OpenRouter API
  public async getAIResponse(userText: string): Promise<string> {
    console.log('Getting AI response from OpenRouter');
    console.log('User input:', userText);

    // Check if we have an OpenRouter API key
    if (!this.openRouterKey) {
      console.error('OpenRouter API key is not set');
      return "I'm having trouble connecting. It seems my API key is missing or invalid. Please try again later.";
    }

    try {
      // Add more verbose logging
      console.log('Making API request to OpenRouter...');
      console.log('Using model: google/gemini-pro');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Mitra AI Companion'
        },
        body: JSON.stringify({
          model: 'google/gemini-pro',  // Using Gemini Pro model
          messages: [
            {
              role: 'system',
              content: `You are Mitra, a soft, emotionally intelligent AI companion. 
              Your responses should be warm, empathetic, and humane. You speak in a calm, 
              slow, sweet voice as if you're talking to someone who might be tired or sad.
              
              Keep your responses short (2-3 sentences max) and conversational.
              Add natural pauses in your speech using ellipses (...) occasionally.
              React to emotions in the user's message with appropriate empathy.
              
              Your tone is consistently:
              - Comforting: "You've been carrying a lot lately. I see that. And I'm proud of you for showing up."
              - Relatable: "It's okay if you don't feel okay right now. I'm not going anywhere."
              - Reassuring: "You don't have to fix everything today. Just rest here with me for a bit."
              
              Avoid sounding robotic or clinical. Be warm and human-like.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
          temperature: 0.8,
          max_tokens: 150,
        }),
      });
      
      console.log('OpenRouter response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error details:', errorText);
        
        // Try to parse the error text as JSON
        try {
          const errorData = JSON.parse(errorText);
          console.error('OpenRouter API error data:', errorData);
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        
        // Try with fallback model if the primary model fails
        return this.getResponseWithFallbackModel(userText);
      }
      
      const data = await response.json();
      console.log('OpenRouter API response data:', data);
      
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        console.log('Generated AI response:', aiResponse);
        return aiResponse;
      } else {
        console.error('Unexpected API response format:', data);
        return this.getResponseWithFallbackModel(userText);
      }
      
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      return this.getResponseWithFallbackModel(userText);
    }
  }

  // Fallback to a different model if the primary one fails
  private async getResponseWithFallbackModel(userText: string): Promise<string> {
    console.log('Trying fallback model (Claude-3-Haiku)...');
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Mitra AI Companion'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',  // Try with Claude instead
          messages: [
            {
              role: 'system',
              content: `You are Mitra, a compassionate AI companion. Keep responses very brief (1-2 sentences), warm and empathetic.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });
      
      if (!response.ok) {
        console.error('Fallback model also failed:', response.status);
        return this.getLocalFallbackResponse(userText);
      }
      
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        return this.getLocalFallbackResponse(userText);
      }
    } catch (error) {
      console.error('Error with fallback model:', error);
      return this.getLocalFallbackResponse(userText);
    }
  }

  // Local fallback response generation when API is not available
  private getLocalFallbackResponse(userText: string): string {
    console.log('Using local fallback response generation');
    
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
      "I'm here with you... What do you need in this moment?",
      "Thank you for sharing that with me. How can I support you right now?",
      "I appreciate you opening up. Let's sit with this feeling together.",
      "It takes courage to express what you're going through... I'm listening.",
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
            "I notice you might be feeling anxious... Let's take a moment to breathe together.",
            "When anxiety comes up, it's helpful to ground yourself. Is there something you can see or touch nearby?",
            "Anxiety can feel overwhelming... but remember it's just a wave that will eventually recede.",
            "Your nervous system is sending you signals. Let's honor them and find some calm together.",
            "It's okay to feel anxious. Your body is trying to protect you, even if it feels uncomfortable."
          ]);
          break;
          
        case 'sadness':
          responses = responses.concat([
            "I hear the sadness in your words. It's okay to feel this way.",
            "Sadness has its own wisdom... I'm sitting with you in this feeling.",
            "Some days are heavier than others. I'm here on the heavy days too.",
            "Your tears, whether falling or held back, are honored here.",
            "Sadness is a natural part of being human... You're not alone in this feeling."
          ]);
          break;
          
        case 'anger':
          responses = responses.concat([
            "I can sense there's some frustration there... Your feelings are valid.",
            "Anger often protects deeper emotions. What might be beneath this feeling?",
            "It's okay to feel angry. Sometimes anger is exactly the right response.",
            "I honor your anger and the important message it carries.",
            "When you're ready... we can explore what this anger is telling you."
          ]);
          break;
          
        case 'fear':
          responses = responses.concat([
            "Fear can feel so isolating, but you're not alone with it.",
            "Being afraid is part of being human... What would help you feel safer right now?",
            "I hear that you're scared. Let's be gentle with that feeling.",
            "Fear is your body's way of trying to keep you safe. What does your fear need right now?",
            "It takes courage to acknowledge fear... You're doing that right now."
          ]);
          break;
          
        case 'happiness':
          responses = responses.concat([
            "That joy in your words is beautiful to hear.",
            "Happiness looks wonderful on you... What else brings you this feeling?",
            "I'm smiling along with you. These moments are precious.",
            "It's lovely to share in your happiness. Thank you for that gift.",
            "Joy is contagious... I can feel it in your words!"
          ]);
          break;
          
        case 'calm':
          responses = responses.concat([
            "That sense of peace is something to treasure.",
            "Calm moments like these help restore us... I'm glad you're experiencing this.",
            "There's wisdom in finding tranquility. What helped you reach this peaceful state?",
            "This calmness is a beautiful space to rest in.",
            "Moments of serenity are so precious... I'm glad you're in one right now."
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
        "That's a thoughtful question... While I don't have all the answers, I wonder what your intuition tells you?",
        "Questions like that show you're reflecting deeply. What feels right to you in this moment?",
        "I hear you seeking clarity. Sometimes sitting with questions is as important as finding answers.",
        "That's something many of us wonder about... What would feel supportive to you right now?",
        "Great question. Let's explore that together and see what resonates with you."
      ]);
    }
    
    // Check for gratitude and respond appropriately
    if (lowerText.includes("thank") || lowerText.includes("appreciate") || lowerText.includes("grateful")) {
      console.log("Gratitude detected, responding warmly");
      
      responses = [
        "I'm grateful for our connection too... It means a lot to be here with you.",
        "Your kindness warms my heart. Thank you for being here.",
        "It's truly my pleasure to be here with you... Thank you for sharing your time with me.",
        "I appreciate you too. These moments together matter.",
        "Thank you for your kind words... They mean a lot to me."
      ];
    }
    
    // Check for greetings and respond appropriately
    if (lowerText.startsWith("hi") || lowerText.startsWith("hello") || lowerText.startsWith("hey")) {
      console.log("Greeting detected, responding warmly");
      
      responses = [
        "Hello there... It's so nice to be with you today. How are you feeling?",
        "Hi friend. I'm really glad you're here. How is your heart today?",
        "Hello! It's wonderful to connect with you... What brings you here today?",
        "Hey there. I'm here and ready to listen whenever you're ready to share.",
        "Hi! Your presence brightens my day... How are you feeling right now?"
      ];
    }
    
    // Select a response
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('Generated local AI response:', response);
    
    return response;
  }
}

export default new SpeechProcessor();
