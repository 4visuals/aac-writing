<template>
  <div class="jumbo" :class="{ expanded: nav.expanded }">
    <Wave :bgc="themes[theme].bgc" />
    <div class="container">
      <div class="row jumbo-body">
        <div class="col-12">
          <BrandName :theme="themes[theme].button" :text="text" :path="path" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wave from "@/components/Wave.vue";
import BrandName from "./BrandName.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const themes = {
  gold: {
    bgc: "gold",
    button: {
      color: "#865900",
      bgc: "#ffec88",
    },
  },
  pink: {
    bgc: "#ff9bbd",
    button: {
      color: "#d23d70",
      bgc: "#ffe1ea",
    },
  },
};
export default {
  components: {
    Wave,
    BrandName,
  },
  props: ["theme", "text", "path"],
  setup() {
    const store = useStore();
    const nav = computed(() => store.getters["ui/nav"]);
    return { nav, themes };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.jumbo {
  // padding: 4rem 6rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  transition: height 0.3s ease-out;
  pointer-events: none;
  &.expanded {
    height: 120px;
    .container {
      .jumbo-body {
        justify-content: center;
      }
    }
  }
  .container {
    height: 100%;
    .jumbo-body {
      height: 100%;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
  }
}
@include mobile {
  .jumbo {
    height: calc(1.5rem + 32px);
  }
}
@include tablet {
  .jumbo {
    height: calc(2rem + 32px);
  }
}
@include desktop {
  .jumbo {
    height: calc(2rem + 32px);
  }
}
</style>
