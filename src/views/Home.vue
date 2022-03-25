<template>
  <div class="home">
    <h3 class="sub title">그림한글</h3>
    <h1 class="main title">받아쓰기</h1>
    <div class="menu">
      <AacButton text="시작" theme="pink" @click="moveTo('/book')" />
      <!-- <AacButton
        text="단계별 받아쓰기"
        theme="pink"
        @click="moveTo('/level')"
      /><AacButton
        text="교과서 받아쓰기"
        theme="blue"
        @click="moveTo('/book')"
      /> -->
    </div>
  </div>
</template>

<script>
import router from "@/router";
// import { useStore } from "vuex";
import { AacButton } from "@/components/form";

export default {
  name: "Home",
  components: {
    AacButton,
  },
  setup() {
    // const store = useStore();
    // store.dispatch("course/loadChapter", { origin: "L" });
    const moveTo = (url) => {
      console.log("move to ", url);
      router.push(url);
    };
    return {
      moveTo,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  .home {
    font-size: 2rem;
  }
}
@include tablet {
  .home {
    font-size: 6rem;
  }
}
@include desktop {
  .home {
    font-size: 6rem;
  }
}
.home {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .title {
    font-family: "Roboto", sans-serif;
    &.main {
      font-size: 2em;
    }
    &.sub {
      font-size: 1em;
      color: #146b27;
    }
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 1rem;
  }
}
</style>
