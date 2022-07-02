<template>
  <div class="hint">
    <SpanText
      size="lg"
      class="ch"
      v-for="(ch, idx) in decompose(hint.text)"
      :key="idx"
      >{{ ch }}</SpanText
    >
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { SpanText } from "@/components/text";
import kor from "hangul-js";
export default {
  components: {
    SpanText,
  },
  setup() {
    const store = useStore();
    const hint = computed(() => store.state.quiz.hint);
    console.log(hint.value);

    const decompose = (text) => {
      // 강 => ㄱ ㅏ ㅇ
      let chars = text.split("");
      let phonemes;
      if (hint.value.cnt <= 2) {
        phonemes = chars.map((ch) => kor.disassemble(ch)[0]);
      } else {
        phonemes = chars;
      }
      return phonemes;
    };
    return { hint, decompose };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  .ch {
    flex: 0 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #ffc107;
    color: #523f03;
    border-radius: 30px;
    font-weight: 600;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  }
  @include mobile {
    .ch {
      flex-basis: 40px;
      height: 40px;
    }
  }
  @include tablet {
    .ch {
      flex-basis: 60px;
      height: 60px;
    }
  }
  @include desktop {
    .ch {
      flex-basis: 60px;
      height: 60px;
    }
  }
}
</style>
