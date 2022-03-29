<template>
  <div class="scene" :class="{ fillH: fillHeight }">
    <ImageView
      :imgPath="question.isWord() ? symbolUrl() : sceneUrl()"
      @click="speak"
    />
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import { computed } from "vue";
import { useStore } from "vuex";
import ImageView from "@/components/ImageView.vue";
/**
 * 장면 사진만 렌더링 함
 */
export default {
  components: {
    ImageView,
  },
  props: ["quizContext", "fillHeight"],
  setup() {
    const store = useStore();
    let question = computed(() => store.getters["quiz/currentPara"]);
    console.log(question.value.isWord());
    // const prefix = "https://kr.object.ncloudstorage.com/aacweb/scenes/";
    const prefix = {
      aacweb: {
        symbol: "https://kr.object.ncloudstorage.com/aacweb/symbols/after",
        scene: "https://kr.object.ncloudstorage.com/aacweb/scenes/",
      },
    };
    const symbolUrl = () => {
      // 단어 학습(퀴즈)
      // picturePath: "aacweb:/Ara/4c5c5e29-bb5e-48fc-a788-178b299c6e8f.png"
      const { picturePath } = question.value.eojeols[0];
      const pathes = picturePath.split(":");
      return prefix[pathes[0]].symbol + pathes[1];
    };
    const sceneUrl = () => {
      const path = question.value.data.scenePicture;
      return path
        ? prefix.aacweb.scene + question.value.data.scenePicture
        : require("@/assets/volume-up.svg");
    };
    const speak = () => {
      tts.speak(question.value.data.sentence);
    };
    return {
      question,
      symbolUrl,
      sceneUrl,
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
}
</style>
