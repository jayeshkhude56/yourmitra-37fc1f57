
// This is a simplified version of a speech processing service
// In a real application, you would integrate with a proper speech-to-text and text-to-speech API

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
  
  public speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a voice (ideally one that sounds calm and soothing)
    const voices = this.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for a calming effect
    utterance.pitch = 1.0;
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    this.speechSynthesis.speak(utterance);
  }
  
  // Simple function to simulate AI response
  // In a real application, this would call an AI service API
  public async getAIResponse(userText: string): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Predefined calming responses
    const responses = [
      "I understand how you feel. Would you like to tell me more about it?",
      "That sounds challenging. I'm here to listen whenever you need me.",
      "I appreciate you sharing that with me. How does it make you feel?",
      "It's completely normal to feel that way. Would you like to explore why you might be feeling this?",
      "Thank you for trusting me with your thoughts. Is there anything specific about this situation that's troubling you?",
      "I'm here for you. Let's take a deep breath together and continue when you're ready.",
      "Your feelings are valid. Would it help to talk more about what's on your mind?",
      "I'm listening. Please feel free to express yourself however you need to."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export default new SpeechProcessor();
