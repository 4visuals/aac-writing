<template>
  <div class="scene" :class="{ fillH: fillHeight }">
    <div
      class="bg"
      :style="{ 'background-image': `url(${scenePath()})` }"
      @click="speak"
    ></div>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import { computed } from "vue";
import { useStore } from "vuex";
/**
 * 장면 사진만 렌더링 함
 */
export default {
  props: ["quizContext", "fillHeight"],
  setup() {
    const store = useStore();
    let question = computed(() => store.getters["quiz/currentPara"]);
    // console.log(question);
    const prefix = "https://kr.object.ncloudstorage.com/aacweb/scenes/";
    const scenePath = () => {
      const path = question.value.data.scenePicture;
      return path
        ? prefix + question.value.data.scenePicture
        : require("@/assets/volume-up.svg");
    };
    const speak = () => {
      tts.speak(question.value.data.sentence);
    };
    return {
      question,
      scenePath,
      speak,
    };
  },
};
</script>

<style lang="scss" scoped>
.scene {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  &.fillH {
    flex: 1 1 auto;
  }
  .bg {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    flex: 1 1 auto;
    max-width: 400px;
  }
}
</style>
