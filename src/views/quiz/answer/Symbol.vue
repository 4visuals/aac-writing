<template>
  <div class="symbol">
    <div
      class="pic-holder"
      :style="{ 'background-image': `url('${pumsaImg()}')` }"
      @click.stop="speak"
    ></div>
    <div class="desc">
      <div class="text">{{ ej.text }}</div>
      <input
        type="text"
        v-if="!ej.isSolved"
        @keydown.enter.stop="flush"
        @keydown.tab.stop.prevent="flush"
        ref="inputEl"
        :tabindex="ej.order"
      />
    </div>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import { key, path } from "@/service/util";
import { ref, watch } from "@vue/runtime-core";
export default {
  props: ["ej"],
  setup(props, { emit }) {
    const pumsaImg = () => {
      if (props.ej.isSolved) {
        return path.resolveUrl(props.ej.picturePath);
      } else {
        const pumsa = props.ej.pumsa.startsWith("hada")
          ? "hada"
          : props.ej.pumsa;
        return require(`@/assets/s-${pumsa}.png`);
      }
    };
    const inputEl = ref(null);
    watch(
      () => props.ej.active,
      (active) => {
        if (active) {
          inputEl.value.focus();
        }
      }
    );
    const flush = (e) => {
      if (key.isComposing(e)) {
        return;
      } else {
        emit("typed", { ej: props.ej, value: e.target.value });
      }
    };
    const speak = () => {
      tts.speak(props.ej.text);
    };
    return {
      pumsaImg,
      flush,
      inputEl,
      speak,
    };
  },
};
</script>

<style lang="scss" scoped>
.symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pic-holder {
    width: 80px;
    height: 80px;
    background-size: contain;
  }
  .desc {
    font-size: 2.5rem;
    position: relative;
    text-align: center;
    .text {
      padding: 3px;
      border: 2px solid transparent;
      background-color: #d2d2d2;
      white-space: nowrap;
    }
    input {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: black;
      position: absolute;
      padding: 3px;
    }
  }
}
</style>
