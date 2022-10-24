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
          <router-link to="/policy/tou">이용 약관</router-link> |
          <router-link to="/policy/privacy">개인정보처리방침</router-link>
        </div>
        <div>
          (주)성주코퍼레이션 | 정인균 | 사업자번호 402-88-01673 | TEL:
          070-7808-8807
        </div>
        <div>서울특별시 성동구 왕십리로 24나길 20, 2층 243호 (창성빌딩)</div>
        <div>© 2022 그림한글. All rights reserved.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

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
