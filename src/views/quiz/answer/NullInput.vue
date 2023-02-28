<template>
  <div>
    <ParaText>문장을 듣고 받아쓰기 공책에 직접 써 보세요.</ParaText>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { tts } from "@/components/tts";

export default {
  setup() {
    const store = useStore();

    const question = computed(() => store.getters["quiz/currentPara"]);
    const speak = () => {
      tts.speak(question.value.text, { clearPending: true });
    };
    watch(() => question.value, speak, { immediate: true });
    return {};
  },
  components: { ParaText },
};
</script>

<style lang="scss" scoped></style>
