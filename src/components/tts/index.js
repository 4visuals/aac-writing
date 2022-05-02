import ttsStore from "./tts-store";
import TtsConfig from "./TtsConfig.vue";
import VoiceElem from "./VoiceElem.vue";
const DEFAULT_SPEAK_OPTION = {
  clearPending: false,
};
const clearPendings = () => {
  window.speechSynthesis.cancel();
};
class TTS {
  constructor() {
    ttsStore.init().then(() => {
      const voices = ttsStore.getVoicesByLang("ko-KR");
      ttsStore.setActiveVoice(voices[0]);
    });
  }
  speak(text, option) {
    option = option || DEFAULT_SPEAK_OPTION;
    if (option.clearPending) {
      clearPendings();
    }
    const config = ttsStore.getVoiceConfig();
    var syn = new SpeechSynthesisUtterance(text);
    syn.lang = config.lang;
    syn.rate = config.rate;
    syn.pitch = config.pitch;
    syn.volume = config.volume;
    syn.voice = config.activeVoice;
    return new Promise((done, failed) => {
      syn.onstart = () => {
        ttsStore.setSpeaking(true);
        // console.log("[SPEECH] START", e);
      };
      syn.on;
      syn.onend = (e) => {
        ttsStore.setSpeaking(false);
        // console.log("[SPEECH] DONE", e);
        done(text, e);
      };
      /*
      syn.onboundary = (e) => {
        const { charIndex, currentTarget } = e;
        const { text } = currentTarget;
        // console.log("[BOUND]", text.substring(charIndex), e);
      };
      syn.onmark = (e) => {
        console.log("[MARK]", e);
      };
      */
      syn.onerror = (e) => {
        ttsStore.setSpeaking(false);
        failed(e);
      };
      speechSynthesis.speak(syn);
    });
  }
}
const tts = new TTS();

export { tts, ttsStore, TtsConfig, VoiceElem };
