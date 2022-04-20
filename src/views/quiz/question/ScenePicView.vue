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
  setup(_, { emit }) {
    const store = useStore();
    let question = computed(() => store.getters["quiz/currentPara"]);
    const prefix = {
      aacweb: {
        symbol: "https://kr.object.ncloudstorage.com/aacweb/symbols/after",
        scene: "https://kr.object.ncloudstorage.com/aacweb/scenes/",
      },
    };
    const symbolUrl = () => {
      // 낱말 받아쓰기에서 어절의 사진을 장면으로 사용
      // 낱말은 [글쓰기]에서 작성했기때문에 장면 사진이 따로 없다!
      // picturePath: "aacweb:/Ara/4c5c5e29-bb5e-48fc-a788-178b299c6e8f.png"
      const { picturePath } = question.value.eojeols[0];
      const pathes = picturePath.split(":");
      return prefix[pathes[0]].symbol + pathes[1];
    };
    const sceneUrl = () => {
      // 문장 받아쓰기에서 문장의 장면을 사용
      const path = question.value.data.scenePicture;
      // 교과서 받아쓰기용 문장은 [글쓰기]에서 작성했기때문에 장면 사진이 따로 없다. 볼륨 이미지를 대신 사용함.
      return path
        ? prefix.aacweb.scene + question.value.data.scenePicture
        : require("@/assets/volume-up.svg");
    };

    const speak = () => {
      tts.speak(question.value.data.sentence);
      emit("speaking");
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
