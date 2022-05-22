<template>
  <div class="home">
    <h3 class="sub title">그림한글</h3>
    <h1 class="main title">받아쓰기</h1>
    <p></p>
    <div class="menu" v-if="host.isPwaMode()">
      <AacButton text="시작" theme="pink" @click="moveTo('/level')" />
    </div>
    <div class="menu" v-else-if="host.isStudentMode()">
      <StudentLoginForm />
    </div>
    <div class="menu" v-else>
      <AacButton text="시작" theme="pink" @click="moveTo('/level')" />
    </div>
  </div>
</template>

<script>
import { host } from "@/service/util";
import router from "@/router";
import StudentLoginForm from "./StudentLoginForm.vue";
import { AacButton } from "@/components/form";

export default {
  name: "Home",
  components: {
    AacButton,
    StudentLoginForm,
  },
  setup() {
    const moveTo = (url) => {
      // console.log("move to ", url);
      router.push(url);
    };
    return {
      moveTo,
      host,
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
    font-size: 2.5rem;
  }
}
@include desktop {
  .home {
    font-size: 2.5rem;
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
