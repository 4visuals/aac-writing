<template>
  <div
    class="section"
    :class="{ compact: compact === '', visited }"
    @click="$emit('itemClicked', item)"
  >
    <h1 :class="theme">
      <span>{{ idx }}</span
      ><span v-if="visited">+</span>
    </h1>
    <div class="desc" :class="theme">
      <!-- <h4>{{ item.title }}</h4> -->
      <ParaText :small="true">{{ item.description }}</ParaText>
      <ParaText class="sub" :class="theme" :small="true" v-if="desc">{{
        desc
      }}</ParaText>
    </div>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  components: {
    ParaText,
  },
  props: ["idx", "item", "theme", "compact", "desc", "history"],
  setup(props) {
    const store = useStore();
    const visited = computed(() =>
      store.getters["quizHistory/hasHistory"](props.item)
    );

    return {
      visited,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

@include mobile {
  .section {
    margin-top: 2rem;
    h1 {
      font-size: 1.8rem;
    }
  }
}
@include tablet {
  .section {
    margin-top: 2.2rem;
    h1 {
      font-size: 2.2rem;
    }
  }
}
@include desktop {
  .section {
    margin-top: 2.2rem;
    h1 {
      font-size: 2.2rem;
    }
  }
}
.section {
  user-select: none;
  position: relative;
  flex: 1;
  h1 {
    font-family: "Rowdies", cursive;
    position: absolute;
    left: 24px;
    transform: translateY(-60%);
    z-index: 10;
    border-radius: 24px;
    line-height: 1;
    display: block;
    color: #d23d70;
    display: inline-flex;
    align-items: center;
    &.green {
      // text-shadow: 2px 2px #d4e250;
      color: #20450a;
    }

    &.pink {
      // text-shadow: 2px 2px var(--aac-color-pink-500);
      color: var(--aac-color-pink-900);
    }
    &.yellow {
      // text-shadow: 2px 2px var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
    }

    &.blue {
      // text-shadow: 2px 2px #6c97dc;
      color: #0b0a45;
    }
  }
  .desc {
    padding: 16px 8px 8px 24px;
    border-radius: 16px;
    position: relative;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    column-gap: 16px;
    &::after {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      width: 8px;
      height: 24px;
      border-radius: 8px;
      background-color: #ffffff4d;
    }
    &:active {
      top: 2px;
      left: 2px;
      &.pink {
        box-shadow: 2px 2px var(--aac-color-pink-500);
      }
      &.yellow {
        box-shadow: 2px 2px var(--aac-color-yellow-400);
      }
      &.green {
        box-shadow: 2px 2px #d4e250;
      }
      &.blue {
        box-shadow: 2px 2px #6c97dc;
      }
    }
    @include mobile {
      h4 {
        font-size: 1.25rem;
      }
    }
    @include tablet {
      h4 {
        font-size: 2.5rem;
      }
    }
    @include desktop {
      h4 {
        font-size: 3rem;
      }
    }
    &.green {
      box-shadow: 4px 4px var(--aac-color-green-700);
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
    }

    &.pink {
      box-shadow: 4px 4px var(--aac-color-pink-500);
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
    }
    &.yellow {
      box-shadow: 4px 4px var(--aac-color-yellow-700);
      background-color: var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
    }

    &.blue {
      box-shadow: 4px 4px #6c97dc;
      background-color: #7ca2e0;
      color: #0b0a45;
    }
  }
  &.compact {
    margin: 0;
    display: inline-flex;
    white-space: nowrap;
    > h1 {
      left: 14px;
      top: 50%;
      font-size: 1.5rem;
      transform: translateY(-50%);
    }
    .desc {
      padding: 8px 16px 8px 32px;
      box-shadow: none;
      &:after {
        display: none;
      }
      &:active {
        top: 0px;
        left: 0px;
        box-shadow: none;
      }
      .sub {
        position: relative;
        &::before {
          content: "";
          display: block;
          height: 4px;
          width: 4px;
          border-radius: 2px;
          position: absolute;
          top: 50%;
          left: -10px;
          transform: translateY(-50%);
        }
        &.green {
          &::before {
            background-color: #20450a;
          }
        }

        &.pink {
          &::before {
            background-color: #d23d70;
          }
        }
        &.yellow {
          &::before {
            background-color: var(--aac-color-yellow-900);
          }
        }
      }
    }
  }
}
</style>
