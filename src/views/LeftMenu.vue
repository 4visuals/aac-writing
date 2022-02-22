<template>
  <div class="menu-wrapper">
    <div class="dimmer" @click="hide"></div>
    <Transition name="slider" @after-leave="store.commit('ui/hideMenu')">
      <div class="menu-body" v-if="slider"></div>
    </Transition>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const store = useStore();
    console.log(store);
    const slider = ref(false);
    const hide = () => {
      console.log("done?");
      // store.commit("ui/hideMenu");
      slider.value = false;
    };
    setTimeout(() => {
      slider.value = true;
    }, 0);
    return {
      store,
      hide,
      slider,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  height: 100%;
  .dimmer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #7777774d;
  }
  .menu-body {
    height: 100%;
    width: 200px;
    background-color: white;
    position: relative;
    box-shadow: 2px 0 6px #0000004d;
  }

  .slider-enter-from {
    transform: translateX(-100%);
  }
  .slider-enter-active {
    transition: transform 0.2s ease-out;
  }

  .slider-leave-to {
    transform: translateX(-100%);
  }
  .slider-leave-active {
    transition: transform 0.2s ease-out;
  }
}
</style>
