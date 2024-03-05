import ttsStore from "./tts-store";
import TtsConfig from "./TtsConfig.vue";
import VoiceElem from "./VoiceElem.vue";
import md5 from "crypto-js/md5";
import env from "@/service/env";
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
    if (localStorage.getItem("aac.skip.tts") === "true") {
      return Promise.resolve(text);
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
      };
      syn.onend = (e) => {
        ttsStore.setSpeaking(false);
        done(text, e);
      };
      syn.onerror = (e) => {
        ttsStore.setSpeaking(false);
        failed(e);
      };
      speechSynthesis.speak(syn);
    });
  }
}
const browser = new TTS();

class PollyTts {
  speak(text, option = { delay: 0, closePending: false }) {
    if (text.length === 0) {
      return Promise.resolve();
    }
    if (localStorage.getItem("aac.skip.tts") === "true") {
      return Promise.resolve(text);
    }
    if (option.closePending && this.pendingAudio) {
      this.pendingAudio.pause();
    }
    const textHash = md5(text.trim()).toString();
    const url = `${env.TTS_POLLY_PATH}/voices3/${textHash}.mp3`;

    let audio = new Audio(url);
    audio.preload = "auto";
    audio.load();
    audio.playbackRate = 0.9;
    ttsStore.setSpeaking(true);
    return new Promise((done, failed) => {
      audio.onended = (e) => {
        ttsStore.setSpeaking(false);
        this.pendingAudio = undefined;
        done(text, e);
      };
      audio.onerror = (e) => {
        console.log("[AUDIO ERROR]", e);
        ttsStore.setSpeaking(false);
        this.pendingAudio = undefined;
        failed(e);
      };
      if (option.delay > 0) {
        setTimeout(() => {
          audio.play().catch((e) => {
            console.log(`[${e.name}]`, e);
            ttsStore.setSpeaking(false);
            this.pendingAudio = undefined;
          });
        }, option.delay);
      } else {
        audio.play().catch((e) => {
          console.log(`[${e.name}]`, e);
          ttsStore.setSpeaking(false);
          this.pendingAudio = undefined;
        });
      }
      this.pendingAudio = audio;
    });
  }
}
const polly = new PollyTts();

const ttsSet = {
  browser,
  polly,
};
const tts = {
  speak(text, option) {
    const mode = ttsStore.getTtsMode();
    return ttsSet[mode].speak(text, option);
  },
};
export { tts, ttsStore, TtsConfig, VoiceElem };
