<template>
  <div class="menu-wrapper">
    <Transition name="dimmer">
      <div class="dimmer" v-if="slider" @click="hide"></div>
    </Transition>
    <Transition name="slider" @after-leave="store.commit('ui/hideMenu')">
      <div class="menu-body" v-if="slider">
        <MenuSection>
          <div class="menu-item">
            <UserProfile />
          </div>
        </MenuSection>
        <MenuSection title="목소리">
          <div class="menu-item">
            <VoiceElem :voice="activeVoice" @click="showTtsConfig" />
          </div>
        </MenuSection>
      </div>
    </Transition>
    <teleport to="body" v-if="modalComponent">
      <Modal ref="modal" @hidden="hideModal">
        <component :is="modalComponent" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref, shallowRef } from "vue";
import MenuSection from "./MenuSection.vue";
import Flag from "@/components/Flag.vue";
import { TtsConfig, VoiceElem } from "@/components/tts";
import { Modal } from "@/components";
// import OAuthButton2 from "@/components/oauth/OAuthButton2.vue";
import UserProfile from "./UserProfile.vue";
export default {
  components: {
    Flag,
    MenuSection,
    VoiceElem,
    Modal,
    UserProfile,
  },
  setup() {
    const store = useStore();
    const slider = ref(false);
    const modalComponent = shallowRef(null);
    // const loginButton = shallowRef(null);
    const hide = () => {
      // store.commit("ui/hideMenu");
      slider.value = false;
    };
    setTimeout(() => {
      slider.value = true;
    }, 0);

    const activeVoice = computed(() => store.getters["tts/activeVoice"]);
    const showTtsConfig = () => {
      modalComponent.value = TtsConfig;
    };
    const hideModal = () => {
      modalComponent.value = null;
    };
    const showLoginButton = () => {};
    onMounted(() => {
      // loginButton.value = OAuthButton;
    });
    return {
      store,
      hide,
      slider,
      activeVoice,
      showTtsConfig,
      hideModal,
      modalComponent,
      showLoginButton,
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
    width: 240px;
    background-color: white;
    position: relative;
    box-shadow: 2px 0 6px #0000004d;
    .menu-item {
      display: flex;
      align-items: center;
      dl,
      dd {
        margin: 0;
      }
    }
  }

  .dimmer-leave-to,
  .dimmer-enter-from {
    opacity: 0;
  }
  .dimmer-leave-active,
  .dimmer-enter-active {
    transition: opacity 0.15s ease-out;
  }

  .slider-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slider-enter-active {
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
  }

  .slider-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slider-leave-active {
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
  }
}
</style>
