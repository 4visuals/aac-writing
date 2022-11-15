<template>
  <div class="toast-ui">
    <transition-group name="slide" tag="div" class="inner">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="`toast ${toast.type || 'info'}`"
      >
        <div class="left"></div>
        <div class="body">
          <h5 :class="{ mg0: !toast.title }">
            <span class="title">{{ toast.title }}</span>
          </h5>
          <div class="msg">{{ toast.msg }}</div>
        </div>
        <div class="right">
          <button class="nude" @click="closeToast(toast)">
            <span class="icon material-icons-outlined"> close </span>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const toasts = computed(() => store.getters["toast/toasts"]);

    const closeToast = (toast) => {
      store.commit("toast/close", toast);
    };
    return { toasts, closeToast };
  },
};
</script>

<style lang="scss" scoped>
.toast-ui {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10000;
  .inner {
    position: relative;
    .toast {
      margin: 8px 16px;
      display: flex;
      max-width: 240px;
      box-shadow: 1px 1px 2px #0000004d, 0 0 8px #00000022;
      .left {
        width: 4px;
        background-color: #1bb3ff;
      }
      .body {
        display: flex;
        flex-direction: column;
        padding: 8px 12px;
        font-size: 12px;
        flex: 1 1 auto;
        h5 {
          font-size: 1.1em;
          margin-bottom: 8px;
          font-weight: 600;
          &.mg0 {
            margin: 0;
          }
        }
        .msg {
          font-size: 1em;
        }
      }
      .right {
        color: inherit;
        button {
          color: inherit;
          padding: 4px;
          display: flex;
          .icon {
            font-size: 16px;
            line-height: 1;
          }
        }
      }
      &.info {
        background-color: #dfeff7;
        color: #145f7f;
        .left {
          background-color: #5289a0;
        }
      }
      &.success {
        background-color: #def3de;
        color: #1c6d1e;
        .left {
          background-color: #629563;
        }
      }
      &.warn {
        background-color: #fffca3;
        color: #974900;
        .left {
          background-color: #b56400;
        }
      }
      &.error {
        background-color: #f8dfdf;
        color: #c16c69;
        .left {
          background-color: #9b2622;
        }
      }
    }
  }
  .slide-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slide-enter-active {
    transition: all 0.15s ease;
  }
  .slide-enter-to {
    transform: translateX(0%);
  }

  .slide-leave-from {
    transform: translateX(0%);
  }
  .slide-leave-active {
    transition: all 0.15s ease;
  }
  .slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
}
</style>
