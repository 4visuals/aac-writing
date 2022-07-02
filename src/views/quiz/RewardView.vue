<template>
  <div class="reward-wrapper">
    <input type="search" autocomplete="off" class="close" ref="disposer" />
    <transition name="pop" appear>
      <ImageView :imgPath="imgPath" @click="hideReward" />
    </transition>
  </div>
</template>

<script>
import ImageView from "@/components/ImageView.vue";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    ImageView,
  },
  setup() {
    const store = useStore();
    const reward = store.getters["ui/reward"];
    const disposer = ref(null);
    const imgPath = computed(() => {
      return require(`@/assets/reward/${reward}.png`);
    });
    const hideReward = () => {
      store.commit("ui/hideReward");
    };
    onMounted(() => {
      disposer.value.focus();
      // 키보드로 펭귄 닫는 코드 막아둠
    });
    return { reward, disposer, imgPath, hideReward };
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
  z-index: 5;
  .pop-enter-from,
  .pop-leave-to {
    transform: scale(0.1);
  }
  .pop-enter-active,
  .pop-leave-active {
    transition: all 0.15s cubic-bezier(0, 0, 0.3, 1.33);
  }
  input.close {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 0;
    height: 0;
    opacity: 0;
  }
}
</style>
