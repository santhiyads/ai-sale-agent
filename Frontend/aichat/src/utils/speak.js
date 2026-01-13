export function speak(text, onEnd, onStart) {
  if (!window.speechSynthesis || !text) return;

  const synth = window.speechSynthesis;

  const cleanedText = text
    .replace(/\*\*/g, "")
    .replace(/[_~`]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/₹/g, "rupees ")
    .replace(/\s+/g, " ")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanedText);

  function startSpeaking() {
    const voices = synth.getVoices();

    // 1️⃣ Strong female preference
    let selectedVoice =
      voices.find(v => /zira/i.test(v.name)) ||
      voices.find(v => /female/i.test(v.name)) ||
      voices.find(v => /samantha/i.test(v.name)) ||
      voices.find(v => v.lang === "en-US") ||
      voices[0];

    if (!selectedVoice) return;

    utterance.voice = selectedVoice;

    // 🎶 Feminine tuning (works even on neutral voices)
    utterance.rate = 0.8;
    utterance.pitch = 1.25;   // higher pitch = feminine feel
    utterance.volume = 1;

    utterance.onstart = () => {
      onStart && onStart();   // avatar starts EXACTLY here
    };

    utterance.onend = () => {
      onEnd && onEnd();       // avatar stops EXACTLY here
    };

    synth.cancel();
    synth.speak(utterance);
  }

  // Chrome async voice fix
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = startSpeaking;
  } else {
    startSpeaking();
  }
}
