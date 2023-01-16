<template>
  <div class="jumbo">
    <h3>{{ menu && menu.label }}</h3>
    <div class="actions" v-if="menu">
      <button
        v-for="action in menu.actions"
        :key="action.id"
        @click="$emit('action', action)"
        class="action nude"
      >
        <AppIcon :icon="action.icon" fsize="1.5rem" /><span>{{
          action.text
        }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const menu = computed(() => store.state.setting.active);
    const clicked = (action) => {
      console.log(action);
    };
    return { menu, clicked };
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
    flex: 1 1 auto;
  }
  button.action {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
  }
}
</style>
