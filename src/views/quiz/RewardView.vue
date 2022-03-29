<template>
  <div class="reward-wrapper">
    <transition name="pop" appear>
      <ImageView :imgPath="imgPath" @click="handlClick" />
    </transition>
  </div>
</template>

<script>
import ImageView from "@/components/ImageView.vue";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    ImageView,
  },
  setup() {
    const store = useStore();
    const imgPath = computed(() => {
      const name = store.getters["ui/reward"];
      return require(`@/assets/reward/${name}.png`);
    });
    const handlClick = () => {
      store.commit("ui/hideReward");
    };
    return { imgPath, handlClick };
  },
};
</script>

<style lang="scss" scoped>
.reward-wrapper {
  background-color: #0000004d;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  overflow: hidden;
  .pop-enter-from,
  .pop-leave-to {
    transform: scale(0.1);
  }
  .pop-enter-active,
  .pop-leave-active {
    transition: all 0.15s cubic-bezier(0, 0, 0.3, 1.33);
  }
}
</style>
