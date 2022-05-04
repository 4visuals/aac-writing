<template>
  <div class="tts-config">
    <div class="title">
      <h3>TTS설정</h3>
      <SwitchButton
        v-model:selected="browserMode"
        onText="기본"
        offText="서연"
      />
    </div>
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
import { SwitchButton } from "@/components/form";
import VoiceElem from "./VoiceElem.vue";
import ttsStore from "./tts-store";
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    VoiceElem,
    SwitchButton,
  },
  setup() {
    const store = useStore();
    const voices = ttsStore.getVoicesByLang("ko-KR");
    const browserMode = ref(ttsStore.getTtsMode() === "browser");
    const activeVoice = computed(() => store.getters["tts/activeVoice"]);
    const selectVoice = (voice) => {
      ttsStore.setActiveVoice(voice);
    };
    watch(
      () => browserMode.value,
      (on) => {
        const mode = on ? "browser" : "polly";
        ttsStore.setTtsMode(mode);
      }
    );
    return {
      browserMode,
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
  .title {
    display: flex;
    align-items: center;
    > h3 {
      flex: 1 1 auto;
    }
  }
}
</style>
