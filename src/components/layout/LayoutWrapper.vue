<template>
  <div class="layout-h" :style="`padding-top: ${styles.topPadding}px`">
    <slot />
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const styles = reactive({ topPadding: 0 });
    const updatePadding = () => {
      const { path } = route;
      const padding = path.startsWith("/quiz") ? 16 : 0;
      styles.topPadding = padding;
    };
    watch(route, () => {
      setTimeout(updatePadding);
    });
    return { styles };
  },
};
</script>

<style lang="scss">
.layout-h {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  & > .layout-h-child {
    flex: 1 1 auto;
  }
  & > .w-1190px {
    max-width: 1190px;
    padding: 20px;
    padding-top: 0px;
  }
}
</style>
