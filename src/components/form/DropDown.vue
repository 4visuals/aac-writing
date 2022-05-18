<template>
  <div class="dropdown-wrapper">
    <input
      type="text"
      @click.stop="setVisible(true)"
      v-model="textField"
      @input="$emit('typing', $event.target.value)"
    />
    <div class="elem-container" v-if="containerVisible">
      <slot
        v-for="elem in items"
        :key="elem.seq"
        :item="elem"
        :setText="onSelected"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: ["items"],
  setup() {
    const containerVisible = ref(false);
    const textField = ref("");
    const close = () => {
      containerVisible.value = false;
      document.removeEventListener("click", close, false);
    };
    const setVisible = (visible) => {
      containerVisible.value = visible;
      // prevent current click to call 'click'
      document.addEventListener("click", close, false);
    };
    const onSelected = (text) => {
      // console.log("[on selected]", item);
      textField.value = text;
    };
    return { textField, containerVisible, setVisible, onSelected };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
  max-width: 250px;
  > input {
    width: 100%;
  }
  .elem-container {
    border: 1px solid #dcdcdc;
    padding: 0px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: absolute;
    background-color: white;
    width: 100%;
    top: 100%;
    left: 0;
    box-shadow: 0px 1px 1px #0000004d;
  }
}
</style>
