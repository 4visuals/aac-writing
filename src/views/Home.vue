<template>
  <div class="home">
    <h3 class="sub title">그림한글</h3>
    <h1 class="main title">받아쓰기</h1>
    <!-- <input type="text" /> -->
    <TextField value="이름" :style="style.text" />
    <div>
      <AacButton
        text="단계별 받아쓰기"
        :style="style.button"
        @click="moveTo('/level')"
      /><AacButton
        text="교과서 받아쓰기"
        :style="style.button"
        @click="moveTo('/book')"
      />
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { useStore } from "vuex";
import { AacButton, TextField } from "@/components/form";

export default {
  name: "Home",
  components: {
    AacButton,
    TextField,
  },
  setup() {
    const store = useStore();
    console.log(store.state.course);
    const style = {
      button: {
        "font-size": "4rem",
      },
      text: {
        "font-size": "4rem",
      },
    };
    const moveTo = (url) => {
      console.log("move to ", url);
      router.push(url);
    };
    return {
      style,
      moveTo,
    };
  },
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
  .title {
    margin: 1rem 0;
    font-family: "Roboto", sans-serif;
    &.main {
      font-size: 12rem;
    }
    &.sub {
      font-size: 6rem;
      color: #146b27;
    }
  }
}
</style>
