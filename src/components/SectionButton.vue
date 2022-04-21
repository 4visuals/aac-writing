<template>
  <div class="section" @click="$emit('itemClicked', item)">
    <h1 :class="theme">{{ idx }}</h1>
    <div class="desc" :class="theme">
      <!-- <h4>{{ item.title }}</h4> -->
      <ParaText :small="true">{{ item.description }}</ParaText>
    </div>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
export default {
  components: {
    ParaText,
  },
  props: ["idx", "item", "theme"],
  setup() {
    // console.log(props.item);
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
    &.green {
      text-shadow: 2px 2px #d4e250;
      color: #20450a;
    }

    &.pink {
      text-shadow: 2px 2px #f4abc4;
      color: #d23d70;
    }
    &.yellow {
      text-shadow: 2px 2px var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
    }

    &.blue {
      text-shadow: 2px 2px #6c97dc;
      color: #0b0a45;
    }
  }
  .desc {
    padding: 16px 8px 8px 24px;
    border-radius: 16px;
    position: relative;
    cursor: pointer;
    height: 100%;
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
        box-shadow: 4px 4px #f4abc4;
      }
      &.yellow {
        box-shadow: 4px 4px var(--aac-color-yellow-400);
      }
      &.green {
        box-shadow: 4px 4px #d4e250;
      }
      &.blue {
        box-shadow: 4px 4px #6c97dc;
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
      box-shadow: 6px 6px var(--aac-color-green-700);
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
    }

    &.pink {
      box-shadow: 6px 6px var(--aac-color-pink-700);
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
    }
    &.yellow {
      box-shadow: 6px 6px var(--aac-color-yellow-700);
      background-color: var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
    }

    &.blue {
      box-shadow: 6px 6px #6c97dc;
      background-color: #7ca2e0;
      color: #0b0a45;
    }
  }
}
</style>
