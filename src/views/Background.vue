<template>
  <div v-if="visible" class="bg" :style="`--bg-color: ${themeRef.bgc}`"></div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const themeRef = computed(() => store.state.ui.theme);
    return {
      themeRef,
      visible: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background-color: var(--bg-color);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  // animation: bgslider 160s linear 0s infinite;
  overflow: hidden;
  transition: background-color 0.2s;
}
</style>
