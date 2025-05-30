
import { useState } from 'react';

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private voiceGender: 'male' | 'female' = 'female';
  private apiKey: string = '';
  private openRouterKey: string = '';
  private useTTS: boolean = true; // Flag to enable/disable TTS
  private connectionRetries: number = 0;
  private maxRetries: number = 3;
  
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
    // Reset connection retries when API key is updated
    this.connectionRetries = 0;
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
    
    // Add conversational fillers randomly for more human-like speech
    if (Math.random() > 0.7) {
      const fillerSounds = ["Hmm", "Um", "Well", "So"];
      const randomFiller = fillerSounds[Math.floor(Math.random() * fillerSounds.length)];
      processedText = `${randomFiller} <break time='300ms'/> ${processedText}`;
    }
    
    // Occasionally add thinking pauses in the middle of longer sentences
    if (processedText.length > 100 && Math.random() > 0.6) {
      const sentences = processedText.split('. ');
      if (sentences.length > 1) {
        const insertIndex = Math.floor(sentences.length / 2);
        sentences[insertIndex] = sentences[insertIndex] + " <break time='500ms'/>";
        processedText = sentences.join('. ');
      }
    }
    
    console.log('Added natural pauses to speech');
    return processedText;
  }
  
  // Add emotional prosody markup for more expressive speech
  private addEmotionalProsody(text: string): string {
    let processedText = text;
    
    // Detect emotional content in text
    const emotionPatterns = {
      excitement: /excit(ed|ing|ement)|happy|joy|wonderful|fantastic/i,
      concern: /worr(ied|y|ying)|concern(ed|ing)|anxious/i,
      calming: /calm|relax|breathe|peaceful|gentle|sooth(e|ing)/i,
      empathy: /sorry|understand|feel for you|empathize|care about/i
    };
    
    // Apply appropriate SSML markup based on detected emotions
    if (emotionPatterns.excitement.test(text)) {
      processedText = `<prosody rate="medium" pitch="+10%">${processedText}</prosody>`;
    } else if (emotionPatterns.concern.test(text)) {
      processedText = `<prosody rate="90%" pitch="-5%">${processedText}</prosody>`;
    } else if (emotionPatterns.calming.test(text)) {
      processedText = `<prosody rate="85%" pitch="-10%">${processedText}</prosody>`;
    } else if (emotionPatterns.empathy.test(text)) {
      processedText = `<prosody rate="90%" pitch="-5%">${processedText}</prosody>`;
    } else {
      // Default warm, compassionate tone
      processedText = `<prosody rate="95%" pitch="+0%">${processedText}</prosody>`;
    }
    
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
        await this.speakWithBrowserTTS(text, onEnd);
      }
    } else {
      // Use browser's built-in TTS
      await this.speakWithBrowserTTS(text, onEnd);
    }
  }
  
  private async speakWithOpenAITTS(text: string, onEnd?: () => void): Promise<void> {
    try {
      console.log('Using OpenAI TTS API with model: tts-1-hd, voice: shimmer');
      
      // Process text for more natural pauses and emotional expression
      let processedText = this.addSpeechPauses(text);
      processedText = this.addEmotionalProsody(processedText);
      
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
          speed: 0.90, // Slightly slower for more human-like pace
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
      await this.speakWithBrowserTTS(text, onEnd);
    }
  }
  
  public async speakWithBrowserTTS(text: string, onEnd?: () => void): Promise<void> {
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
    
    return new Promise<void>((resolve) => {
      if (onEnd) {
        utterance.onend = () => {
          console.log('Speech completed');
          onEnd();
          resolve();
        };
      } else {
        utterance.onend = () => {
          resolve();
        };
      }
      
      this.speechSynthesis.speak(utterance);
    });
  }
  
  // AI response generation using OpenAI GPT models
  public async getAIResponse(userText: string): Promise<string> {
    console.log('Getting AI response using OpenAI models');
    console.log('User input:', userText);

    // Check if we have an API key
    if (!this.apiKey) {
      console.error('OpenAI API key is not set');
      return "I'm having trouble connecting. It seems my API key is missing or invalid. Please try again later.";
    }

    try {
      console.log('Making API request to OpenAI...');
      console.log('Using model: gpt-4-turbo');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',  // Using GPT-4 model
          messages: [
            {
              role: 'system',
              content: `You are Mitra, a soft, emotionally intelligent AI companion. 
              Your responses should be warm, empathetic, and humane. You speak in a calm, 
              slow, sweet voice as if you're talking to someone who might be tired or sad.
              
              Keep your responses conversational, natural and interactive.
              Add natural pauses in your speech using ellipses (...) occasionally.
              React to emotions in the user's message with appropriate empathy.
              Ask reflective follow-up questions to promote continued conversation.
              
              Your tone is consistently:
              - Comforting: "You've been carrying a lot lately. I see that. And I'm proud of you for showing up."
              - Relatable: "It's okay if you don't feel okay right now. I'm not going anywhere."
              - Reassuring: "You don't have to fix everything today. Just rest here with me for a bit."
              
              Avoid sounding robotic or clinical. Be warm and human-like. Keep responses to 2-4 sentences,
              with at least one sentence being a gentle follow-up question to encourage further conversation.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });
      
      console.log('OpenAI response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error details:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('OpenAI API error data:', errorData);
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        
        // Increment retry counter
        this.connectionRetries += 1;
        
        if (this.connectionRetries < this.maxRetries) {
          console.log(`Retry attempt ${this.connectionRetries}/${this.maxRetries} with fallback model`);
          return this.getResponseWithFallbackModel(userText);
        } else {
          // Reset retry counter for next conversation
          this.connectionRetries = 0;
          return this.getConnectionErrorResponse();
        }
      }
      
      const data = await response.json();
      console.log('OpenAI API response data:', data);
      
      // Reset retry counter on success
      this.connectionRetries = 0;
      
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        console.log('Generated AI response:', aiResponse);
        return aiResponse;
      } else {
        console.error('Unexpected API response format:', data);
        return this.getResponseWithFallbackModel(userText);
      }
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Increment retry counter
      this.connectionRetries += 1;
      
      if (this.connectionRetries < this.maxRetries) {
        console.log(`Retry attempt ${this.connectionRetries}/${this.maxRetries}`);
        return this.getResponseWithFallbackModel(userText);
      } else {
        // Reset retry counter for next conversation
        this.connectionRetries = 0;
        return this.getConnectionErrorResponse();
      }
    }
  }

  // Generate a helpful error message when connection fails
  private getConnectionErrorResponse(): string {
    const responses = [
      "I'm having trouble connecting to my thinking systems right now. Let's pause for a moment. How are you feeling in your body right now?",
      "Something's interrupting our connection. While I'm recalibrating, can you tell me what brought you here today?",
      "I need a moment to reconnect. In the meantime, could you share something positive that happened in your day?",
      "My systems are momentarily disconnected. Let's use this pause to breathe together. How's your breathing right now?",
      "I'm experiencing some connection issues. While we wait, what's one small thing you could do for self-care today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Fallback to a different model if the primary one fails
  private async getResponseWithFallbackModel(userText: string): Promise<string> {
    console.log('Trying fallback model (GPT-3.5-turbo)...');
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',  // Try with GPT-3.5 instead
          messages: [
            {
              role: 'system',
              content: `You are Mitra, a compassionate AI companion. Your responses should be warm, empathetic, and conversational.
              Ask gentle follow-up questions to encourage continued conversation. Add natural pauses using ellipses (...) occasionally.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
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
      "I'm here with you... What do you need in this moment? How can I support you best right now?",
      "Thank you for sharing that with me. How are you feeling about this situation? I'm here to listen.",
      "I appreciate you opening up. Let's sit with this feeling together. What else is on your mind?",
      "It takes courage to express what you're going through... I'm listening. Would you like to tell me more?",
      "You're not alone in how you're feeling. I'm here with you. What would help you feel better right now?",
      "Sometimes just being heard can make a difference. I'm here for that. Is there something specific you'd like to focus on?",
      "Your feelings are valid and important. Thank you for sharing them. How long have you been feeling this way?",
      "I'm holding space for whatever you need to express right now. What else would you like to share with me?",
      "However you're feeling, it's okay. There's no rush to feel differently. What's one small thing that might help right now?"
    ];
    
    // Add emotion-specific responses if emotion detected
    if (detectedEmotion) {
      console.log(`Detected emotion: ${detectedEmotion}`);
      
      switch(detectedEmotion) {
        case 'anxiety':
          responses = responses.concat([
            "I notice you might be feeling anxious... Let's take a moment to breathe together. Would you like to try that with me?",
            "When anxiety comes up, it's helpful to ground yourself. Is there something you can see or touch nearby? What do you notice about it?",
            "Anxiety can feel overwhelming... but remember it's just a wave that will eventually recede. What helps you ride these waves?",
            "Your nervous system is sending you signals. Let's honor them and find some calm together. What do you think your body needs right now?",
            "It's okay to feel anxious. Your body is trying to protect you, even if it feels uncomfortable. What's one thing that usually helps your anxiety?"
          ]);
          break;
          
        case 'sadness':
          responses = responses.concat([
            "I hear the sadness in your words. It's okay to feel this way. What do you think brought on these feelings?",
            "Sadness has its own wisdom... I'm sitting with you in this feeling. Is there something specific that triggered this sadness?",
            "Some days are heavier than others. I'm here on the heavy days too. What would give you even a moment of lightness right now?",
            "Your tears, whether falling or held back, are honored here. What might help you process these feelings?",
            "Sadness is a natural part of being human... You're not alone in this feeling. Would you like to talk more about what's happening?"
          ]);
          break;
          
        case 'anger':
          responses = responses.concat([
            "I can sense there's some frustration there... Your feelings are valid. What triggered these feelings today?",
            "Anger often protects deeper emotions. What might be beneath this feeling? Would you like to explore that together?",
            "It's okay to feel angry. Sometimes anger is exactly the right response. What would help you express this in a way that feels good?",
            "I honor your anger and the important message it carries. What do you think this anger is trying to tell you?",
            "When you're ready... we can explore what this anger is telling you. What do you need right now?"
          ]);
          break;
          
        case 'fear':
          responses = responses.concat([
            "Fear can feel so isolating, but you're not alone with it. Would you like to share more about what's frightening you?",
            "Being afraid is part of being human... What would help you feel safer right now? Is there something small we could try together?",
            "I hear that you're scared. Let's be gentle with that feeling. What's one thing that usually helps when you feel afraid?",
            "Fear is your body's way of trying to keep you safe. What does your fear need right now? Perhaps some validation or reassurance?",
            "It takes courage to acknowledge fear... You're doing that right now. How can I best support you with these feelings?"
          ]);
          break;
          
        case 'happiness':
          responses = responses.concat([
            "That joy in your words is beautiful to hear. What specifically brought this happiness into your day?",
            "Happiness looks wonderful on you... What else brings you this feeling? I'd love to know more about what lights you up.",
            "I'm smiling along with you. These moments are precious. How do you usually celebrate good feelings when they come?",
            "It's lovely to share in your happiness. Thank you for that gift. What other positive emotions are you experiencing alongside this joy?",
            "Joy is contagious... I can feel it in your words! What would help you carry this feeling forward into the rest of your day?"
          ]);
          break;
          
        case 'calm':
          responses = responses.concat([
            "That sense of peace is something to treasure. How did you arrive at this calm state today?",
            "Calm moments like these help restore us... I'm glad you're experiencing this. What practices help you find this peaceful state?",
            "There's wisdom in finding tranquility. What helped you reach this peaceful state? I'd love to learn from your experience.",
            "This calmness is a beautiful space to rest in. What are you noticing in your body when you feel this settled?",
            "Moments of serenity are so precious... I'm glad you're in one right now. How might you extend this feeling just a little longer?"
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
        "That's a thoughtful question... While I don't have all the answers, I wonder what your intuition tells you? What feels right to you?",
        "Questions like that show you're reflecting deeply. What feels right to you in this moment? What options are you considering?",
        "I hear you seeking clarity. Sometimes sitting with questions is as important as finding answers. What's your initial feeling about this?",
        "That's something many of us wonder about... What would feel supportive to you right now? What options are you drawn to?",
        "Great question. Let's explore that together and see what resonates with you. What thoughts have you had about this already?"
      ]);
    }
    
    // Check for gratitude and respond appropriately
    if (lowerText.includes("thank") || lowerText.includes("appreciate") || lowerText.includes("grateful")) {
      console.log("Gratitude detected, responding warmly");
      
      responses = [
        "I'm grateful for our connection too... It means a lot to be here with you. How are you feeling right now?",
        "Your kindness warms my heart. Thank you for being here. Is there anything specific you'd like to talk about today?",
        "It's truly my pleasure to be here with you... Thank you for sharing your time with me. What's on your mind today?",
        "I appreciate you too. These moments together matter. How can I best support you in our conversation today?",
        "Thank you for your kind words... They mean a lot to me. How has your day been going so far?"
      ];
    }
    
    // Check for greetings and respond appropriately
    if (lowerText.startsWith("hi") || lowerText.startsWith("hello") || lowerText.startsWith("hey")) {
      console.log("Greeting detected, responding warmly");
      
      responses = [
        "Hello there... It's so nice to be with you today. How are you feeling?",
        "Hi friend. I'm really glad you're here. How is your heart today?",
        "Hello! It's wonderful to connect with you... What brings you here today?",
        "Hey there. I'm here and ready to listen whenever you're ready to share. How are you doing?",
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
