export const speakText = (text: string) => {
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; 
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };
  
// export const speakText = (text: string) => {
//   if (!text) return;
  
//   try {
//     // Cancel any ongoing speech first
//     window.speechSynthesis.cancel();
    
//     // Create the utterance after canceling
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US"; 
//     utterance.rate = 1.0; 
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;
    
//     // Add event handlers for debugging
//     utterance.onstart = () => console.log('Speech started');
//     utterance.onend = () => console.log('Speech ended');
//     utterance.onerror = (e) => console.error('Speech error:', e);
    
//     // Try to select a good voice (helps on mobile)
//     setTimeout(() => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         // Prefer voices that tend to work better on mobile
//         const preferredVoice = voices.find(
//           voice => voice.name.includes('Google') || 
//                    voice.name.includes('Female') || 
//                    voice.name.includes('US English')
//         );
//         if (preferredVoice) utterance.voice = preferredVoice;
//       }
      
//       // Speak the text
//       window.speechSynthesis.speak(utterance);
//     }, 100); // Small delay to ensure voices are loaded
//   } catch (error) {
//     console.error('Error in speech synthesis:', error);
//   }
// };