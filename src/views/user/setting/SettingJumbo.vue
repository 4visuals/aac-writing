<template>
  <div class="jumbo">
    <h3>{{ menu && menu.label }}</h3>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const menu = computed(() => store.state.setting.active);
    return { menu };
  },
};
</script>

<style lang="scss" scoped>
.jumbo {
  position: sticky;
  top: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 0 8px #00000022, 0 0 2px #00000044;
  background-color: white;
  z-index: 10;
  h3 {
    font-weight: 900;
  }
}
</style>
