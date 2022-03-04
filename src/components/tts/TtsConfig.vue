<template>
  <div class="tts-config">
    <h3>TTS설정</h3>
    <div class="voices">
      <div class="voice" v-for="vc in voices" :key="vc.voiceURI">
        <span v-if="vc === activeVoice">[V]</span>
        <span v-else>[_]</span>
        <VoiceElem :voice="vc" @click="selectVoice(vc)" />
      </div>
    </div>
  </div>
</template>

<script>
import VoiceElem from "./VoiceElem.vue";
import ttsStore from "./tts-store";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    VoiceElem,
  },
  setup() {
    const store = useStore();
    const voices = ttsStore.getVoicesByLang("ko-KR");
    const activeVoice = computed(() => store.getters["tts/activeVoice"]);
    const selectVoice = (voice) => {
      ttsStore.setActiveVoice(voice);
    };
    return {
      voices,
      activeVoice,
      selectVoice,
    };
  },
};
</script>

<style lang="scss" scoped>
.tts-config {
  padding: 16px;
}
</style>
