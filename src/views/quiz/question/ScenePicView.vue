<template>
  <div
    class="scene"
    :class="{ fillH: fillHeight }"
    :style="{ 'background-image': `url(${scenePath()})` }"
    @click="speak"
  ></div>
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
    console.log(question);
    // https://kr.object.ncloudstorage.com/aacweb/scenes/ec281e4a-fc10-4f07-aee1-ab16f85837b5.png
    const prefix = "https://kr.object.ncloudstorage.com/aacweb/scenes/";
    const scenePath = () => prefix + question.value.data.scenePicture;
    const speak = () => {
      console.log(question.value.data);
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
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  &.fillH {
    flex: 1 1 auto;
  }
}
</style>
