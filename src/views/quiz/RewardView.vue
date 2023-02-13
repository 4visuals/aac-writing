<template>
  <div class="reward-wrapper">
    <input
      type="search"
      autocomplete="off"
      class="close"
      ref="disposer"
      @keydown="moveNext"
    />
    <transition name="pop" appear>
      <ImageView class="img" :imgPath="imgPath" @click="hideReward" />
    </transition>
    <AppButton
      text="다음"
      borderColor="#4B7BEC"
      :fill="true"
      @click="hideReward"
    />
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
      return require(`@/assets/reward/${reward}.gif`);
    });
    const hideReward = () => {
      store.commit("ui/hideReward");
    };
    const moveNext = () => {
      hideReward();
    };

    onMounted(() => {
      setTimeout(() => disposer.value.focus(), 0);
      // 키보드로 펭귄 닫는 코드 막아둠
    });
    return { reward, disposer, imgPath, hideReward, moveNext };
  },
};
</script>

<style lang="scss" scoped>
.reward-wrapper {
  background-color: #ffffffcc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 5;
  .img {
    width: 100%;
  }
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
