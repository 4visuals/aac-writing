<template>
  <div class="c-info">
    <div class="container" :class="{ max480: maxWidth }">
      <div class="left" v-if="!hideLogo">
        <div class="logo">
          <img src="/img/icons/android-chrome-192x192.png" alt="그림한글" />
        </div>
      </div>
      <div class="mid">
        <div class="policy">
          <router-link
            active-class="pol"
            exact-active-class="active"
            to="/policy/tou"
            >이용 약관</router-link
          >
          |
          <router-link
            active-class="pol"
            exact-active-class="active"
            to="/policy/privacy"
            >개인정보처리방침</router-link
          >
        </div>
        <CompanyDetail />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import CompanyDetail from "../CompanyDetail.vue";

export default {
  props: {
    hideLogo: {
      default: false,
    },
  },
  setup() {
    const route = useRoute();
    const maxWidth = ref(false);
    watch(
      () => route.path,
      () => {
        const width = route.path === "/" ? "480px" : null;
        maxWidth.value = width;
      },
      { immediate: true }
    );
    return { maxWidth };
  },
  components: { CompanyDetail },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.c-info {
  position: sticky;
  top: 100%;
  .container {
    padding: 16px;
    display: flex;
    column-gap: 8px;
    background: linear-gradient(
      0deg,
      transparent 0%,
      #fffdf4 10%,
      #fffdf4 90%,
      transparent 100%
    );
    &.max480 {
      max-width: 480px;
    }
    .left {
      flex: 0 0;
      .logo {
        display: flex;
        align-items: center;
        column-gap: 4px;
        img {
          flex: 0 0 24px;
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 24px;
          white-space: nowrap;
          line-height: 1;
        }
      }
    }
    .mid {
      flex: 1 1 auto;
      font-size: 10px;
      .policy {
        a {
          padding: 2px 4px;
          text-decoration: none;
          font-size: 12px;
          &.active {
            background-color: #d0edff;
          }
        }
      }
    }
  }
}
@include mobile {
  .c-info {
    .left {
      display: none;
    }
  }
}
@include tablet {
}
@include desktop {
}
</style>
