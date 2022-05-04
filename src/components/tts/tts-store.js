import store from "@/store";

store.registerModule("tts", {
  namespaced: true,
  state: () => ({
    voices: new Map(),
    ttsMode: "browser",
    activeVoice: null,
    option: {
      rate: 0.8,
      pitch: 1,
      volume: 0.5,
    },
    speaking: false,
  }),
  getters: {
    voiceKR: (state) => state.voices.get("ko-KR"),
    activeVoice: (state) => state.activeVoice,
    speaking: (state) => state.speaking,
  },
  mutations: {
    installVoices: (state, { voices, index }) => {
      voices.forEach((voice) => {
        const voiceName = voice.lang.replace("_", "-");
        let voiceList = state.voices.get(voiceName);
        if (!voiceList) {
          voiceList = [];
          state.voices.set(voiceName, voiceList);
        }
        voiceList.push(voice);
        state.activeVoice = voices[index];
      });
    },
    setActiveVoice: (state, voice) => {
      state.activeVoice = voice;
    },
    speaking: (state, on) => {
      state.speaking = on;
    },
  },
});

const loadVoices = (cb) => {
  /*
   * 처음 페이지가 렌더링 될때 잠깐동안 speech 관련 인스턴스가 로드되지 않음
   *
   */
  const voices = speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    setTimeout(loadVoices, 100, cb);
  } else {
    cb(voices);
  }
};

const init = () =>
  new Promise((resolve) => {
    loadVoices((voices) => {
      store.commit("tts/installVoices", { voices, index: 0 });
      resolve();
    });
  });
const getVoiceConfig = () => {
  const { activeVoice, option } = store.state.tts;
  return {
    activeVoice,
    lang: activeVoice.lang.replace("_", "-"),
    rate: option.rate,
    pitch: option.pitch,
    volume: option.volume,
  };
};
const setActiveVoice = (voice) => {
  store.commit("tts/setActiveVoice", voice);
};
const setSpeaking = (on) => store.commit("tts/speaking", on);
const getVoicesByLang = (lang) => store.state.tts.voices.get(lang);
const activeVoice = store.getters["tts/activeVoice"];

const setTtsMode = (mode) => (store.state.tts.ttsMode = mode);
const getTtsMode = () => store.state.tts.ttsMode;
export default {
  init,
  getVoiceConfig,
  setActiveVoice,
  getVoicesByLang,
  activeVoice,
  setSpeaking,
  setTtsMode,
  getTtsMode,
};
