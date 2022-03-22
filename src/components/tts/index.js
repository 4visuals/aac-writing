import ttsStore from "./tts-store";
import TtsConfig from "./TtsConfig.vue";
import VoiceElem from "./VoiceElem.vue";

class TTS {
  constructor() {
    ttsStore.init().then(() => {
      const voices = ttsStore.getVoicesByLang("ko-KR");
      ttsStore.setActiveVoice(voices[0]);
    });
  }
  speak(text) {
    const config = ttsStore.getVoiceConfig();
    var syn = new SpeechSynthesisUtterance(text);
    syn.lang = config.lang;
    syn.rate = config.rate;
    syn.pitch = config.pitch;
    syn.volume = config.volume;
    syn.voice = config.activeVoice;
    syn.onstart = (e) => {
      console.log("[SPEECH] START", e);
    };
    syn.on;
    syn.onend = (e) => {
      console.log("[SPEECH] DONE", e);
    };
    syn.onboundary = (e) => {
      const { charIndex, currentTarget } = e;
      const { text } = currentTarget;
      console.log("[BOUND]", text.substring(charIndex), e);
    };
    syn.onmark = (e) => {
      console.log("[MARK]", e);
    };
    speechSynthesis.speak(syn);
  }
}
const tts = new TTS();

export { tts, ttsStore, TtsConfig, VoiceElem };
