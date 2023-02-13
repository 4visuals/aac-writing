<template>
  <div class="hint" @click="hintClicked">
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
import { SpanText } from "@/components/text";
import kor from "hangul-js";
export default {
  props: ["hint"],
  components: {
    SpanText,
  },
  setup(props, { emit }) {
    const decompose = (text) => {
      const { hint } = props;
      // 강 => ㄱ ㅏ ㅇ
      let chars = text.split("");
      let phonemes;
      if (hint.cnt <= 2) {
        phonemes = chars.map((ch) => kor.disassemble(ch)[0]);
      } else {
        phonemes = chars;
      }
      return phonemes;
    };
    const hintClicked = () => {
      emit("hint-click", props.hint);
    };
    return { decompose, hintClicked };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  padding: 16px 0;
  .ch {
    flex: 0 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #ffeea8;
    color: #865900;
    border-radius: 30px;
    font-weight: 600;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  }
  @include mobile {
    .ch {
      flex-basis: 24px;
      height: 24px;
    }
  }
  @include tablet {
    .ch {
      flex-basis: 40px;
      height: 40px;
    }
  }
  @include desktop {
    .ch {
      flex-basis: 40px;
      height: 40px;
    }
  }
}
</style>
