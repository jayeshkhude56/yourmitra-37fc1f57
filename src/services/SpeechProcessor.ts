
// This is a simplified version of a speech processing service
// In a real application, you would integrate with a proper speech-to-text and text-to-speech API

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
    // Check current AI model from localStorage again in case it changed
    const savedModel = localStorage.getItem('mitra-selected-model');
    if (savedModel) {
      this.currentAIModel = savedModel;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let responses: string[] = [];
    
    // Select responses based on the current AI model
    switch(this.currentAIModel) {
      case 'coach':
        responses = [
          "Let's take a deep breath together. Inhale for 4 counts, hold for 4, then exhale for 6. How did that feel?",
          "I notice tension in your voice. Let's try a quick grounding exercise. Name 5 things you can see around you right now.",
          "When you feel this way, it can help to focus on what's within your control. Shall we make a quick list together?",
          "That's a challenging situation. Let's break down one specific action you can take today to address this.",
          "Your body responds to stress before your mind recognizes it. Notice how you're sitting right now - can you relax your shoulders?",
          "You've handled difficult situations before. What strategy worked well for you last time?",
          "Let's imagine the best possible outcome. What would that look like for you?",
          "Consider scheduling a small break in your day - even 5 minutes of mindfulness can reset your stress levels."
        ];
        break;
        
      case 'cryBuddy':
        responses = [
          "I hear how painful this is for you. It's okay to feel overwhelmed by all of this.",
          "That sounds incredibly frustrating. I'm here listening to everything you're saying.",
          "I'm so sorry you're going through this. It's a lot to handle and your feelings are completely valid.",
          "This must feel so heavy to carry. You don't have to face it alone - I'm right here with you.",
          "Sometimes life is just really hard, isn't it? It's okay to not be okay right now.",
          "I can hear how much this matters to you. It's okay to be upset when something important is affected.",
          "That's heartbreaking. Take all the time you need to express how you feel about this.",
          "I'm sitting with you in this difficult moment. There's no rush to move past these feelings."
        ];
        break;
        
      case 'mindReader':
        responses = [
          "I notice you're speaking quickly. It seems like there's some anxiety behind what you're sharing.",
          "The words you're choosing suggest you might be feeling unappreciated. Is that what's happening?",
          "You've mentioned feeling 'stuck' three times now. Let's explore what that feeling is really about.",
          "I'm noticing a pattern in how you describe this situation. You focus on others' needs before your own.",
          "The way your voice softened when you mentioned that person - they seem to have a significant impact on you.",
          "You're using a lot of absolute terms like 'always' and 'never'. I wonder if there's some black-and-white thinking happening?",
          "There seems to be a disconnect between what you say you want and the actions you're describing. Have you noticed that too?",
          "I hear hesitation in your voice. What's the thought behind that pause?"
        ];
        break;
        
      default:
        responses = [
          "I understand how you feel. Would you like to tell me more about it?",
          "That sounds challenging. I'm here to listen whenever you need me.",
          "I appreciate you sharing that with me. How does it make you feel?",
          "It's completely normal to feel that way. Would you like to explore why you might be feeling this?",
          "Thank you for trusting me with your thoughts. Is there something specific about this situation that's troubling you?",
          "I'm here for you. Let's take a deep breath together and continue when you're ready.",
          "Your feelings are valid. Would it help to talk more about what's on your mind?",
          "I'm listening. Please feel free to express yourself however you need to."
        ];
    }
    
    // Add some variety by determining if we should ask a follow-up question
    const shouldAskFollowUp = Math.random() > 0.4;
    
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (shouldAskFollowUp) {
      const followUps = [
        "How are you feeling about this right now?",
        "What would be most helpful for you in this moment?",
        "Would you like to tell me more?",
        "Have you noticed what triggers these feelings?"
      ];
      response += " " + followUps[Math.floor(Math.random() * followUps.length)];
    }
    
    return response;
  }
}

export default new SpeechProcessor();
