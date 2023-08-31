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
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  h3 {
    font-size: 6vmin;
    font-weight: 900;
  }
  .actions {
    display: flex;
    justify-content: center;
    button.action {
      display: flex;
      align-items: center;
      column-gap: 2px;
      font-size: 1.2rem;
    }
  }
}
</style>
