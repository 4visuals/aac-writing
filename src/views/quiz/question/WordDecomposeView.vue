<template>
  <div class="decomp" @click="$emit('viewClicked')">
    <div class="chars">
      <button
        class="ch"
        :class="{ blank: ch === ' ' }"
        @click.stop=""
        v-for="(ch, idx) in chars"
        :key="idx"
        @click="decompose(ch)"
      >
        {{ ch === " " ? "&nbsp;" : ch }}
      </button>
    </div>
    <div class="phonemes">
      <template v-if="phonemes.length > 0">
        <button
          v-for="(phm, idx) in phonemes"
          :key="idx"
          @click.stop="speakPhoneme(phm)"
        >
          {{ phm }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import kor from "hangul-js";
import { ref } from "@vue/reactivity";
export default {
  props: ["word"],
  setup(props) {
    const sign = {
      ".": "마침표",
      ",": "쉼표",
      " ": "공백",
    };
    const chars = props.word.split("").filter((c) => c.trim().length > 0);
    const phonemes = ref([]);

    const decompose = (ch) => {
      // 강 => ㄱ ㅏ ㅇ
      tts.speak(sign[ch] || ch);
      phonemes.value = kor.disassemble(ch);
    };
    const speakPhoneme = (phm) => {
      const word = sign[phm] || phm;
      tts.speak(word);
    };
    return { chars, phonemes, decompose, speakPhoneme };
  },
};
</script>

<style lang="scss" scoped>
.decomp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffffcc;
  z-index: 10;
  display: flex;
  flex-direction: column;
  button {
    display: block;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    line-height: 1;
  }
  .chars {
    flex: 1 1 50%;
    display: flex;
    justify-content: center;
    column-gap: 8px;
    align-items: center;
    button {
      font-size: 2.5rem;
      background-color: gold;
      padding: 1.2rem;
      border-radius: 8px;
    }
  }
  .phonemes {
    flex: 1 1 50%;
    display: flex;
    justify-content: center;
    column-gap: 16px;
    align-items: flex-start;
    button {
      font-size: 3.5rem;
      padding: 1.5rem;
      border-radius: 8px;
    }
  }
}
</style>
